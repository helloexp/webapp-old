/**
 * Constructor for abstract Page class
 * @constructor
 */
function Page() {
}

/**
 * Prototype function to navigate to a page
 * @param path
 */
Page.prototype.open = function (path) {
  browser.url('/' + path);
};

/**
 * Abstract Page class instance to be inherited by all Application pages
 * @type {Page}
 */
module.exports = new Page();
