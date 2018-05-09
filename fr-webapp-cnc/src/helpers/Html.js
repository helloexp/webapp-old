/* eslint-disable react/no-danger */
import React, { PureComponent, PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
import config from 'config';
import bowser from 'bowser';
import { getAssetsToPreload } from 'helpers/imagePreloader.js';

function createStyleContent() {
  return {
    __html: `
      @font-face {
        font-family: 'Uniqlo Icons';
        src: url('/${config.region}/fonts/unico.woff') format('woff'),
        url('/${config.region}/fonts/unico.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }

      @font-face {
        font-family: 'Uniqlo Pro Bold';
        src: url('/${config.region}/fonts/UniqloProBold.woff') format('woff'),
        url('/${config.region}/fonts/UniqloProBold.ttf') format('truetype'),
        url('/${config.region}/fonts/UniqloProBold.eot');
        font-weight: normal;
        font-style: normal;
      }

      @font-face {
        font-family: 'Uniqlo Pro Regular';
        src: url('/${config.region}/fonts/UniqloProRegular.woff') format('woff'),
        url('/${config.region}/fonts/UniqloProRegular.ttf') format('truetype'),
        url('/${config.region}/fonts/UniqloProRegular.eot');
        font-weight: normal;
        font-style: normal;
      }

      @font-face {
        font-family: 'Uniqlo Pro Light';
        src: url('/${config.region}/fonts/UniqloProLight.woff') format('woff'),
        url('/${config.region}/fonts/UniqloProLight.ttf') format('truetype'),
        url('/${config.region}/fonts/UniqloProLight.eot');
        font-weight: normal;
        font-style: normal;
      }

      @font-face {
        font-family: 'fontIcons';
        src: url('/${config.region}/fonts/fontIcons.woff') format('woff'),
        url('/${config.region}/fonts/fontIcons.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `,
  };
}

const imagePreloaderScript = `
function llimg(i) {var el=new Image(),src=i.getAttribute('data-fullimg'),p=i.getBoundingClientRect();
if (p.width && p.top<999){el.onload=function() {i.src=src;}; el.src=src;}}
Array.prototype.slice.call(document.querySelectorAll('img[data-fullimg]')).forEach(llimg);`;

const gtmPreloaderScript = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-29C3G');`;

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends PureComponent {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object,
  };

  render() {
    const { assets, component, store } = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';
    const head = Helmet.rewind();
    const browser = bowser._detect(global.navigator.userAgent);
    const incompatibleIOS = browser.ios && parseFloat(browser.osversion, 10) < 9;
    const browserCss = `${browser.name.toLowerCase()} ${browser.a && !incompatibleIOS ? 'highend' : 'lowend'}`;

    return (
      <html className={browserCss} lang="en">
        <head>
          {__DEVELOPMENT__ && __DLLS__ && [
            <script charSet="UTF-8" key="dlls__vendor" src="/dist/dlls/dll__vendor.js" />,
          ]}
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}
          <link href={`/${config.region}/favicon.ico`} rel="shortcut icon" />
          <meta content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width" name="viewport" />

          <meta content="telephone=no" name="format-detection" />
          <style dangerouslySetInnerHTML={createStyleContent()} />
          <script charSet="UTF-8" dangerouslySetInnerHTML={{ __html: 'var __gyr = { "config": { "clientToken": "NEAL1FDMMB","site": "uniqlo.com"}};' }} />
        </head>
        <body>
          <div dangerouslySetInnerHTML={{ __html: content }} id="content" />
          <script charSet="UTF-8" dangerouslySetInnerHTML={{ __html: imagePreloaderScript }} />
          <script charSet="UTF-8" dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(store.getState())};` }} />
          <script charSet="UTF-8" dangerouslySetInnerHTML={{ __html: 'var dataLayer = [{ "device": "smartphone" }];' }} />
          <script charSet="UTF-8" dangerouslySetInnerHTML={{ __html: gtmPreloaderScript }} />
          <script charSet="UTF-8" src={assets.javascript.vendor} />
          <script charSet="UTF-8" src={assets.javascript.utils} />
          <script charSet="UTF-8" src={assets.javascript.ui} />
          <script charSet="UTF-8" src={assets.javascript.app} />
          {Object.keys(assets.javascript).map((js, key) =>
            (['app', 'vendor', 'ui', 'utils'].indexOf(js) === -1 ? <link as="script" href={assets.javascript[js]} key={key} rel="preload" /> : null)
          )}
          <div dangerouslySetInnerHTML={{ __html: getAssetsToPreload() }} id="assetPreloader" />
        </body>
      </html>
    );
  }
}
