require('./base-theme/index.styl');
const app = require('./app').default;
const Manager = require('./manager').default;
const appRegistry = require('codingSDK/utils').appRegistry;

appRegistry({
  app,
  Manager,
});
