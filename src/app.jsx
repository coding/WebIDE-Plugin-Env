import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { default as EnvList } from './EnvList';
import global from './global';
import reducer from './reducer';


EnvList.propTypes = {
  name: PropTypes.string,
  style: PropTypes.object,
};
export const store = global.getStoreByReducer(reducer);

const app = props => (
  <Provider store={store}>
    <EnvList {...props} />
  </Provider>
);

export default React.createElement(app)
