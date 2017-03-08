import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { handleActions } from 'redux-actions';

export default class {
  constructor(options) {
    this.sdk = new window.CodingSDK(options) || '',
    this.inializeData = this.sdk.getData() || {}
    this.registerLisitenerOnRemotes()
  }
  currentRemoteStore = ''
  getStoreByReducer(reducer) {
  const store = createStore(
    combineReducers({
      local: reducer, 
      remote: handleActions({
        updateRemoteData: (state, action) => {
          return ({...state, ...action.data})
        }
      }, this.inializeData)
      }),
    compose(
      applyMiddleware(thunkMiddleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f));
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducer', () => {
      store.replaceReducer(reducer);
    });
  }
  return store;
};
registerLisitenerOnRemotes () {
    this.sdk.subscribeStore((subscribedData) => () => {
      let previousRemoteStore = this.currentRemoteStore
      this.currentRemoteStore = subscribedData
      if (previousRemoteStore !== this.currentRemoteStore) {
        store.dispatch({ type: 'updateRemoteData', data: this.currentRemoteStore })
      }
    });
}
get request() {
  return this.sdk.utils.request
}
getSdk() {
  return this.sdk
}
}

const composeReducers = (...args) => {
  const reducers = [...args];
  if (reducers.length === 0) return arg => arg;
  if (reducers.length === 1) return reducers[0];
  return (state, action) =>
    reducers.reduceRight((lastState, reducer) =>
    reducer(lastState, action), state);
};
