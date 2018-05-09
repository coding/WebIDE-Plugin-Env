/* @flow weak */
import { createAction } from 'redux-actions';
import * as api from './api';
import global from './global';
const i18n = global.i18n;
import { maskActions } from 'app/utils'

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
    // dispatch(envOperating({ operating: true, msg: 'Resetting Environment...' }));
    maskActions.showMask({ message: i18n`list.message.resetting` });
    api.envReset()
      .then((res) => {
        // dispatch(envOperating({ operating: false }));
        notify({ message: i18n`list.message.resetSuccess` });
        maskActions.hideMask();
      })
      .catch((err) => {
        // dispatch(envOperating({ operating: false }));
        notify({ message: i18n`list.message.resetFailed${{ msg: err.msg }}` });
        maskActions.hideMask();
      });
  };
}

export function envSave({ name }) {
  return (dispatch) => {
    // dispatch(envOperating({ operating: true, msg: 'Saving Environment...' }));
    maskActions.showMask({ message: i18n`list.message.saving` });
    api.envSave({ name })
      .then((res) => {
        if (res.error) {
          notify({
            notifyType: NOTIFY_TYPE.ERROR,
            message: i18n`list.message.saveFailed${{ msg: res.msg }}`,
          });
        } else {
          notify({ message: i18n`list.message.saveSuccess` });
        }
        dispatch(envList());
        dispatch(envId());
        // dispatch(envOperating({ operating: false }));
        maskActions.hideMask();
      })
      .catch((res) => {
        // dispatch(envOperating({ operating: false }));
        maskActions.hideMask();
        notify({
          notifyType: NOTIFY_TYPE.ERROR,
          message: i18n`list.message.saveFailed${{ msg: res.msg }}`,
        });
      });
  };
}

export function envDelete({ name }) {
  return (dispatch) => {
    // dispatch(envOperating({ operating: true, msg: 'Deleting Environment...' }));
    maskActions.showMask({ message: i18n`list.message.deleting` });
    api.envDelete({ name })
      .then((res) => {
        if (res.error) {
          notify({
            notifyType: NOTIFY_TYPE.ERROR,
            message: i18n`list.message.deleteFailed${{ msg: res.msg }}`,
          });
        } else {
          notify({ message: i18n`list.message.deleteSuccess` });
        }
        dispatch(envList());
        dispatch(envId());
        // dispatch(envOperating({ operating: false }));
        maskActions.hideMask();
      })
      .catch((res) => {
        // dispatch(envOperating({ operating: false }));
        maskActions.hideMask();
        notify({
          notifyType: NOTIFY_TYPE.ERROR,
          message: i18n`list.message.deleteFailed${{ msg: res.msg }}`,
        });
      });
  };
}

export function envSwitch({ name }) {
  return (dispatch) => {
    // dispatch(envOperating({ operating: true, msg: 'Switching Environment...' }));
    maskActions.showMask({ message: i18n`list.message.switching` });
    api.envSwitch({ name })
      .then((res) => {
        if (res.code && res.code !== 0) {
          notify({
            notifyType: NOTIFY_TYPE.ERROR,
            message: i18n`list.message.switchFailed${{ msg: res.msg }}`,
          });
        } else {
          notify({ message: i18n`list.message.switchSuccess` });
        }
        dispatch(envList());
        dispatch(envId());
        // dispatch(envOperating({ operating: false }));
        maskActions.hideMask();
      })
      .catch((res) => {
        // dispatch(envOperating({ operating: false }));
        maskActions.hideMask();
        notify({
          notifyType: NOTIFY_TYPE.ERROR,
          message: i18n`list.message.switchFailed${{ msg: res.msg }}`,
        });
      });
  };
}

