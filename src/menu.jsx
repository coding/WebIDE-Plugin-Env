import React from 'lib/react';
import PropTypes from 'lib/propTypes';
import { Provider } from 'react-redux';
import { default as EnvMenu } from './EnvMenu';
// import global from './global';

// import reducer from './reducer';
import { store } from './app';

EnvMenu.propTypes = {
  name: PropTypes.string,
  style: PropTypes.object,
};
// export const store = global.getStoreByReducer(reducer);

const app = props => (
  <Provider store={store}>
    <EnvMenu {...props} />
  </Provider>
);

export default React.createElement(app);
