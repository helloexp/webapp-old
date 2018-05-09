import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import clientMiddleware from './middleware/clientMiddleware';
import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware';
import { cookieMiddleware } from './middleware/cookieMiddleware';
import { redirectMiddleware } from './middleware/redirectMiddleware';
import { blueGateMiddleware } from './middleware/blueGateMiddleware';
import createReducer from './createReducer';

let globalStore = {};

export default function createStore(history, client, data) {
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = routerMiddleware(history);
  const middleware = [
    clientMiddleware(client),
    errorHandlerMiddleware,
    reduxRouterMiddleware,
    cookieMiddleware(client),
    redirectMiddleware(client),
    blueGateMiddleware(client),
  ];
  let finalCreateStore;

  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools'); // eslint-disable-line global-require
    const DevTools = require('../containers/DevTools/DevTools'); // eslint-disable-line global-require

    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  globalStore = finalCreateStore(createReducer(), data);

  globalStore.asyncReducers = {};
  syncHistoryWithStore(history, globalStore);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules', () => {
      globalStore.replaceReducer(createReducer(globalStore.asyncReducers));
    });
  }

  return globalStore;
}

/**
 * Exports global store object.
 * @returns {{dispatch: Function, getState: Function}}
 */
export function getStore() {
  return globalStore;
}

/**
 * Register async loaded reducers in store and replace
 * current state-reducer with the a new reducer
 *
 * @export
 * @param {Object} store - the store object
 * @param {Object} asyncReducer - async reducer modules
 */
let injected = [];

export function injectAsyncReducers(store, asyncReducers) {
  const newReducers = Object.keys(asyncReducers);
  const alreadyInjected = newReducers.every(reducer => injected.includes(reducer));

  // don't re-inject reducers that are already there
  if (alreadyInjected) {
    return;
  }

  // mark injected reducers (unique)
  injected = injected
    .concat(newReducers)
    .filter((value, index, arr) => arr.indexOf(value) === index);

  store.asyncReducers = { ...store.asyncReducers, ...asyncReducers };
  store.replaceReducer(createReducer(store.asyncReducers));
}
