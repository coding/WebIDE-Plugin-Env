import { handleActions } from 'redux-actions';
// import { combineReducers } from 'redux';
import {
  ENV_LIST,
  ENV_ID,
  ENV_RESET,
} from './actions'


export default handleActions({
  ENV_LIST: (state, action) => {
    return { ...state,
      ExtensionState: {
        ...state.ExtensionState,
        envList: action.payload.envList || [],
      },
    };
  },
  ENV_ID: (state, action) => {
    return { ...state,
      ExtensionState: {
        ...state.ExtensionState,
        currentEnv: action.payload.currentEnv || {},
      },
    };
  },
  ENV_RESET: (state, action) => {

  },
  ENV_OPERATING: (state, action) => {
    return { ...state,
      ExtensionState: {
        ...state.ExtensionState,
        operating: action.payload.operating,
        operatingMessage: action.payload.msg || '',
      },
    };
  }
}, {
  ExtensionState: {
    envList: [],
    currentEnv: {},
    operating: false,
    operatingMessage: '',
  },
});
