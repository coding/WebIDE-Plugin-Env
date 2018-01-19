import APP from 'webide-plugin-sdk/utils';

const languagePool = require('../i18n/index.json').reduce((p, v) => {
  p[v] = require(`../i18n/${v}/index`).default;
  return p;
}, {});

export default new APP({
  pkgId: 'WebIDE-Plugin-Temporary',
  i18n: { customLanguagePool: languagePool },
});
