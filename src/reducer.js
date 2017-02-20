import { handleActions } from 'redux-actions';
// import { combineReducers } from 'redux';


export default handleActions({
  ADD: (state) => {
    return { ...state,
      ExtensionState: {
        ...state.ExtensionState,
        feature1Counts: ++state.ExtensionState.feature1Counts || 0,
      },
    };
  },
}, {
  ExtensionState: {
    feature1Counts: 0,
  },
});
