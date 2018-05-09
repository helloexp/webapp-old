/* eslint no-console:0 */
// Webpack config for development
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const autoprefixer = require('autoprefixer');
const WebpackHelpers = require('./helpers');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const happyThreadPool = HappyPack.ThreadPool({ size: 3 });
const HOST = process.env.HOST || 'dev.uniqlo.com';
const PORT = process.env.PORT || 3000;
const PUBLIC_PATH = process.env.PUBLIC_PATH || '';
const LANG = process.env.LANG || 'jp';
const DEV_URL = `http://${HOST}:${PORT}/`;
const FULL_PATH = `${PUBLIC_PATH}/${LANG}/cnc/`;

const projectRootPath = path.resolve(__dirname, '../');
const assetsPath = path.resolve(projectRootPath, './static/cnc');

const babelrc = fs.readFileSync('./.babelrc');
let babelrcObject = {};

try {
  babelrcObject = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

const babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {};

// merge global and dev-only plugins
let combinedPlugins = babelrcObject.plugins || [];

combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins);

const babelLoaderQuery = Object.assign({}, babelrcObjectDevelopment, babelrcObject, { plugins: combinedPlugins });

delete babelLoaderQuery.env;

// Since we use .babelrc for client and server, and we don't want HMR enabled on the server, we have to add
// the babel plugin react-transform-hmr manually here.

// make sure react-transform is enabled
babelLoaderQuery.plugins = babelLoaderQuery.plugins || [];
let reactTransform = null;

for (let i = 0; i < babelLoaderQuery.plugins.length; ++i) {
  const plugin = babelLoaderQuery.plugins[i];

  if (Array.isArray(plugin) && plugin[0] === 'react-transform') {
    reactTransform = plugin;
  }
}

if (!reactTransform) {
  reactTransform = ['react-transform', { transforms: [] }];
  babelLoaderQuery.plugins.push(reactTransform);
}

babelLoaderQuery.cacheDirectory = true;

if (!reactTransform[1] || !reactTransform[1].transforms) {
  reactTransform[1] = Object.assign({}, reactTransform[1], { transforms: [] });
}

// make sure react-transform-hmr is enabled
reactTransform[1].transforms.push({
  transform: 'react-transform-hmr',
  imports: ['react'],
  locals: ['module'],
});

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

const webpackConfig = {
  cache: true,
  devtool: 'eval',
  context: path.resolve(__dirname, '..'),
  entry: {
    app: [
      'core-js/modules/es6.string.includes',
      'core-js/modules/es7.array.includes',
      'whatwg-fetch',
      `webpack-dev-server/client?${DEV_URL}`,
      'webpack/hot/only-dev-server',
      './src/client.js',
    ],
    common: [
      './src/components/Atoms/CheckBox/index.js',
      './src/components/Atoms/field/Numeric/index.js',
      './src/components/Atoms/InputLabel/index.js',
      './src/components/Atoms/InputUnderline/index.js',
      './src/components/Atoms/Link/index.js',
      './src/components/Atoms/Radio/index.js',
      './src/components/Atoms/Select/index.js',
      './src/components/Atoms/Text/index.js',
      './src/components/Atoms/Tooltip/index.js',
      './src/components/BrandHeader/index.js',
      './src/components/CouponPanel/index.js',
      './src/components/CreditCardForm/CvvModal/index.js',
      './src/components/CreditCardForm/index.js',
      './src/components/CustomerServiceButton/index.js',
      './src/components/ErrorMessage/index.js',
      './src/components/FormValidator/index.js',
      './src/components/InfoToolTip/index.js',
      './src/components/ProductCard/index.js',
      './src/components/ProductCardCarousel/index.js',
      './src/components/Selector/index.js',
      './src/components/TSLToolTip/index.js',
      './src/components/uniqlo-ui/Chip/index.js',
      './src/components/uniqlo-ui/Chip/index.js',
      './src/components/uniqlo-ui/core/ProxyLink/index.js',
      './src/components/uniqlo-ui/core/Swipable/index.js',
      './src/components/uniqlo-ui/core/Validation/index.js',
      './src/components/uniqlo-ui/FavoriteButton/index.js',
      './src/components/uniqlo-ui/FilmStrip/FilmStrip.js',
      './src/components/uniqlo-ui/ToolTip/index.js',
      './src/containers/ErrorHandler/index.js',
      './src/pages/Checkout/Delivery/index.js',
      './src/utils/certona.js',
      './src/utils/formatUrls.js',
      './src/utils/uniqueId.js',
      'classnames/bind.js',
    ],
  },
  output: {
    path: assetsPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: FULL_PATH,
  },
  devServer: {
    publicPath: DEV_URL,
    hot: true,
    inline: true,
    historyApiFallback: true,
    port: PORT,
    host: '0.0.0.0',
    disableHostCheck: true,
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
      { test: /\.jsx?$/, happy: { id: 'jsx' }, exclude: /node_modules/, loaders: [`babel?${JSON.stringify(babelLoaderQuery)}`, 'eslint-loader'] },
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.scss$/,
        happy: { id: 'scss' },
        loaders: [
          'style',
          'css?importLoaders=2&module&localIdentName=[path][name]-[local]&-autoprefixer&-minimize',
          'sass',
        ],
      },
      { test: /\.(png|jpe?g|gif|svg|eot|ttf|woff2?)$/, exclude: /node_modules/, loader: 'file' },
    ],
  },
  sassLoader: {
    outputStyle: 'expanded',
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
    // hot reload
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __PERF__: process.env.PERF === '1',
      __DEVTOOLS__: true,
      __DLLS__: process.env.WEBPACK_DLLS === '1',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      chunks: ['common', 'app'],
      name: 'common',
      minChunks: Infinity,
    }),
    new HtmlWebpackPlugin({
      template: './webpack/tpl/index.ejs',
      production: false,
      tags: [
        '<script type="text/javascript" src="/dlls/dll__vendor.js" charSet="UTF-8"></script>',
      ].join(''),
      public_path: FULL_PATH,
      lang: LANG,
    }),
    new ProgressBarPlugin(),
    createHappyPlugin('jsx'),
    createHappyPlugin('scss'),
  ],
  postcss() {
    return [
      autoprefixer(),
    ];
  },
};

if (process.env.WEINRE === '1') {
  const Weinre = require('weinre-webpack').default; // eslint-disable-line

  console.log(Weinre);

  webpackConfig.plugins.push(
    new Weinre({
      runServer: true,
      defaultId: '"uniqlo"',
      appendScriptTag: true,
      httpPort: 8080,
      boundHost: '0.0.0.0',
      verbose: false,
      debug: false,
      readTimeout: 5,
      deathTimeout: 15,
    })
  );
}

if (process.env.WEBPACK_DLLS === '1') {
  WebpackHelpers.installVendorDLL(webpackConfig, 'vendor');

  console.log('\n########################');
  console.log('‼️  Using Webpack DLLs. Make sure you have run "npm run dll".');
  console.log('DLLs are valid only in development.');
  console.log('########################\n');
}

module.exports = webpackConfig;
