import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { match, Router, useRouterHistory, applyRouterMiddleware } from 'react-router';
import { stringify, parse } from 'qs';
import createBrowserHistory from 'history/lib/createBrowserHistory'; // eslint-disable-line import/no-extraneous-dependencies import/extensions
import { ReduxAsyncConnect } from 'redux-connect';
import { useScroll } from 'react-router-scroll';
// import initServiceWorker from 'helpers/ServiceWorker';  // eslint-disable-line no-unused-vars
import { parseRouteRenderRules } from 'helpers/ShouldRender';
import { I18nProvider, loadI18n } from 'i18n';
import { init as routingHelpersInit } from 'utils/routing';
import { routes as allRoutes } from 'utils/urlPatterns';
import getRoutes from './routes';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';

const regionMatch = window.location.pathname.match(/^\/([a-z]{2})/i) || [null, 'jp'];

/**
 * Clean up HTML after the app has started
 * @return {[type]} [description]
 */
function cleanup() {
  const body = document.body;

  // remove font preloaders
  body.removeChild(document.getElementById('fp1'));
  body.removeChild(document.getElementById('fp2'));
  body.removeChild(document.getElementById('fp3'));
}

loadI18n(regionMatch[1], (strings, i18nConfig) => {
  const client = new ApiClient();
  const stringifyQuery = query => stringify(query, { arrayFormat: 'brackets' });
  const history = useRouterHistory(createBrowserHistory)({ parseQueryString: parse, stringifyQuery });
  const dest = document.getElementById('content');

  const windowData = window.__data; // eslint-disable-line no-underscore-dangle

  if (windowData) {
    windowData.routing.locationBeforeTransitions.hash = window.location.hash;
  }
  const store = createStore(history, client, windowData || {});

  parseRouteRenderRules(store.getState().routing);

  const applyUseScroll = () => useScroll((prevRouterProps, { location }) => {
    if (location.action === 'PUSH' || location.pathname.includes(allRoutes.creditCard)) {
      return [0, 0];
    } else if (location.action === 'POP') {
      return true;
    }

    return false;
  });

  const routes = getRoutes(store);

  const component = (
      <Router
        history={history}
        render={props =>
          <ReduxAsyncConnect
            {...props}
            filter={item => !item.deferred}
            helpers={{ client }}
            render={applyRouterMiddleware(applyUseScroll())}
          />
        }
      >
        { routes }
      </Router>
  );

  function renderApp() {
    /* <DEV> */
    let Perf;

    if (__PERF__) {
      Perf = require('react-addons-perf'); // eslint-disable-line global-require

      Perf.start();
    }
    /* </DEV> */

    ReactDOM.render(
      <I18nProvider config={i18nConfig} strings={strings}>
        <Provider key="provider" store={store}>
          {component}
        </Provider>
      </I18nProvider>,
      dest
    );

    cleanup();

    /* <DEV> */
    /* eslint-disable no-console */
    if (__PERF__) {
      setTimeout(() => {
        Perf.stop();
        console.log('Getting performance measurements...');
        Perf.getLastMeasurements();
        console.log('Inclusive benchmarks');
        Perf.printInclusive();
        console.log('Exclusive benchmarks');
        Perf.printExclusive();
        console.log('Waste');
        Perf.printWasted();
      }, 15000);
    }
    /* eslint-enable no-console */
    /* </DEV> */
  }

  match({ history, routes }, (error, redirectLocation, renderProps) => {
    const region = renderProps ? renderProps.params.region : 'jp';

    routingHelpersInit({ region, ...renderProps });

    renderApp();
  });

  if (module.hot) {
    module.hot.accept('./routes', () => Router.replaceRoutes(require('./routes')(store))); // eslint-disable-line global-require
  }
});

/* <DEV> */
if (process.env.NODE_ENV !== 'production') {
  // enable debugger
  window.React = React;

  // this block will be automatically removed in production
  console.log('\n'); // eslint-disable-line no-console
  console.log(   // eslint-disable-line no-console
    '%c ------ UNIQLO DEV MODE ------',
    'color: #fff; background: #FC0D1B; border: 4px solid #fff; padding: 18px 24px; font-size: 1.2em; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;', // eslint-disable-line max-len
    '\n\n\n'
  );

  // if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
  //   console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  // }
}
/* </DEV> */
