import APP from 'codingSDK/utils';

import component, { store } from './app';
import languagePool from '../i18n';


export const global = new APP({
  subscribeDataArray: ['GitState'],
  pkgId: 'coding_web_ide_plugin',
  i18n: { customLanguagePool: languagePool },
});

const { injectComponent, i18n } = global;

export default class {
  pluginWillMount() {
    injectComponent.addComToSideBar('right', {
      text: i18n`list.environments`,
      icon: 'fa fa-desktop',
      key: 'env',
      onSidebarActive: () => {
        console.log('componnet is active');
      },
      onSidebarDeactive: () => {
        console.log('componnet is deactive');
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
    console.log('this plugin will UnMount');
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
