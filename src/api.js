import global from './global';

const request = global.request;
const config = global.sdk.config;



export function envList() {
  return request.get(`/tty/env_list`);
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

export function envSwitch({ name }) {
  return request.put(`/tty/${config.spaceKey}/switch`, { envId: name });
}

export function envDelete({ name }) {
  return request.delete(`/tty/${config.spaceKey}`, { envId: name });
}
