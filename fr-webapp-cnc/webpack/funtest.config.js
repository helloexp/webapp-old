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

const happyThreadPool = HappyPack.ThreadPool({ size: 4 });

const projectRootPath = path.resolve(__dirname, '../');
const assetsPath = path.resolve(projectRootPath, './static/dist');
const buildCleanupConfiguration = {
  buildAssetsPath: './static/dist',
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

module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    vendor: [
      'babel-polyfill',
      'react',
      'react-dom',
      'react-helmet',
      'react-router',
      'react-router-redux',
      'redux',
      'react-redux',
      'redux-connect',
      'react-router-scroll',
      'localforage',
      'classnames',
      'react-cookie',
      'isomorphic-fetch',
      'es6-promise',
      'scriptjs',
      'bowser',
      'cookie',
      'buffer',
    ],
    app: [
      './src/client.js',
    ],
  },
  output: {
    path: assetsPath,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: `http://${HOST}:${PORT}/`,
  },
  devServer: {
    quiet: true,
    noInfo: true,
    inline: true,
    compress: true,
    historyApiFallback: true,
    port: PORT,
    contentBase: './static',
    stats: { colors: true },
    proxy: {
      '/jp': {
        target: `http://${HOST}:${PORT}/`,
        pathRewrite: { '^/jp': '' },
        secure: false,
      },
    },
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['webpack-strip-block?start=<DEV>&end=</DEV>', strip.loader('debug'), 'babel'], happy: { id: 'jsx' } }, // eslint-disable-line max-len
      { test: /\.json$/, loader: 'json' },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', ['css?module&importLoaders=2&sourceMap&localIdentName=[path][name]-[local]&-autoprefixer', 'postcss?parser=postcss-scss', 'sass']) }, // eslint-disable-line max-len
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
    new ExtractTextPlugin('[name]-[chunkhash].css', { allChunks: true }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin({ name: ['utils', 'vendor'], minChunks: Infinity }),
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
      },
      sourceMap: true,
    }),
    new HtmlWebpackPlugin({
      template: './webpack/tpl/index.ejs',
      inject: true,
      production: true,
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
