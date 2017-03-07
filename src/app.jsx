import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { default as EnvList } from './EnvList';
import { getStoreByReducer } from './utils';

import reducer from './reducer';


EnvList.propTypes = {
  name: PropTypes.string,
  style: PropTypes.object,
};

export default props => (
  <Provider store={getStoreByReducer(reducer)}>
    <EnvList {...props} />
  </Provider>
);
