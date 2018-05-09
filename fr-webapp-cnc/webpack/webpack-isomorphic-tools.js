const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

// see this link for more info on what all of this means
// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
module.exports = {

  // when adding "js" extension to asset types
  // and then enabling debug mode, it may cause a weird error:
  //
  // [0] npm run start-prod exited with code 1
  // Sending SIGTERM to other processes..
  //
  // debug: true,

  assets: {
    images: {
      extensions: [
        'jpeg',
        'jpg',
        'png',
        'gif',
      ],
      parser: WebpackIsomorphicToolsPlugin.url_loader_parser,
    },
    fonts: {
      extensions: [
        'woff',
        'woff2',
        'ttf',
        'eot',
      ],
      parser: WebpackIsomorphicToolsPlugin.url_loader_parser,
    },
    svg: {
      extension: 'svg',
      parser: WebpackIsomorphicToolsPlugin.url_loader_parser,
    },
    // this whole "bootstrap" asset type is only used once in development mode.
    // the only place it's used is the Html.js file
    // where a <style/> tag is created with the contents of the
    // './src/theme/bootstrap.config.js' file.
    // (the aforementioned <style/> tag can reduce the white flash
    //  when refreshing page in development mode)
    //
    // hooking into 'js' extension require()s isn't the best solution
    // and I'm leaving this comment here in case anyone finds a better idea.
    bootstrap: {
      extension: 'js',
      include: ['./src/theme/bootstrap.config.js'],
      filter: function filterBootstrap(module, regex, options, log) {
        function isBootstrapStyle(name) {
          return name.indexOf('./src/theme/bootstrap.config.js') >= 0;
        }

        if (options.development) {
          return isBootstrapStyle(module.name) && WebpackIsomorphicToolsPlugin.style_loader_filter(module, regex, options, log);
        }

        return null;
      },
      // in development mode there's webpack "style-loader",
      // so the module.name is not equal to module.name
      path: WebpackIsomorphicToolsPlugin.style_loader_path_extractor,
      parser: WebpackIsomorphicToolsPlugin.css_loader_parser,
    },
    style_modules: {
      // ---------
      // The CSS Modules on the server-side should export objects with classnames and the CSS text.
      // The `extensions` defines the regular expression to match the module names (it is constructed under the hood).
      // The `filter` function finds the modules that are CSS Modules.
      // The `path` function converts module full names into asset paths.
      // The `parser` function transforms the module source code to export
      // objects that are expected from `require('*.scss')` on the server-side.
      // -- sompylasar
      //
      extensions: [
        'less',
        'scss',
      ],

      filter: function filterStyles(module, regex, options, log) {
        // ---------
        // The `isomorphic-style-loader`, like `style-loader`, is a pitching loader, and during the `pitch`
        // it changes the module so that the remaining part of the module request starts with `css-loader` (the next one to the right).
        // @see https://github.com/kriasoft/isomorphic-style-loader/blob/5e4b0627fcde383a20b53f66d8f3c47d05062722/src/index.js#L14
        // @see https://github.com/kriasoft/isomorphic-style-loader/blob/5e4b0627fcde383a20b53f66d8f3c47d05062722/src/index.js#L21
        // @see https://webpack.github.io/docs/loaders.html#pitching-loader
        // @see https://github.com/webpack/webpack/issues/360#issuecomment-49028914
        // -- sompylasar
        //
        const ret = WebpackIsomorphicToolsPlugin.style_loader_filter(module, regex, options, log);

        if (ret) {
          log.debug(`style_modules.filter ${module.name} -> ${ret}`);
        }

        return ret;
      },
      path: function extractPath(module, options, log) {
        // ---------
        // `isomorphic-style-loader` is similar to `style-loader`,
        // see detailed comment in `filter` above.
        // Here we strip the loaders to return the asset path.
        // The asset path value will become the key in the `webpack-assets.json`.
        // -- sompylasar
        //
        const ret = WebpackIsomorphicToolsPlugin.style_loader_path_extractor(module, options, log);

        log.debug(`style_modules.name ${module.name} -> ${ret}`);

        return ret;
      },
      parser: function styleParser(module, options, log) {
        // ---------
        // `webpack-isomorphic-tools` does not use `webpack` loaders,
        // it uses its own way to convert assets to JS, called parsers.
        // The parser results are collected and cached in the `webpack-assets.json` file.
        // Usually, we would imitate behavior of loaders for known asset types
        // to provide proper `exports` objects on the server-side.
        // But `isomorphic-style-loader`'s `exports` object exports
        // functions `_getCss` and `_insertCss` which for some reason cannot be
        // serialized into `webpack-assets.json` although in `require-hacker`
        // which is responsible for serialization the CommonJS modules are handled specifically.
        // @see https://github.com/halt-hammerzeit/require-hacker/blob/ccd584d68fb8fee8a117b7ddfe0b2bcaeed309e8/source/require%20hacker.js#L280-L297
        // @see https://github.com/halt-hammerzeit/require-hacker/blob/ccd584d68fb8fee8a117b7ddfe0b2bcaeed309e8/source/require%20hacker.js#L451-L456
        // So we reuse the CSS Modules converter from `webpack-isomorphic-tools`
        // that builds a module that exports the CSS Modules classnames
        // and an additional `_style` string property with raw CSS text.
        // This structure gets serialized properly.
        // @see https://github.com/halt-hammerzeit/webpack-isomorphic-tools/blob/5e468729fe0a59eaed4f8a0f9da5ba92a4a7e3c5/source/plugin/plugin.js#L194-L199
        // -- sompylasar
        //
        const ret = WebpackIsomorphicToolsPlugin.css_modules_loader_parser(module, options, log);

        log.debug(`style_modules.parser \n${module.source}\n\n -----------> \n\n${ret}\n`);

        return ret;
      },
    },
  },
};
