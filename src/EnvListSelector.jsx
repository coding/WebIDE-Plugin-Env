import React, { Component } from 'lib/react';
import PropTypes from 'lib/propTypes';
import settings from 'app/settings';
import { observer } from 'lib/mobxReact';
import { defaultEnvList } from './api';

import getSvg from '../static';
import global from './global';

const i18n = global.i18n;
const Modal = global.sdk.Modal;

const EnvItem = observer(({ node, userEnv, handleClick, splitEnvName }) => {
  if (node.name === 'ide-tty') {
    node.description = ' Ubuntu 14.04.4';
    node.descriptionCN = ' Ubuntu 14.04.4';
  }
  const description = settings.general.language.value === 'English' ? node.description : node.descriptionCN;
  let disabled = false;
  for (let i = 0, n = userEnv.length; i < n; i++) {
    const env = userEnv[i].name;
    if (splitEnvName(env) === node.name) {
      disabled = true;
      break;
    }
  }
  return (
    disabled
    ?
    (
      <div className="env-item-modal disabled">
        <div className='env-item-heading'>
          <span className="name">
            {getSvg(node.name)}
            {node.displayName}
          </span>
          <span className="added">{i18n.get('list.added')}</span>
        </div>
        <div className='env-item-body'>{description}</div>
      </div>
    )
    :
    (
      <div className="env-item-modal" onClick={() => handleClick(node.name)}>
        <div className='env-item-heading'>
          <span className="name">
            {getSvg(node.name)}
            {node.displayName}
          </span>
        </div>
        <div className='env-item-body'>{description}</div>
      </div>
    )
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
    }
    defaultEnvList().then(res => this.setState({ defaultEnv: res }));
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
        splitEnvName={this.props.content.splitEnvName}
      />
    ))
  )

  render () {
    const { defaultEnv } = this.state;
    const style = { width: 600 };
    return (
      <div className='modal-content' style={style}>
        <div className='env-list-selector-header'>{i18n`list.selectEnvironment`}</div>
        <div className='fixed-line'></div>
        <div className='env-list-content'>
          <p className='env-list-little-header'>{i18n`list.presetEnvironment`}</p>
          <div className='env-list-list-item'>{this.renderEnvItems(defaultEnv, this.props.content.envList)}</div>
        </div>
      </div>
    );
  }
}

export default EnvListSelector;
