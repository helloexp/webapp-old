/* eslint-disable global-require, import/no-dynamic-require */
import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import httpProxy from 'http-proxy';
import path from 'path';
import http from 'http';
import PrettyError from 'pretty-error';
import { clearPreloadList } from 'helpers/imagePreloader.js';

import { match } from 'react-router';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
import { Provider } from 'react-redux';
import { init as routingHelpersInit } from 'utils/routing';
import noop from 'utils/noop';
import logger from 'utils/logger';
import { YEAR } from 'utils/formatDate';
import { I18nProvider, getI18nConfig, loadI18n } from 'i18n';
import config from './config';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import Html from './helpers/Html';
import getRoutes from './routes';
import { parseRouteRenderRules } from './helpers/ShouldRender';
import Profiler from './helpers/Profiler';

logger.enable();

const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);
const proxyServer = httpProxy.createProxyServer({ ws: false });

app.use(helmet({
  frameguard: false,
  referrerPolicy: {
    policy: 'same-origin',
  },
}));

app.use(`/${config.region}`, favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));
// This non-functional and seemingly irrelevant static asset provider line is casting magic to display header, footer and navbar consistently.
app.use(Express.static(path.join(__dirname, '..', 'static')));
app.use(({ method, protocol, hostname, originalUrl, originalUrl: requestUrl }, res, next) => {
  console.log(`---> [@${Date.now()}] [${method}] [${protocol}] [${hostname}] ${originalUrl}`); // eslint-disable-line no-console
  next();
});
app.use(`/${config.region}`, Express.static(path.join(__dirname, '..', 'static'), { maxAge: YEAR }));

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxyServer.on('error', (error, req, res) => {
  logger.error('proxy error', error);

  if (!res.headersSent) {
    res.writeHead(500, { 'content-type': 'application/json' });
  }

  const json = { error: 'proxy_error', reason: error.message };

  res.end(JSON.stringify(json));
});

app.use(/\/(jp|us|eu|tw)\/status\.json/, (req, res) => {
  res.status(200).send('{"status": "200", "description": "I am alive"}');
});

app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  Profiler.startCPUTrace('server-request');

  global.navigator = { userAgent: req.headers['user-agent'] };
  global.window = {
    location: {
      host: `${config.host}:${config.port}`,
      hostname: config.host,
      href: req.originalUrl,
      pathname: req.path,
      protocol: req.protocol,
      port: config.port,
    },
  };

  const client = new ApiClient(req, res);
  const history = createHistory(req.originalUrl);

  const store = createStore(history, client);

  function hydrateOnClient() {
    res.send(`<!doctype html>\n${
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store} />)}`);
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();

    return;
  }

  match({ history, routes: getRoutes(store, req, res), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      logger.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {
      clearPreloadList();

      routingHelpersInit({ region: renderProps.params.region, router: renderProps.router, location: renderProps.location });
      const i18n = getI18nConfig(renderProps.params.route);
      const strings = require(`./i18n/strings-${i18n.language}`);

      loadI18n(i18n.region, noop);

      loadOnServer({ ...renderProps, store, helpers: { client } }).then(() => {
        // set state for shouldRender
        parseRouteRenderRules(store.getState().routing);
        const component = (
          <I18nProvider config={i18n} strings={strings}>
            <Provider key="provider" store={store}>
              <ReduxAsyncConnect {...renderProps} />
            </Provider>
          </I18nProvider>
        );

        res.status(200);

        const renderedHtml = ReactDOM.renderToString(
          <Html
            assets={webpackIsomorphicTools.assets()}
            component={component}
            store={store}
          />);

        res.send(`<!doctype html>\n ${renderedHtml}`);
      }).catch((renderError) => {
        // SSR Failed - this is the OHH SHHHHIII.. moment.
        logger.error('SSR ERROR:', renderError);
        res.status(500);
        hydrateOnClient();
      });
    } else {
      res.status(404).send('Not found');
    }
  });

  /**
   * Capture Memory information
   * */
  Profiler.takeMemorySnapshot('server-request');

  /**
   * Capture CPU information
   * */
  Profiler.stopCPUTrace('server-request');
});

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      logger.error(err);
    }
    logger.log('----\n==> ✅  %s is running.', config.app.title);
    logger.log('\n==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  logger.error('==>     ERROR: No PORT environment variable has been specified');
}
