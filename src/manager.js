import component, { store } from './app';
import APP from 'codingSDK/utils';

export const global = new APP({
  subscribeDataArray: ['GitState'],
  pkgId: 'coding_web_ide_plugin',
});


export default class {
  pluginWillMount() {
    console.log('this plugin will Mount');
  }
  pluginOnActive() {

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
