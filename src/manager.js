import APP from 'webide-plugin-sdk/utils';
import Manager from 'webide-plugin-sdk/Manager';

import component, { store } from './app';

import global from './global';

const { injectComponent, i18n, sdk } = global;
const { inject, position } = injectComponent;

export default class extends Manager {
  pluginWillMount() {
    inject(position.SIDEBAR.RIGHT, {
      text: i18n`list.environments`,
      icon: 'fa fa-desktop',
      key: 'env',
      actions: {
        onSidebarActive: () => {
          console.log('component is active');
        },
        onSidebarDeactive: () => {
          console.log('component is deactive');
        },
      },
    }, extension => extension.app);
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
    // }, extension => extension.app);
  }
  /**
   * this will call only when plugin is unmount
   * @param  {}
   */
  pluginWillUnmount() {
    console.log('plugin will unMount');
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
}
