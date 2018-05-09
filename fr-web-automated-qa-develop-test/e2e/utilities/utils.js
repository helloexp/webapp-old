/*
 Utility function
 TODO
 * Code optimization and refactring are pending
 * Need to rework according to html changes
 */

const commonUtilities = {

  /**
   * Clones an existing object into a new one.
   * If keys is provided then only those will be added to the new object.
   * If keys is not provided the it will perform a 1:1 clone of source object
   *
   * @param {Object} [obj]
   *   The object from which to copy
   * @param {Array} [keys]
   *   List of keys to be copied from the oldObj
   * @return {Object} newObj
   *   The new test data object
   */
  cloneObj: function copy(obj, keys) {
    let newObj = {};

    if (!keys) {
      keys = Object.keys(obj);
    }

    for (let i = 0; i < keys.length; i++) {
      if (!obj[keys[i]]) {
        console.log('Invalid property ' + keys[i] + ' provided for source object. Key ignored.');
      }
      newObj[keys[i]] = obj[keys[i]];
    }

    return newObj;
  },

  /**
   * Custom browser command to validate that current URL contains an expected path
   * It waits up to 45 seconds for browser to load
   *
   * @param {String} expectedPath
   */
  urlValidation: function urlValidation(expectedPath) {
    let i = 0;
    while (!browser.getUrl().includes(expectedPath) && i < 60) {
      browser.pause(500);
      i++;
    }
    expect(browser.getUrl()).to.contain(expectedPath);
  },

  /**
   * Waits for Loading Indicator to dissapear
   */
  waitForLoading: function waitForLoading(waitTime, index = 1, waitForExtraLoad = false) {
    waitTime = waitTime || browser.options.waitforTimeout;
    try {
      browser.pause(850);
      if (waitForExtraLoad) {
        browser.pause(500);
      }
      const isVisible = browser.isVisible('//div[contains(@class,"LoadingIndicator")]');
      if (isVisible && index * 500 < waitTime) {
        this.waitForLoading(waitTime, index + 1);
      } else if (isVisible && index * 500 >= waitTime) {
        throw `API keeps loading even after ${waitTime}`;
      } else if (!isVisible && !waitForExtraLoad) {
        this.waitForLoading(waitTime, index, true);
      }
    } catch (err) {
      console.log(`Wait for Loading failed with error: ${err}`);
      throw err
    }
  },


  /**
   * Navigates to current test environment defined by browser.options.baseUrl
   */
  switchToCurrentTestEnv: function switchToCurrentTestEnv() {
    console.log('Current URL: ' + browser.getUrl());
    console.log('Base URL ' + browser.options.baseUrl);
    if (!browser.getUrl().includes(browser.options.baseUrl)) {
      let loc = browser.execute(function () {
        return {
          origin: location.origin,
          pathname: location.pathname,
          search: location.search
        };
      });
      browser.url(browser.options.baseUrl + loc.value.pathname + loc.value.search);
    }
  }
};

/**
 * Converts the obove object to Custom Command
 */

module.exports = {
  init: function () {
    Object.keys(commonUtilities).forEach(function (key) {
      browser.addCommand(key, commonUtilities[key]);
    });
  }
};
