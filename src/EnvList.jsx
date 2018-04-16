import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as EnvActions from './actions';
import cx from 'classnames';
import global from './global';
import getSvg from '../static';

const Modal = global.sdk.Modal;
const i18n = global.i18n;


class EnvList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }
  componentWillMount () {
    this.fetch()
  }
  render() {
    const { envList, currentEnv, operating, operatingMessage } = this.props
    return (
      <div className="env-list" >
      <div className="env-list-container" >
        <div className="env-list-panel">
          <div className="panel-heading"><i className="icon fa fa-desktop" />{i18n`list.environments`}</div>
          <div className="panel-body">
            <div className="list-group">
              {envList.length > 0 ? (
                envList.map((env) => {
                  return (
                    <EnvItem
                      node={env}
                      key={env.name}
                      isCurrent={(currentEnv.name === env.name)}
                      handleSave={this.handleSave}
                      handleReset={this.handleReset}
                      handleDelete={this.handleDelete}
                      handleSwitch={this.handleSwitch}/>
                  )
                })
              ): ''}
            </div>
          </div>
        </div>
      </div>
      {operating ? (
        <div className="mask">
          <div className="progress">
            <i className="fa fa-refresh fa-spin" />
            {operatingMessage}
          </div>
        </div>
      ) : ''}
    </div>
    );
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
  handleSave = (e) => {
    e.preventDefault()
    const defaultValue = 'new-environment'
    Modal.showModal('Prompt', {
      message: i18n`list.newEnvironmentName`,
      defaultValue: defaultValue,
      selectionRange: [0, defaultValue.length]
    }).then(this.createEnv)
  }
  handleReset = async (name, e) => {
    e.preventDefault()
    var confirmed = await Modal.showModal('Confirm', {
      header: i18n`list.handleReset.header`,
      message: i18n`list.handleReset.message${{name}}`,
      okText: i18n`list.handleReset.okText`
    })
    Modal.dismissModal()
    if (confirmed) {
      this.props.actions.envReset()
    }
  }
  createEnv = (name) => {
    Modal.dismissModal()
    this.props.actions.envSave({name})
  }
  handleDelete = async (name, e) => {
    e.preventDefault()
    var confirmed = await Modal.showModal('Confirm', {
      header: i18n`list.handleDelete.header`,      
      message: i18n`list.handleDelete.message${{name}}`,      
      okText: i18n`list.handleDelete.okText`
    })
    Modal.dismissModal()
    if (confirmed) {
      this.props.actions.envDelete({name})
    }
  }
  handleSwitch = async (name, e) => {
    e.preventDefault()
    var confirmed = await Modal.showModal('Confirm', {
      header: i18n`list.handleSwitch.header`,      
      message: i18n`list.handleSwitch.message${{name}}`,      
      okText: i18n`list.handleSwitch.okText`,      
    })
    Modal.dismissModal()
    if (confirmed) {
      this.props.actions.envSwitch({name})
    }
  }
}

const EnvItem = ({node, isCurrent, handleSave, handleReset, handleDelete, handleSwitch}) => {
  let createdDate
  const isShared = (node.owner && (node.owner.globalKey !== config.owner.globalKey))

  if (node.createdDate) {
    createdDate = new Date(node.createdDate)
    const year = createdDate.getFullYear()
    let month = createdDate.getMonth() + 1
    let date = createdDate.getDate()
    if (month < 10) {
      month = `0${month}`
    }
    if (date < 10) {
      date = `0${date}`
    }
    createdDate = `${year}-${month}-${date}`
  }
  return (
    <div className={cx('env-item', { current: isCurrent })}>
      <div className="env-item-heading">
        <i className="fa fa-desktop" />
        {node.isGlobal ? getSvg(node.displayName) : getSvg('share')}
        {node.displayName}
      </div>
      <div className="env-item-body">
        {node.owner ? (
          <div>
            <i className="fa fa-user"> {node.owner.name}</i>
            <i className="fa fa-clock-o"> {createdDate}</i>
          </div>
        ) : (
          <div>{ node.description }</div>
        )}
      </div>
      {isCurrent ? (
        <div className="btn-group">
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            <i className="fa fa-floppy-o" />
            {i18n`list.save`}
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleReset.bind(null, node.name)}>
            <i className="fa fa-undo" />
            {i18n`list.reset`}         
          </button>
        </div>
      ) : (
        <div className="btn-group">
          <button className="btn btn-primary btn-sm" onClick={handleSwitch.bind(null, node.name)}>
            <i className="fa fa-play" />
            {i18n`list.use`}
          </button>
          <button className="btn btn-primary btn-sm" disabled={isShared || node.isGlobal} onClick={handleDelete.bind(null, node.name)}>
            <i className="fa fa-trash-o" />
            {i18n`list.delete`}
          </button>
        </div>
      )}
    </div>
  )
}

EnvList.propTypes = {
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
}))(EnvList);
