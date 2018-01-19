require('./base-theme/index.styl');
const app = require('./app').default;
const menu = require('./menu').default;
// const Manager = require('./manager').default;
// const EnvMenu = require('./envMenu').default;
const appRegistry = require('webide-plugin-sdk/utils').appRegistry;

appRegistry([{
  app,
  Manager: require('./manager').default,
  key: 'env',
},
{
  menu,
  Manager: require('./menuManager').default,
  key: 'envMenu',
}]);
