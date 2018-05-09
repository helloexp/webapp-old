/* eslint no-console:0 */
import { resolve } from 'path';
import Mocha from 'mocha';
import Module from 'module';
import chokidar from 'chokidar';

const watch = process.argv.includes('w');

Function.prototype.ensure = (arr, func) => func(); // eslint-disable-line no-extend-native,b*tch you better let me extend my native!

/**
 * DON'T USE ARROW FUNCTION HERE, SCOPE NEEDS TO BE INTACT
 */
// const originalRequire = Module.prototype.require;
const htmlRegex = /\.(svg|html|png|jpe?g|gif)$/;
const sassRegex = /\.(s?css|sass)$/;

Module.prototype.require = function requireV2(filePath) {
  // no support for images or html
  if (filePath.search(htmlRegex) !== -1) return null;

  // sass modules
  if (filePath.search(sassRegex) !== -1) {
    return { default: {} };
  }

  // webpack modules and module-dirs
  if (filePath.match(/^((?!(\.?\.\/)))(helpers|i18n|utils|containers|config|pages|redux(\/modules|\/create)|components).*$/)) {
    filePath = resolve(__dirname, `../src/${filePath}`);
  }

  if (filePath === 'sync') {
    filePath = resolve(__dirname, '../src/sync');
  }

  if (filePath === 'testHelpers') {
    filePath = resolve('./test/testHelpers');
  }

  // no clue, no touchy, seems to work
  if (filePath === './stream-api') {
    filePath = resolve(__dirname, '../node_modules/readdirp/stream-api.js');
  }

  if (typeof filePath !== 'string') {
    throw new Error(`path must be a string, received: ${filePath}`);
  }

  if (!filePath) {
    throw new Error('path missing, received undefined or null');
  }

  return Module._load(filePath, this);
};

require('./setup');

/**
 * Mocha doesn't support dynamic file changes (except for adding),
 * need to clear require cache and instantiate a new runner
 */
const fileList = [];

function runSuite(specWatcher, sourceWatcher) {
  Object.keys(require.cache).forEach(key => delete require.cache[key]);

  const mocha = new Mocha({ reporters: ['mocha', 'progress'] });

  fileList.forEach(filepath => mocha.addFile(filepath));

  const mochaRunner = mocha.run();

  let fail = false;

  mochaRunner.on('fail', () => { fail = true; });

  mochaRunner.on('end', () => {
    if (!watch) {
      specWatcher.close();
      sourceWatcher.close();
      process.exit(fail ? 1 : 0);
    }
  });
}

/**
 * Chokidar watch for test suite files + sources in case of watch mode
 */

const specWatcher = chokidar.watch(resolve(__dirname, '../src/**/(*.spec.js|.*-test.js)'), { persistent: true });
const sourceWatcher = chokidar.watch(resolve(__dirname, '../src/**/*.js'), { persistent: true });

specWatcher.on('add', path => fileList.push(path));

specWatcher.on('ready', () => {
  console.log('------------------------------');

  return runSuite(specWatcher, sourceWatcher);
});
sourceWatcher.on('change', () => runSuite(specWatcher, sourceWatcher));
