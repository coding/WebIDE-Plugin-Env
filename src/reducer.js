import { handleActions } from 'redux-actions';
// import { combineReducers } from 'redux';
import {
  ENV_LIST,
  ENV_ID,
  ENV_OPERATING,
} from './actions';


export default handleActions({
  [ENV_LIST]: (state, action) => {
    return {
      ...state,
      envList: action.payload.envList || [],
    };
  },
  [ENV_ID]: (state, action) => {
    return {
      ...state,
      currentEnv: action.payload.currentEnv || {},
    };
  },
  [ENV_OPERATING]: (state, action) => {
    return {
      ...state,
      operating: action.payload.operating,
      operatingMessage: action.payload.msg || '',
    };
  },
}, {
  envList: [],
  currentEnv: {},
  operating: false,
  operatingMessage: '',
});
