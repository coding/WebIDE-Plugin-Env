import APP from 'webide-plugin-sdk/utils';
import Manager from 'webide-plugin-sdk/Manager';

import component from './menu';
import { store } from './app';
const { dispatch } = store
import emitter, * as E from 'app/utils/emitter';
import contextMenuStore from 'app/components/ContextMenu/store';
import global from './global';
const Modal = global.sdk.Modal;
import * as EnvActions from './actions';

const { injectComponent, i18n, sdk } = global;
const { inject, position } = injectComponent;

export default class extends Manager {
  pluginWillMount() {
    this.onEnvHide = this.onEnvHide.bind(this)
    this.onEnvShow = this.onEnvShow.bind(this)
    emitter.on(E.TERM_ENV_HIDE, this.onEnvHide)
    emitter.on(E.TERM_ENV_SHOW, this.onEnvShow)
    
    // inject(position.TERMINAL.ENV, {
    //   text: i18n`list.environments`,
    //   icon: 'fa fa-desktop',
    //   key: 'envMenu',
    //   actions: {
    //     onSidebarActive: () => {
    //       console.log('component is active');
    //     },
    //     onSidebarDeactive: () => {
    //       console.log('component is deactive');
    //     },
    //   },
    // }, extension => extension.menu);
  }
  /**
   * this will call only when plugin is unmount
   * @param  {}
   */
  pluginWillUnmount() {
    console.log('plugin will unMount');
    emitter.removeListener(E.TERM_ENV_HIDE, this.onEnvHide);
    emitter.removeListener(E.TERM_ENV_SHOW, this.onEnvShow);
  }
  get component() {
    return component;
  }
  get appData() {
    return store.getState();
  }
  get request() {
    return this.getRequest();
  }
  onEnvHide(e) {
  }
  onEnvShow(e) {
    e.persist();
    const envList = store.getState().local.envList
    if (envList.length > 0) {
      this.openMenu(e)
    } else {
      const envIdPromise = EnvActions.envId()(dispatch);
      const envListPromise = EnvActions.envList()(dispatch);
      Promise.all([envIdPromise, envListPromise]).then((res) => {
        this.openMenu(e)
      });
    }
  }
  openMenu(e) {
    const {
      local: {
        envList = [], currentEnv = null, operating, operatingMessage
      }
    } = store.getState();
    contextMenuStore.openContextMenuFactory(this.makeBrancheMenuItems({
      currentEnv,
      envList
    }), { x: -170, y: 0, relative: true }, 'top-down to-left')(e);
  }
  makeBrancheMenuItems({ envList, currentEnv }) {
    const tempList = envList.filter((envItem) => envItem.name !== currentEnv.name).splice(0, 4);
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
      EnvActions.envReset()(dispatch)
    }
  }
  createEnv = (name) => {
    Modal.dismissModal()
    EnvActions.envSave({ name })(dispatch)
  }
  handleDelete = async (name) => {
    var confirmed = await Modal.showModal('Confirm', {
      header: i18n`list.handleDelete.header`,
      message: i18n`list.handleDelete.message${{ name }}`,
      okText: i18n`list.handleDelete.okText`
    })
    Modal.dismissModal()
    if (confirmed) {
      EnvActions.envDelete({ name })(dispatch)
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
      EnvActions.envSwitch({ name })(dispatch)
    }
  }
  handleMore = () => {
    console.log('handleMore')
  }
}
