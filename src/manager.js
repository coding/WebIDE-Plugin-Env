import APP from 'codingSDK/utils';

import component, { store } from './app';

const languagePool = require('../i18n/index.json').reduce((p, v) => {
  p[v] = require(`../i18n/${v}/index`).default;
  return p;
}, {});

export const global = new APP({
  subscribeDataArray: ['GitState'],
  pkgId: 'coding_web_ide_plugin',
  i18n: { customLanguagePool: languagePool },
});

const { injectComponent, i18n } = global;

export default class {
  pluginWillMount() {
    console.log('plugin will mount');
    injectComponent.addComToSideBar('right', {
      text: i18n`list.environments`,
      icon: 'fa fa-desktop',
      key: 'env',
      onSidebarActive: () => {
        console.log('component is active');
      },
      onSidebarDeactive: () => {
        console.log('component is deactive');
      },
    }, extension => extension.app);
  }

  doing() {
    // will continue doing someting
  }
  /**
   * this will call only when plugin is unmount
   * @param  {}
   */
  pluginOnUnmount() {
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
