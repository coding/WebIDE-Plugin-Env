const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const webpackConfig = require('./webpack.dev.config');


const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(require('webpack-dev-middleware')(require('webpack')(webpackConfig), {
  publicPath: '/public',
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
  console.log(`listen ${PORT}`);
});

