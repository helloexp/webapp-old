const fs = require('fs');

/**
 * Copy files from... to...
 * @param {Object} options { from: path, to: filename }
 *
 * CopyFilesPlugin([
      { from: path.resolve(__dirname, '../static', 'polyfill.min.js'), to: 'p.js' },
    ]),
 */
function copyFilesPlugin(options) {
  const files = options || [];

  return function copyFiles() {
    this.plugin('emit', (compilation, callback) =>
      files.forEach(source =>
        fs.readFile(source.from, 'utf-8', (err, data) => {
          compilation.assets[source.to] = {
            source: () => data,
            size: () => data.length,
          };
          callback();
        })
      )
    );
  };
}

module.exports = copyFilesPlugin;
