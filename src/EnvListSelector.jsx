import React, { Component, PropTypes } from 'lib/react';
import settings from 'app/settings';
import { observer } from 'lib/mobxReact';
import { defaultEnvList } from './api';

import getSvg from '../static';
import global from './global';

const i18n = global.i18n;
const Modal = global.sdk.Modal;

const EnvItem = observer(({ node, handleClick }) => {
  let createdDate;
  const language = settings.general.language.value;
  if (node.createdDate) {
    createdDate = new Date(node.createdDate);
    const year = createdDate.getFullYear();
    let month = createdDate.getMonth() + 1;
    let date = createdDate.getDate();
    if (month < 10) {
      month = `0${month}`;
    }
    if (date < 10) {
      date = `0${date}`;
    }
    createdDate = `${year}-${month}-${date}`;
  }

  if (node.name === 'default') {
    node.description = ' Ubuntu 14.04.4';
    node.descriptionCN = ' Ubuntu 14.04.4';
  }

  return (
    <div className="env-item-modal" onClick={() => handleClick(node.name)}>
      <div className="env-item-heading">
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
          <div>{language === 'English' ? node.description : node.descriptionCN}</div>
        )}
      </div>
    </div>
  );
});

EnvItem.propTypes = {
  node: PropTypes.object,
  handleClick: PropTypes.func,
};

class EnvListSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sharedEnv: [],
      defaultEnv: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    this.setState({ loading: true });
    defaultEnvList().then(response => {
      this.setState({
        defaultEnv: response,
        loading: false,
      });
    });
  };

  handleClick = name => {
    this.props.meta.resolve(name);
    Modal.dismissModal();
  };

  renderEnvItems = list =>
    list.map(env => <EnvItem node={env} key={env.name} handleClick={this.handleClick} />);

  render() {
    const { defaultEnv, loading } = this.state;
    return (
      <div className="modal-content" style={{ width: 640 }}>
        <div className="env-list-selector-header">{i18n`list.selectEnvironment`}</div>
        <div className="fixed-line" />
        <div className="env-list-content">
          {/* <p className='env-list-little-header'>共享环境</p>*/}
          <p className="env-list-little-header">{i18n`list.presetEnvironment`}</p>
          <div className="env-list-list-item">
            {loading ? (
              <div className="loading">
                <i className="fa fa-spinner fa-pulse fa-fw" />
                Loading...
              </div>
            ) : (
              this.renderEnvItems(defaultEnv)
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default EnvListSelector;
