import component, { store } from './app';
import * as actions from './actions';
import { bindActionCreators } from 'redux';


export const data = {
  getState: store.getState,
  actions: bindActionCreators(actions, store.dispatch),
};

const CodingSDK = window.CodingSDK;


export default class extends CodingSDK {
  pluginWillMount() {
    console.log('this plugin will Moung');
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
