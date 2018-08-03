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

export const DEFAULT_ENV = 'DEFAULT_ENV';
export const updateDefaultEnvList = createAction(DEFAULT_ENV);
export function getDefaultEnvList() {
  return (dispatch) => {
    api.defaultEnvList()
      .then((res) => {
        dispatch(updateDefaultEnvList({ defaultEnv: res }));
      })
      .catch((res) => {
        notify({
          notifyType: NOTIFY_TYPE.ERROR,
          message: i18n`list.message.switchFailed${{ msg: res.msg }}`,
        });
      });
  };
}

export const ENV_ID = 'ENV_ID';
export const updateEnvId = createAction(ENV_ID);
export function envId() {
  return dispatch => api.envId().then((res) => {
    dispatch(updateEnvId({ currentEnv: res }));
    return res;
  });
}

export function envReset() {
  return (dispatch) => {
    // dispatch(envOperating({ operating: true, msg: 'Resetting Environment...' }));
    maskActions.showMask({ message: i18n`list.message.resetting` });
    return api.envReset()
      .then((res) => {
        // dispatch(envOperating({ operating: false }));
        dispatch(envList());
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

export function envSwitch({ oldEnvId, newEnvId }) {
  return (dispatch) => {
    // dispatch(envOperating({ operating: true, msg: 'Switching Environment...' }));
    maskActions.showMask({ message: i18n`list.message.switching` });
    return api.envSwitch({ oldEnvId, newEnvId })
      .then((res) => {
        maskActions.hideMask();
        if (res.code && res.code !== 0) {
          notify({
            notifyType: NOTIFY_TYPE.ERROR,
            message: i18n`list.message.switchFailed${{ msg: res.msg }}`,
          });
          return false;
        } else {
          dispatch(envList());
          dispatch(updateEnvId({ currentEnv: { name: newEnvId} }));
          notify({ message: i18n`list.message.switchSuccess` });
          return true;
        }
        // dispatch(envOperating({ operating: false }));
      })
      .catch((res) => {
        // dispatch(envOperating({ operating: false }));
        maskActions.hideMask();
        notify({
          notifyType: NOTIFY_TYPE.ERROR,
          message: i18n`list.message.switchFailed${{ msg: res.msg }}`,
        });
        return false;
      });
  };
}

export function envRename({ envId, isGlobal, displayName, desc }) {
  return (dispatch) => {
    api.envRename({ envId, isGlobal, displayName, desc }).then(res => {
      if (res.code && res.code !== 0) {
        notify({
          notifyType: NOTIFY_TYPE.ERROR,
          message: i18n`list.handleRename.renameFailed${{ msg: res.msg }}`,
        });
      } else {
        dispatch(envList());
        notify({ message: i18n`list.handleRename.renameSuccess` });
      }
    }).catch(res => {
      notify({
        notifyType: NOTIFY_TYPE.ERROR,
        message: i18n`list.handleRename.renameFailed${{ msg: res.msg }}`,
      });
    });
  }
}
