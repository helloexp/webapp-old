import path from 'path';
import webpack from 'webpack';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import { expect } from 'chai';

const cssLoader = 'css?importLoaders=1&localIdentName=[local]';

// const lessSassLoaderQuery = {
//   outputStyle: 'expanded',
//   sourceMap: false
// };

const styleLoaders = [cssLoader, 'sass'];
const rootPath = path.resolve(__dirname, '../');
const testPath = path.resolve(__dirname, './');
const helpersPath = path.join(testPath, 'testHelpers');
const srcPath = path.join(rootPath, 'src');
const nodeModulesPath = path.join(rootPath, 'node_modules');

const webpackConfig = {
  progress: true,
  devtool: 'inline-source-map',
  entry: [
    helpersPath,
  ],
  module: {
    noParse: [
      /node_modules\/sinon\/|localforage/,
    ],
    preLoaders: [
      {
        test: /\.js$/,
        include: [srcPath, path.join(helpersPath, 'index.js')],
        loader: 'babel',
        query: {
          compact: false,
          sourceMaps: 'inline',
        },
      },
    ],
    loaders: [
      {
        test: /\.(json|jpe?g|png|gif|svg)$/,
        loader: 'null-loader',
      },
      {
        test: /\.scss/,
        include: [srcPath, /\/uniqlo-ui\//],
        loaders: styleLoaders,
      },
    ],
  },
  resolve: {
    alias: {
      sinon: 'sinon/pkg/sinon.js',
    },
    modulesDirectories: [
      srcPath,
      testPath,
      nodeModulesPath,
    ],
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: false,
      'process.env': {
        NODE_ENV: JSON.stringify('test'),
      },
    }),
    new webpack.ProvidePlugin({
      chai: 'chai/lib/chai',
      sinon: 'sinon',
      expect: expect, // eslint-disable-line
      icepick: 'icepick',
      shallow: 'enzyme/shallow',
      mount: 'enzyme/mount',
      testHelpers: helpersPath,
    }),
  ],
  externals: {
    jsdom: 'window',
    cheerio: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window',
  },
  webpackServer: {
    noInfo: true,
    quiet: true,
  },
  node: {
    fs: 'empty',
  },
};

export default webpackConfig;
