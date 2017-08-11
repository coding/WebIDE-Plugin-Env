import APP from 'webide-plugin-sdk/utils';
import Manager from 'webide-plugin-sdk/Manager';

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
const { inject, position } = injectComponent;

export default class extends Manager{
  pluginWillMount() {
    console.log('plugin will mount');
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
