const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: 'http://localhost:8060',
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
const webpackConfig = require('./webpack.dev.config');

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
  console.log(`build server serve at localhost:${PORT}/static/`);
});

