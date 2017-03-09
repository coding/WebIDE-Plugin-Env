/* @flow weak */
import { createAction } from 'redux-actions';
import * as api from './api';
import { global } from './manager';

const { notify, NOTIFY_TYPE } = global.sdk.Notify;

export const ENV_OPERATING = 'ENV_OPERATING';
export const envOperating = createAction(ENV_OPERATING);
export function setOperating({ operating, msg }) {
  return dispatch => dispatch(envOperating({ operating, msg }));
}

export const ENV_LIST = 'ENV_LIST';
export const updateEnvList = createAction(ENV_LIST);
export function envList() {
  return dispatch => api.envList().then((res) => {
    dispatch(updateEnvList({ envList: res }));
  });
}

export const ENV_ID = 'ENV_ID';
export const updateEnvId = createAction(ENV_ID);
export function envId() {
  return dispatch => api.envId().then((res) => {
    dispatch(updateEnvId({ currentEnv: res }));
  });
}

export function envReset() {
  return (dispatch) => {
    dispatch(envOperating({ operating: true, msg: 'Resetting Environment...' }));
    api.envReset()
      .then((res) => {
        dispatch(envOperating({ operating: false }));
        notify({ message: 'Reset success!' });
      })
      .catch((err) => {
        dispatch(envOperating({ operating: false }));
        notify({ message: `Reset failed: ${err.msg}` });
      });
  };
}

export function envSave({ name }) {
  return (dispatch) => {
    dispatch(envOperating({ operating: true, msg: 'Saving Environment...' }));
    api.envSave({ name })
      .then((res) => {
        if (res.error) {
          notify({
            notifyType: NOTIFY_TYPE.ERROR,
            message: `Save failed: ${res.msg}`,
          });
        } else {
          notify({ message: 'Save success!' });
        }
        dispatch(envList());
        dispatch(envId());
        dispatch(envOperating({ operating: false }));
      })
      .catch((res) => {
        dispatch(envOperating({ operating: false }));
        notify({
          notifyType: NOTIFY_TYPE.ERROR,
          message: `Save failed: ${res.msg}`,
        });
      });
  };
}

export function envDelete({ name }) {
  return (dispatch) => {
    dispatch(envOperating({ operating: true, msg: 'Deleting Environment...' }));
    api.envDelete({ name })
      .then((res) => {
        if (res.error) {
          notify({
            notifyType: NOTIFY_TYPE.ERROR,
            message: `Delete failed: ${res.msg}`,
          });
        } else {
          notify({ message: 'Delete success!' });
        }
        dispatch(envList());
        dispatch(envId());
        dispatch(envOperating({ operating: false }));
      })
      .catch((res) => {
        dispatch(envOperating({ operating: false }));
        notify({
          notifyType: NOTIFY_TYPE.ERROR,
          message: `Delete failed: ${res.msg}`,
        });
      });
  };
}

export function envSwitch({ name }) {
  return (dispatch) => {
    dispatch(envOperating({ operating: true, msg: 'Switching Environment...' }));
    api.envSwitch({ name })
      .then((res) => {
        if (res.error) {
          notify({
            notifyType: NOTIFY_TYPE.ERROR,
            message: `Switch failed: ${res.msg}`,
          });
        } else {
          notify({ message: 'Switch success!' });
        }
        dispatch(envList());
        dispatch(envId());
        dispatch(envOperating({ operating: false }));
      })
      .catch((res) => {
        dispatch(envOperating({ operating: false }));
        notify({
          notifyType: NOTIFY_TYPE.ERROR,
          message: `Switch failed: ${res.msg}`,
        });
      });
  };
}

