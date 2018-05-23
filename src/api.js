import global from './global';

const request = global.request;
const config = global.sdk.config;

export function envList() {
  return request.get(`/tty/${config.spaceKey}/used_list`);
}

export function envId() {
  return request.get(`/tty/${config.spaceKey}/env_id`);
}

export function envReset() {
  return request.post(`/tty/${config.spaceKey}/reset`);
}

export function envSave({ name }) {
  return request.post(`/tty/${config.spaceKey}/save`, { newEnvId: name });
}

export function envSwitch({ oldEnvId, newEnvId }) {
  return request.put(`/tty/${config.spaceKey}/switch`, { oldEnvId, newEnvId });
}

export function envDelete({ name }) {
  return request.delete(`/tty/${config.spaceKey}/used`, { envId: name });
}

export function defaultEnvList() {
  return request.get(`/tty/${config.spaceKey}/env_list`);
}

export function envRename({ envId, displayName, desc }) {
  return request.post(`/tty/${config.spaceKey}/used`, { envId, displayName, desc });
}
