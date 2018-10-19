import React, { Component } from 'lib/react';
import PropTypes from 'lib/propTypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as EnvActions from './actions';
import cx from 'classnames';
import global from './global';
import Menu from 'app/components/Menu';
import emitter, * as E from 'app/utils/emitter'

const Modal = global.sdk.Modal;
const i18n = global.i18n;

class EnvMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isActive: false
    }
    this.onEnvHide = this.onEnvHide.bind(this)
    this.onEnvShow = this.onEnvShow.bind(this)
  }
  componentWillMount() {
    this.fetch()
    emitter.on(E.TERM_ENV_HIDE, this.onEnvHide)
    emitter.on(E.TERM_ENV_SHOW, this.onEnvShow)
  }
  componentWillUnmount () {
    emitter.removeListener(E.TERM_ENV_HIDE, this.onEnvHide)
    emitter.removeListener(E.TERM_ENV_SHOW, this.onEnvShow)
  }
  render() {
    const { envList, currentEnv, operating, operatingMessage } = this.props
    if (this.state.isActive) {
      return (
        <Menu className={cx('bottom-up to-left', { active: this.state.isActive })}
          style={{
            position: 'relative',
            border: 0,
          }}
          items={this.makeBrancheMenuItems({
            currentEnv,
            envList
          })}
          deactivate={this.deactivate.bind(this, false)}
        />
      );
    }
    return <div></div>
  }
  onEnvHide () {
    this.setState({ isActive: false })
  }
  onEnvShow () {
    this.setState({ isActive: true })
  }
  deactivate (isActive, isTogglingEnabled) {
    // if (isTogglingEnabled) { isActive = !this.state.isActive }
    // if (isActive) {
      // this.props.getBranches()
    // }
    // this.setState({ isActive: false })
    // if (!this.state.isActive) {
    //   this.setState({ isActive: true })
    // } else {
    //   // emitter.emit(E.TERM_ENV_HIDE)
    //   this.setState({ isActive: false })
    // }
    emitter.emit(E.TERM_ENV_HIDE)
    this.setState({ isActive: false })
  }
  makeBrancheMenuItems ({ envList, currentEnv }) {
    const tempList = envList.filter((envItem) => envItem.name !== currentEnv.name).splice(0, 4)
    const envItems = tempList.map((envItem) => ({
      name: envItem.name,
      icon: '',
      items: [
        {
          name: i18n.get('list.use'),
          command: () => this.handleSwitch(envItem.name)
        },
        {
          name: i18n.get('list.delete'),
          command: () => this.handleDelete(envItem.name)
        },
      ]
    }))
    return [
      { name: i18n.get('list.currentEnv'), isDisabled: true },
      { 
        name: currentEnv.name,
        icon: '',
        items: [{
          name: i18n.get('list.save'),
          command: () => this.handleSave(currentEnv.name)
        }, {
          name: i18n.get('list.reset'),
          command: () => this.handleReset(currentEnv.name)
        }]
      },
      { name: i18n.get('list.envList'), isDisabled: true },
      ...envItems,
      // { 
      //   name: i18n.get('list.currentEnv'),
      //   icon: '',
      //   command: () => this.handleMore()
      // },
    ]
  }
  fetch = () => {
    const envIdPromise = this.props.actions.envId()
    const envListPromise = this.props.actions.envList()
    Promise.all([envIdPromise, envListPromise]).then((res) => {
      this.setState({
        isLoading: false,
      })
    })
  }
  handleSave = () => {
    const defaultValue = 'new-environment'
    Modal.showModal('Prompt', {
      message: i18n`list.newEnvironmentName`,
      defaultValue: defaultValue,
      selectionRange: [0, defaultValue.length]
    }).then(this.createEnv)
  }
  handleReset = async (name) => {
    var confirmed = await Modal.showModal('Confirm', {
      header: i18n`list.handleReset.header`,
      message: i18n`list.handleReset.message${{ name }}`,
      okText: i18n`list.handleReset.okText`
    })
    Modal.dismissModal()
    if (confirmed) {
      this.props.actions.envReset()
    }
  }
  createEnv = (name) => {
    Modal.dismissModal()
    this.props.actions.envSave({ name })
  }
  handleDelete = async (name) => {
    var confirmed = await Modal.showModal('Confirm', {
      header: i18n`list.handleDelete.header`,
      message: i18n`list.handleDelete.message${{ name }}`,
      okText: i18n`list.handleDelete.okText`
    })
    Modal.dismissModal()
    if (confirmed) {
      this.props.actions.envDelete({ name })
    }
  }
  handleSwitch = async (name) => {
    var confirmed = await Modal.showModal('Confirm', {
      header: i18n`list.handleSwitch.header`,
      message: i18n`list.handleSwitch.message${{name}}`,
      okText: i18n`list.handleSwitch.okText`,
    })
    Modal.dismissModal()
    if (confirmed) {
      this.props.actions.envSwitch({ name })
    }
  }
  handleMore = () => {
    console.log('handleMore')
  }
}

EnvMenu.propTypes = {
  name: PropTypes.string,
  dispatch: PropTypes.func,
  counts: PropTypes.number,
  onClickDebug: PropTypes.func,
};

const mapStateToProps = (state) => {
  const {
      local: {
        envList = [], currentEnv = null, operating, operatingMessage
      }
    } = state
  return ({
    envList,
    currentEnv,
    operating,
    operatingMessage,
  });
};
export default connect(mapStateToProps, dispatch => ({
  actions: bindActionCreators(EnvActions, dispatch)
}))(EnvMenu);