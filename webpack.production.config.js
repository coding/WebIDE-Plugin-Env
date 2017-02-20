const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

const name = require('package.json').codingPackage.name;

module.exports = {
  entry: './src',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `${name}_[chunkhash].js`,
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

