import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

const composeReducers = (...args) => {
  const reducers = [...args];
  if (reducers.length === 0) return arg => arg;
  if (reducers.length === 1) return reducers[0];
  return (state, action) =>
    reducers.reduceRight((lastState, reducer) =>
    reducer(lastState, action), state);
};

export const getStoreByReducer = (reducer) => {
  const store = createStore(
    composeReducers(reducer),
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
