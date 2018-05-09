const path = require('path');
const webpack = require('webpack');

const root = path.resolve(__dirname, '..', '..', '..');
const loaders = [
  { test: /\.jsx?$/, happy: { id: 'jsx' }, exclude: /node_modules/, loaders: ['babel'] },
  { test: /\.json$/, loader: 'json' },
];

module.exports = {
  devtool: 'eval',
  output: {
    path: path.join(root, 'static/cnc/dlls'),
    filename: 'dll__[name].js',
    library: 'DLL_[name]',
  },
  module: {
    loaders,
  },
  entry: {
    vendor: [
      // <babel-runtime>
      //
      // Generate this list using the following command against the stdout of
      // webpack running against the source bundle config (dev/prod.js):
      //
      //     webpack \
      //      --config ./webpack/dev.config.js \
      //      --display-modules | egrep -o 'babel-runtime/\S+' | sed 's/\.js$//' | sort | uniq
      // </babel-runtime>
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
      'es6-promise',
      'scriptjs',
      'atob',
      'btoa',
      'react-textarea-autosize',
    ],
  },
  resolve: {
    // root: path.resolve(root, 'node_modules'),
    extensions: ['', '.js'],
    postfixes: [],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.DllPlugin({
      path: path.join(root, 'webpack/dlls/manifests/[name].json'),
      name: 'DLL_[name]',
    }),
  ],
};
