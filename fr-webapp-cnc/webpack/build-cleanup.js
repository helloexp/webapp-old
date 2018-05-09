const fs = require('fs');

const config = {
  buildAssetsPath: './build',
  cleanupExcludes: {},
};

function compilerAfterEmitCallback(compilation, callback) {
  const assetNames = {};

  for (const filename in compilation.assets) {
    if (!config.cleanupExcludes[filename]) {
      assetNames[filename] = filename;
    }
  }

  // get a list of files and folders in the build output directory
  // and then delete files that are neither assets from present build
  // nor files from the exclude list.
  // this approach preserves files that have same build hash.
  fs.readdir(config.buildAssetsPath, (err, files) => {
    if (err) {
      return;
    }

    files.forEach((asset) => {
      if (!config.cleanupExcludes[asset] && !assetNames[asset] && fs.statSync(`${config.buildAssetsPath}/${asset}`).isFile()) {
        // only file deletions.
        fs.unlinkSync(`${config.buildAssetsPath}/${asset}`);
      }
    });
  });

  callback();
}

function BuildCleanupPlugin(options) {
  Object.assign(config, options);
}

BuildCleanupPlugin.prototype.apply = function apply(compiler) {
  compiler.plugin('after-emit', compilerAfterEmitCallback);
};

module.exports = BuildCleanupPlugin;
