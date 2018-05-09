/* eslint no-console:0 */
import webpackConfig from './test.webpack.config';

const argv = process.argv.slice(2).reduce((final, current) => {
  final[current] = current || true;

  return final;
}, {});

const watch = argv.w;
const isCi = process.env.CONTINUOUS_INTEGRATION === 'true';
const argBrowsers = process.argv.find(arg => arg.indexOf('browsers') > -1);
const defaultBrowsers = ['jsdom'];

let browsers;

try {
  browsers = argBrowsers ? argBrowsers.split('=')[1].split(',').map(browser => browser.toLowerCase()) : defaultBrowsers;
} catch (error) {
  console.warn('\n' +
    'Error parsing the browsers you passed in for tests.\n' +
    ' Please make sure they are in the following format: "browsers=browser1,browser2'
  );
  browsers = defaultBrowsers;
}

function formatBrowsers(browserToMap) {
  return browserToMap.map((browser) => {
    if (browser === 'chrome') return 'Chrome';
    if (browser === 'safari') return 'Safari';
    if (browser === 'firefox') return 'Firefox';
    if (browser === 'phantomjs2') return 'PhantomJS2';
    if (browser === 'jsdom') return 'jsdom';

    return browser;
  });
}

export default function (config) {
  config.set({
    browsers: formatBrowsers(browsers),
    basePath: './',
    colors: true,
    debug: true,
    singleRun: !watch || !!process.env.CI || isCi,
    frameworks: ['mocha'],
    concurrency: Infinity,
    files: [
      './tests.webpack.js',
    ].filter(Boolean),
    preprocessors: {
      './tests.webpack.js': ['webpack', 'sourcemap'],
    },
    reporters: ['mocha'],
    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-mocha-reporter',
      browsers.includes('phantomjs2') && 'karma-phantomjs2-launcher',
      browsers.includes('chrome') && 'karma-chrome-launcher',
      browsers.includes('firefox') && 'karma-firefox-launcher',
      browsers.includes('safari') && 'karma-safari-launcher',
      browsers.includes('jsdom') && 'karma-jsdom-launcher',
      'karma-sourcemap-loader',
    ].filter(Boolean),

    webpack: webpackConfig,
    webpackServer: {
      quiet: false,
      noInfo: false,
      progress: true,
      stats: {
        colors: true,
        hash: false,
        assets: false,
        modules: false,
        chunks: false,
        timings: false,
        errors: true,
        errorDetails: true,
        warnings: true,
      },
    },
  });
}
