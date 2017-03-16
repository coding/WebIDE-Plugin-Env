require('./base-theme/index.styl');
const app = require('./app').default;
const reducer = require('./reducer').default;
const Manager = require('./manager').default;

module.exports = {
  app,
  reducer,
  Manager,
}

window.codingPackageJsonp(module.exports)