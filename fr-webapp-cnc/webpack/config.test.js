const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// const helpers = require('./helpers');

// var cssLoader = 'css?importLoaders=2&module&localIdentName=[path]-[local]&-minimize';
//
// var lessSassLoaderQuery = {
//   outputStyle: 'expanded',
//   sourceMap: false
// };
//
// var styleLoaders = [
//   cssLoader,
//   'sass?' + JSON.stringify(lessSassLoaderQuery)
// ];

const webpackConfig = {
  module: {
    loaders: [
      { test: /\.(jpe?g|png|gif|svg)$/, loader: 'null-loader' },
      { test: /\.js$/, include: path.resolve(__dirname, './src'), loaders: ['babel'] },
      { test: /\.json$/, loader: 'null-loader' },
      { test: /\.scss$/, loader: 'null-loader' },
    ],
  },
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules',
    ],
  },
  plugins: [
    new webpack.IgnorePlugin(/\.json$/),
    // new webpack.NoErrorsPlugin(),
    new ProgressBarPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: false,
      __DLLS__: process.env.WEBPACK_DLLS === '1',
      'process.env': {
        NODE_ENV: JSON.stringify('test'),
      },
    }),
  ],
  externals: {
    jsdom: 'window',
    cheerio: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window',
  },
  progress: true,
};

// if (process.env.WEBPACK_DLLS === '1') {
//   helpers.installVendorDLL(config, 'vendor');
  // WebpackHelpers.installVendorDLL(webpackConfig, 'components');
// }

module.exports = webpackConfig;
