/**
 *
 * wdio.conf.iOSSim.js
 * Test configuration file used for iOS test environment
 * It uses Chrome with Google Nexus 5 mobileEmulation
 *
 */
let merge = require('deepmerge');
let wdioConfBase = require('./wdio.conf.base.js');

exports.config = merge(wdioConfBase.config, {

  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  capabilities: [{
    browserName:   'chrome',
    chromeOptions: {
      args:            ['--reduce-security-for-testing','no-sandbox', '--disable-notofications','--profile.password_manager_enabled','--window-size=390,780'],
       prefs: {
                'credentials_enable_service': false,
                'profile': {
                    'password_manager_enabled': false
                }
            },
      mobileEmulation: {
        deviceName: 'iPhone 6'
        // deviceName: 'Google Nexus 5'
      }
    }
  }],

  // Gets executed before test execution begins. At this point you can access all global
  // variables, such as `browser`. It is the perfect place to define custom commands.
  before: function (capabilities, specs) {
    /**
     * Setup the Chai assertion framework
     */
    let chai = require('chai');
    global.expect = chai.expect;

    let i18n = require('./e2e/data/i18n.js');
    let language = process.env.npm_config_locale || 'jp';
    global.locale = language;
    global.i18n = i18n[language];

    console.log('Starting Test Case: -', specs[0].replace(/^.*[\\\/]/, ''));

    let utils = require('./e2e/utilities/utils');
    utils.init();

    let size = {
      width: 412,
      height: 732
    };
    browser.setViewportSize(size);
    browser.timeouts('page load', 60000);
    browser.params = this.params;
  }

});
