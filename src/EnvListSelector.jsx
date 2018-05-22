import React, { Component, PropTypes } from 'lib/react';
import settings from 'app/settings';
import { observer } from 'lib/mobxReact';
import { defaultEnvList, envList } from './api';

import getSvg from '../static';
import global from './global';

const i18n = global.i18n;
const Modal = global.sdk.Modal;
const language = settings.general.language.value;

const EnvItem = observer(({ node, userEnv, handleClick }) => {
  let capable = true;
  if (node.name === 'ide-tty') {
    node.description = ' Ubuntu 14.04.4';
    node.descriptionCN = ' Ubuntu 14.04.4';
  }
  for (let i = 0, n = userEnv.length; i < n; i++) {
    const env = userEnv[i].name;
    if (env.indexOf(node.name) !== -1) {
      capable = false;
      break;
    }
  }
  return (
    <div className={`env-item-modal ${capable ? 'capable' : ''}`} onClick={() => {capable ? handleClick(node.name) : ''}}>
      <div className='env-item-heading'>
        {getSvg(node.displayName)}
        {node.displayName}
      </div>
      <div className='env-item-body'>{language === 'English' ? node.description : node.descriptionCN}</div>
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
      defaultEnv: [],
      userEnv: [],
    }
    defaultEnvList()
      .then((response) => {
        this.setState({ defaultEnv: response })
      });
    envList()
      .then((res) => {
        this.setState({ userEnv: res });
      });
  }

  handleClick = (name) => {
    this.props.meta.resolve(name)
    Modal.dismissModal()
  }

  renderEnvItems = (defaultEnv, userEnv) => (
    defaultEnv.map(env => (
      <EnvItem
        node={env}
        userEnv={userEnv}
        key={env.name}
        handleClick={this.handleClick}
      />
    ))
  )

  render () {
    const { defaultEnv, userEnv } = this.state
    return (
      <div className='modal-content' style={{ width: 640 }}>
        <div className='env-list-selector-header'>{i18n`list.selectEnvironment`}</div>
        <div className='fixed-line' />
        <div className='env-list-content'>
          <p className='env-list-little-header'>{i18n`list.presetEnvironment`}</p>
          <div className='env-list-list-item'>{this.renderEnvItems(defaultEnv, userEnv)}</div>
        </div>
      </div>
    );
  }
}

export default EnvListSelector;
