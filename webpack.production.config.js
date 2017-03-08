const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

const config = require('./package.json');

const version = config.codingIdePackage.version || config.version;


module.exports = {
  entry: './src',
  output: {
    path: path.join(__dirname, 'dist', version),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'src/',
      'node_modules',
    ],
  },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader',
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        drop_debugger: true,
      },
    }),
    new ExtractTextPlugin({
      disable: false,
      allChunks: true,
    }),
  ],
};

