/**
 *
 * wdio.conf.iOSSim.js
 * Test configuration file used for iOS test environment
 * It uses Chome with Google Nexus 5 mobileEmulation
 *
 */
let merge = require('deepmerge');
let wdioConfChrome = require('./wdio.conf.chrome.js');

const getSelectedTextCases = function () {
  const tickets = (process.env.npm_config_selected || '').split(',');
  const suites = ['smoke', 'smokeExisting', 'regression', 'regressionExisting', 'apiErrorHandling', 'validation', 'nightjob'];
  const production = ['smoke', 'smokeExisting', 'regression', 'regressionExisting', 'apiErrorHandling', 'validation'];
  let ticketToTest = [], testFilter;
  if (tickets.includes('fullRegression')) {
    suites.forEach((ticket) => {
      ticketToTest = ticketToTest.concat(wdioConfChrome.config.suites[ticket] || []);
    });
  } else if (tickets.includes('production')) {
    production.forEach((ticket) => {
      ticketToTest = ticketToTest.concat(wdioConfChrome.config.suites[ticket] || []);
    });
  } else if (tickets.find((testSuite) => suites.includes(testSuite))) {
    tickets.forEach((ticket) => {
      ticketToTest = ticketToTest.concat(suites.includes(ticket) && wdioConfChrome.config.suites[ticket] || []);
    });
  } else if (tickets.length > 0) {
    tickets.forEach((ticket) => {
      testFilter = (tc) => (tc.indexOf(`ACC${ticket}-`) !== -1);
      suites.forEach((suite) => {
        ticketToTest = ticketToTest.concat(wdioConfChrome.config.suites[suite].filter(testFilter));
        ticketToTest= ticketToTest.filter((data, index, array)=> array.indexOf(data) == index        
        )
      });
    });
  }

  return ticketToTest;
};

let wdioSelectedConfig = merge(wdioConfChrome.config, {

  suites: {
    selected: getSelectedTextCases()
  }
});

exports.config = wdioSelectedConfig;