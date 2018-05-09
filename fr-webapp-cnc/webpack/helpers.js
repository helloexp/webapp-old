/* eslint-disable no-console, no-inline-comments, global-require, import/no-dynamic-require */
const path = require('path');
const webpack = require('webpack');

const root = path.resolve(__dirname, '..');

function loadDLLManifest(filePath) {
  try {
    return require(filePath);
  } catch (error) {
    process.env.WEBPACK_DLLS = '0';

    console.error(
      function errorHandler() { /*
       ========================================================================
       Environment Error
       ------------------------------------------------------------------------
       You have requested to use webpack DLLs (env var WEBPACK_DLLS=1) but a
       manifest could not be found. This likely means you have forgotten to
       build the DLLs.

       You can do that by running:

       npm run build-dlls

       The request to use DLLs for this build will be ignored.
      */ }.toString().slice(15, -4)
    );
  }

  return undefined;
}

exports.installVendorDLL = function installer(config, dllName) {
  // DLL shizzle. Read more about this in /webpack/dlls/README.md
  if (process.env.WEBPACK_DLLS === '1') {
    const manifest = loadDLLManifest(path.join(root, `webpack/dlls/manifests/${dllName}.json`));

    if (manifest) {
      console.warn('Webpack: will be using the "%s" DLL.', dllName);

      config.plugins.push(new webpack.DllReferencePlugin({
        context: root,
        manifest,
      }));
    }
  }
};
