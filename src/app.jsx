import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { default as CountApp } from './CountApp';
import { getStoreByReducer } from './utils';

import reducer from './reducer';


CountApp.propTypes = {
  name: PropTypes.string,
  style: PropTypes.object,
};

export default props => (
  <Provider store={getStoreByReducer(reducer)}>
    <CountApp {...props} />
  </Provider>
);
