require('babel-polyfill');
const merge = require('webpack-merge');
const development = require('./dev.config');
const production = require('./prod.config');
const s3Config = require('./s3.config');

const TARGET = process.env.npm_lifecycle_event;

process.env.BABEL_ENV = TARGET;

// Update here with common configuration from dev and production configuration files
const common = {};

if (TARGET === 'watch-client' || !TARGET) {
  module.exports = merge(development, common);
}

if (TARGET === 'build' || !TARGET) {
  module.exports = merge(production, common);
}

if (TARGET === 'deploy-staging' || !TARGET) {
  module.exports = merge(production, common, s3Config);
}

