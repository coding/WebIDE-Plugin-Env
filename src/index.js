require('./base-theme/index.styl');
const app = require('./app').default;
const Manager = require('./manager').default;
const appRegistry = require('webide-plugin-sdk/utils').appRegistry;

appRegistry({
  app,
  Manager,
});
