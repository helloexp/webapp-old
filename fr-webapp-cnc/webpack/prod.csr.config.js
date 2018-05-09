/* eslint no-console:0 */

const path = require('path');
const webpack = require('webpack');
const strip = require('strip-loader');
const HappyPack = require('happypack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BuildCleanupPlugin = require('./build-cleanup');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const HOST = process.env.HOST || 'dev.uniqlo.com';
const PORT = process.env.PORT || 3000;
const PUBLIC_PATH = process.env.PUBLIC_PATH || '';
const LANG = process.env.LANG || 'jp';
const DEV_URL = `http://${HOST}:${PORT}/`;
const FULL_PATH = `${PUBLIC_PATH}/${LANG}/cnc/`;

const happyThreadPool = HappyPack.ThreadPool({ size: 4 });

const projectRootPath = path.resolve(__dirname, '../');
const assetsPath = path.resolve(projectRootPath, './static/cnc');
const buildCleanupConfiguration = {
  buildAssetsPath: './static/cnc',
  cleanupExcludes: {
    '.gitignore': '.gitignore',
    dlls: 'dlls',
    fonts: 'fonts',
    misc: 'misc',
  },
};

function createHappyPlugin(id) {
  return new HappyPack({
    id,
    threadPool: happyThreadPool,

    // disable happypack with HAPPY=0
    enabled: process.env.HAPPY !== '0',

    // disable happypack caching with HAPPY_CACHE=0
    cache: process.env.HAPPY_CACHE !== '0',

    // make happypack more verbose with HAPPY_VERBOSE=1
    verbose: process.env.HAPPY_VERBOSE === '1',
  });
}

function orderByList(list) {
  return function sortChunks(chunk1, chunk2) {
    const index1 = list.indexOf(chunk1.names[0]);
    const index2 = list.indexOf(chunk2.names[0]);

    if (index2 === -1 || index1 < index2) {
      return -1;
    }
    if (index1 === -1 || index1 > index2) {
      return 1;
    }

    return 0;
  };
}

module.exports = {
  // devtool: 'cheap-module-source-map',
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    vendor: [
      'core-js/fn/string/includes',
      'core-js/fn/array/includes',
      'core-js/fn/array/find',
      'core-js/fn/array/find-index',
      'core-js/fn/array/from',
      'core-js/fn/array/is-array',
      'core-js/fn/set',
      'core-js/fn/promise',
      'react',
      'react-dom',
      'react-helmet',
      'react-router',
      'react-router-redux',
      'redux',
      'react-redux',
      'redux-connect',
      'react-router-scroll',
      'classnames',
      'react-cookie',
      'whatwg-fetch',
      'atob',
      'btoa',
    ],
    app: [
      './src/client.js',
    ],
  },
  output: {
    path: assetsPath,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: FULL_PATH,
  },
  devServer: {
    publicPath: DEV_URL,
    hot: true,
    compress: true,
    historyApiFallback: true,
    port: PORT,
    host: '0.0.0.0',
    contentBase: assetsPath,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: true,
    },
    proxy: {
      [`/${LANG}/cnc`]: {
        target: DEV_URL,
        pathRewrite: { [`^/${LANG}/cnc`]: '' },
        secure: false,
      },
    },
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['webpack-strip-block?start=<DEV>&end=</DEV>', strip.loader('debug'), 'babel?retainLines=true'], happy: { id: 'jsx' } }, // eslint-disable-line max-len
      { test: /\.json$/, loader: 'json' },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', ['css?module&importLoaders=2&sourceMap&localIdentName=[hash:base64:5]&-autoprefixer', 'postcss?parser=postcss-scss', 'sass']) }, // eslint-disable-line max-len
      { test: /\.(png|jpe?g|gif|svg|eot|ttf|woff2?)$/, exclude: /node_modules/, loader: 'file' },
    ],
  },
  sassLoader: {
    outputStyle: 'collapsed',
    sourceMap: true,
  },
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules',
    ],
    extensions: ['', '.json', '.js', '.jsx', '.scss'],
  },
  plugins: [
    new ExtractTextPlugin('[name]-[contenthash].css', { allChunks: true }),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },

      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false,
      __DLLS__: false,
    }),

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

    // optimizations
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        reduce_vars: true,
        drop_console: true,
        booleans: true,
        passes: 2,
      },
      output: {
        comments: false,
      },
      sourceMap: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({ name: ['vendor'], minChunks: Infinity }),
    new webpack.optimize.CommonsChunkPlugin({
      async: true,
      children: true,
      minChunks: 2,
    }),
    new HtmlWebpackPlugin({
      template: './webpack/tpl/index.ejs',
      inject: true,
      production: true,
      public_path: FULL_PATH,
      lang: LANG,
      chunksSortMode: orderByList(['vendor', 'common', 'app']),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      tags: [
        '<link rel="dns-prefetch" href="https://api.fastretailing.com/">',
        '<link rel="dns-prefetch" href="http://im.uniqlo.com/">',
      ].join(''),
    }),
    createHappyPlugin('jsx'),

    // for removing files from previous build.
    new BuildCleanupPlugin(buildCleanupConfiguration),
  ],
  postcss() {
    return [
      autoprefixer({ remove: false }),
      cssnano({ safe: true }),
    ];
  },
};
