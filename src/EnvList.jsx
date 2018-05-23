import React, { Component, PropTypes } from 'lib/react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { observer } from 'lib/mobxReact';
import * as EnvActions from './actions';
import { setCurrentEnv } from './api';
import cx from 'classnames';
import global from './global';
import ServerInfo from './ServerInfo';
import getSvg from '../static';
import settings from 'app/settings'
import EnvListSelector from './EnvListSelector';
import EnvListRenameModal from './EnvListRenameModal';

const Modal = global.sdk.Modal;
const i18n = global.i18n;

const language = settings.general.language

class EnvList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      oldEnvId: '',
    }
  }
  componentWillMount() {
    this.fetch();
    Modal.modalRegister('EnvListSelector', EnvListSelector);
    Modal.modalRegister('EnvListRenameModal', EnvListRenameModal);
  }
  render() {
    const { envList, currentEnv, operating, operatingMessage } = this.props
    return (
      <div className="env-list">
      <div className="env-list-container">
        <div className="env-list-panel">
          <div className="panel-heading">
            <i className="icon fa fa-desktop" />{i18n`list.environments`}
          </div>
          <div className="panel-body">
            <ServerInfo />
            <p className="env-add-button">
              <button className="btn btn-default" onClick={(e) => this.handleAddAEnv(this.state.oldEnvId, e)}>
                + {i18n`list.addEnvironment`}
              </button>
            </p>
            <div className="list-group">
              {
                envList.length > 0
                ?
                (
                  envList.map((env) => {
                    return (
                      <EnvItem
                        node={env}
                        oldEnvId={this.state.oldEnvId}
                        key={env.name}
                        isCurrent={(currentEnv.name === env.name)}
                        handleRename={this.handleRename}
                        handleReset={this.handleReset}
                        handleDelete={this.handleDelete}
                        handleSwitch={this.handleSwitch}/>
                    )
                  })
                )
                :
                ''
              }
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
      </div>
    );
  }
  fetch = () => {
    const { actions } = this.props
    const envIdPromise = actions.envId()
    const envListPromise = actions.envList()
    Promise.all([envIdPromise, envListPromise]).then((res) => {
      const { currentEnv, envList } = this.props;
      if (!envList.find((env) => env.name === currentEnv.name)) {
        setCurrentEnv(currentEnv.name)
      }
      this.setState({
        isLoading: false,
        oldEnvId: currentEnv.name,
      })
    })
  }
  handleAddAEnv = (oldEnvId, e) => {
    e.preventDefault()
    Modal.showModal({
      type: 'EnvListSelector',
      position: 'center',
      message: '选择运行环境',
    }).then((data) => {
      this.handleSwitch(oldEnvId, data);
    })
  }
  handleRename = (node, e) => {
    e.preventDefault();
    const lang = language.value;
    Modal.showModal({ type: 'EnvListRenameModal' }).then(({ displayName, desc }) => {
      if (!displayName) {
        displayName = node.displayName;
      }
      if (!desc) {
        desc = lang === 'English' ? node.description : node.descriptionCN;
      }
      this.props.actions.envRename({ envId: node.name, displayName, desc });
    });
  }
  handleReset = async (name, e) => {
    e.preventDefault()
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
  handleDelete = async (name, e) => {
    e.preventDefault()
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
  handleSwitch = async (oldEnvId, newEnvId, e) => {
    e && e.preventDefault()
    var confirmed = await Modal.showModal('Confirm', {
      header: i18n`list.handleSwitch.header`,
      message: i18n`list.handleSwitch.message${{ name: newEnvId }}`,
      okText: i18n`list.handleSwitch.okText`,
    })
    Modal.dismissModal()
    if (confirmed) {
      this.props.actions.envSwitch({ oldEnvId, newEnvId })
      this.setState({
        oldEnvId: newEnvId,
      })
    }
  }
}

@observer
class EnvItem extends Component {
  render() {
    const languageValue = language.value
    const { oldEnvId, node, isCurrent, handleRename, handleReset, handleDelete, handleSwitch } = this.props;
    const isShared = (node.owner && (node.owner.globalKey !== config.owner.globalKey))
    if (node.name === 'ide-tty') {
      node.description = ' Ubuntu 14.04.4 with Python 2.7.12, Python 3.5.2'
      node.descriptionCN = ' Ubuntu 14.04.4 已安装 Python 2.7.12，Python 3.5.2'
    }
    return (
      <div className={cx('env-item', { current: isCurrent })}>
        <div className="env-item-heading">
          {getSvg(node.displayName)}
          {node.displayName}
        </div>
        <div className="env-item-body">{languageValue === 'English' ? node.description : node.descriptionCN}</div>
        {
          isCurrent
          ?
          (
            <div className="btn-group">
              <button className="btn btn-primary btn-sm" onClick={handleReset.bind(null, node.name)}>
                <i className="fa fa-undo" />
                {i18n`list.reset`}
              </button>
              <button className="btn btn-primary btn-sm" onClick={(e) => handleRename(node, e)}>
                <i className="fa fa-pencil" />
                {i18n`list.handleRename.rename`}
              </button>
            </div>
          )
          :
          (
            <div className="btn-group">
              <button className="btn btn-primary btn-sm" onClick={handleSwitch.bind(null, oldEnvId, node.name)}>
                <i className="fa fa-play" />
                {i18n`list.use`}
              </button>
              <button className="btn btn-primary btn-sm" disabled={isShared || node.name === 'ide-tty'} onClick={handleDelete.bind(null, node.name)}>
                <i className="fa fa-trash-o" />
                {i18n`list.delete`}
              </button>
              <button className="btn btn-primary btn-sm" onClick={(e) => handleRename(node, e)}>
                <i className="fa fa-pencil" />
                {i18n`list.handleRename.rename`}
              </button>
            </div>
          )
        }
      </div>
    )
  }
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
