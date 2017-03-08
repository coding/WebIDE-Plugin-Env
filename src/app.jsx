import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { default as EnvList } from './EnvList';
import { global } from './manager';

import reducer from './reducer';


EnvList.propTypes = {
  name: PropTypes.string,
  style: PropTypes.object,
};
export const store = global.getStoreByReducer(reducer)

export default props => (
  <Provider store={store}>
    <EnvList {...props} />
  </Provider>
);
