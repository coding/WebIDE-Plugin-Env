const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 4000;
const webpackConfig = require('./webpack.dev.config');

const corsOptions = {
  origin: 'http://localhost:8060',
  optionsSuccessStatus: 200,
  credentials: true,
};
const codingPackage = require('./package.json').codingPackage

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use((req, res, next) => {
  if (process.env.VERSION === 'platform') {
    res.set(
    'Content-Type', 'application/vnd.coding.v2+json;charset=UTF-8'
    );
  }
  return next();
});


app.get('/', (req, res) => {
  res.send('it works');
});

app.get('/packages', (req, res) => {
  res.json({ [codingPackage.name]: codingPackage });
});

app.get('/packages/:pkgId', (req, res) => {
  res.json(codingPackage);
});

app.use(require('webpack-dev-middleware')(require('webpack')(webpackConfig), {
  publicPath: '/static',
  headers: { "Access-Control-Allow-Origin": "http://localhost:8060" },
  hot: true,
  historyApiFallback: true,
  quiet: false,
  noInfo: false,
  inline: true,
  stats: {
    color: true,
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: true,
    chunks: true,
    chunkModules: false,
  },
}));
app.use(require('webpack-hot-middleware')(require('webpack')(webpackConfig)));

app.listen(PORT, () => {
  console.log(`plugin script folder served at localhost:${PORT}/static/`);
  console.log(`plugin list api served at localhost:${PORT}/packages`);
});

