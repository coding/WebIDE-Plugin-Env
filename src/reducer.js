import { handleActions } from 'redux-actions';
// import { combineReducers } from 'redux';
import {
  ENV_LIST,
  ENV_ID,
  ENV_OPERATING,
  DEFAULT_ENV,
} from './actions';

export default handleActions(
  {
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
    [DEFAULT_ENV]: (state, action) => {
      const currentEnv = action.payload.defaultEnv.find(env => env.name === state.currentEnv.name);
      return {
        ...state,
        defaultEnv: action.payload.defaultEnv,
        envList: state.envList.find(env => env.name === state.currentEnv.name)
          ? state.envList
          : [...state.envList, currentEnv],
      };
    },
  },
  {
    envList: [],
    currentEnv: {},
    operating: false,
    operatingMessage: '',
    defaultEnv: [],
  }
);
