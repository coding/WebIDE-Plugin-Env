const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const name = require('./package.json').codingPackage.name;

module.exports = {
  entry: './src',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `${name}.js`,
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: [
      'src/',
      'node_modules',
    ],
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, 'loaders／'), 'node_modules'],
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
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //     screw_ie8: true,
    //     // drop_console: true,
    //     drop_debugger: true,
    //   },
    // }),
    new ExtractTextPlugin({
      disable: false,
      allChunks: true,
    }),
  ],
};

