/*eslint-disable*/
const contents = ['list'];

export default contents.reduce((p, v) => {
  p[v] = require(`./${v}.json`);
  return p
}, {});
