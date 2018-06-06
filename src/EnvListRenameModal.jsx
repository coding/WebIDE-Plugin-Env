import React, { Component } from 'lib/react';
import global from './global';

const Modal = global.sdk.Modal;
const i18n = global.i18n;

class EnvListRenameModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: props.content.displayName,
      desc: props.content.desc,
      disabled: true,
    };
  }

  componentDidMount() {
    this.refs.input.focus();
  }

  handleName = (e) => {
    const value = e.target.value;
    this.setState({ displayName: value });
    if (value || this.state.desc) {
      this.setState({ disabled: false });
    } else {
      this.setState({ disabled: true });
    }
  }

  handleDesc = (e) => {
    const value = e.target.value;
    this.setState({ desc: value });
    if (value || this.state.displayName) {
      this.setState({ disabled: false });
    } else {
      this.setState({ disabled: true });
    }
  }

  handleEnter = (e) => {
    if (e.keyCode === 13) {
      if (this.state.displayName || this.state.desc) {
        this.handleSubmit();
      }
    }
  }

  handleSubmit = () => {
    this.props.meta.resolve({
      displayName: this.state.displayName,
      desc: this.state.desc,
    });
    Modal.dismissModal();
  }

  handleCancel = () => {
    Modal.dismissModal();
  }

  render() {
    return (
      <div className="env-list-rename">
        <div className="title">{i18n.get('list.handleRename.renameTitle')}</div>
        <div>
          <div className="label">{i18n.get('list.handleRename.envName')}</div>
          <input className="form-control" type="text" value={this.state.displayName} onChange={this.handleName} onKeyUp={this.handleEnter} ref="input" />
        </div>
        <div>
          <div className="label">{i18n.get('list.handleRename.envDesc')}</div>
          <input className="form-control" type="text" value={this.state.desc} onChange={this.handleDesc} onKeyUp={this.handleEnter} />
        </div>
        <div className="control">
          <button className="btn btn-default" onClick={this.handleCancel}>{i18n.get('list.cancelButton')}</button>
          <button className="btn btn-primary" disabled={this.state.disabled} onClick={this.handleSubmit}>{i18n.get('list.okButton')}</button>
        </div>
      </div>
    );
  }
}

export default EnvListRenameModal;
