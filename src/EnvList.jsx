import React, { Component, PropTypes } from 'lib/react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { observer } from 'lib/mobxReact';
import * as EnvActions from './actions';
import cx from 'classnames';
import global from './global';
import ServerInfo from './ServerInfo';
import getSvg from '../static';
import settings from 'app/settings'
import EnvListSelector from './EnvListSelector';
import EnvListRenameModal from './EnvListRenameModal';

const Modal = global.sdk.Modal;
const i18n = global.i18n;
const isDefaultProject = global.sdk.config.projectName === 'cloudstudio-default';
const language = settings.general.language;

class EnvList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      oldEnvId: '',
      currentEnv: '',
    }
  }
  componentDidMount() {
    this.fetch();
    Modal.modalRegister('EnvListSelector', EnvListSelector);
    Modal.modalRegister('EnvListRenameModal', EnvListRenameModal);
  }
  render() {
    const { envList, operating, operatingMessage } = this.props
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
                    // 处理名字的前缀和后缀
                    env.name = this.splitEnvName(env.name);
                    env.displayName = env.displayName.split('(')[0];
                    return (
                      <EnvItem
                        node={env}
                        oldEnvId={this.state.oldEnvId}
                        key={env.name}
                        isCurrent={env.name === this.splitEnvName(this.state.currentEnv)}
                        handleRename={this.handleRename}
                        handleReset={this.handleReset}
                        handleDelete={this.handleDelete}
                        handleSwitch={this.handleSwitch} />
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
  splitEnvName = (name) => {
    const arr = name.split('_');
    return arr[arr.length - 1];
  }
  fetch = () => {
    const { actions } = this.props
    const envIdPromise = actions.envId()
    const envListPromise = actions.envList()
    Promise.all([envIdPromise, envListPromise]).then((res) => {
      const currentEnv = res[0].name;
      this.setState({
        oldEnvId: currentEnv,
        currentEnv: currentEnv,
      })
    })
  }
  handleAddAEnv = (oldEnvId, e) => {
    e.preventDefault()
    Modal.showModal({
      type: 'EnvListSelector',
      position: 'center',
      message: i18n.get('list.selectEnvironment'),
    }).then((newEnvId) => {
      this.handleSwitch(oldEnvId, newEnvId);
    })
  }
  handleRename = (node, e) => {
    e.preventDefault();
    const description = language.value === 'English' ? node.description : node.descriptionCN;
    Modal.showModal({
      type: 'EnvListRenameModal',
      content: {
        displayName: node.displayName,
        desc: description,
      }
    }).then(({ displayName, desc }) => {
      if (!displayName) {
        displayName = node.displayName;
      }
      if (!desc) {
        desc = description;
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
      this.props.actions.envSwitch({ oldEnvId, newEnvId }).then(res => {
        if (res) {
          this.setState({ oldEnvId: newEnvId });
        }
      });
    }
  }
}

@observer
class EnvItem extends Component {
  render() {
    const lang = language.value;
    const { oldEnvId, node, isCurrent, handleRename, handleReset, handleDelete, handleSwitch } = this.props;
    // const isShared = (node.owner && (node.owner.globalKey !== config.owner.globalKey))
    const isDefaultEnv = node.name === 'ide-tty';
    const isThreeInOneEnv = node.name === 'ide-tty-php-python-java';
    if (isDefaultEnv) {
      node.description = ' Ubuntu 14.04.4 with Python 2.7.12, Python 3.5.2';
      node.descriptionCN = ' Ubuntu 14.04.4 已安装 Python 2.7.12，Python 3.5.2';
    }
    return (
      <div className={cx('env-item', { current: isCurrent })}>
        <div className="env-item-heading">
          {getSvg(node.name)}
          {node.displayName}
        </div>
        <div className="env-item-body">{lang === 'English' ? node.description : node.descriptionCN}</div>
        {
          isCurrent
          ?
          (
            <div className="btn-group">
              <button className="btn btn-primary btn-sm" onClick={() => handleReset(node.name)}>
                <i className="fa fa-undo" />
                {i18n`list.reset`}
              </button>
            </div>
          )
          :
          (
            <div className="btn-group">
              <button className="btn btn-primary btn-sm" onClick={() => handleSwitch(oldEnvId, node.name)}>
                <i className="fa fa-play" />
                {i18n`list.use`}
              </button>
              <button className="btn btn-primary btn-sm" disabled={isDefaultEnv || (isDefaultProject && isThreeInOneEnv)} onClick={() => handleDelete(node.name)}>
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
      envList = [],
      currentEnv = null,
      operating,
      operatingMessage
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
