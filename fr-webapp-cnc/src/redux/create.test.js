import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import clientMiddleware from './middleware/clientMiddleware';
import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware';
import { cookieMiddleware } from './middleware/cookieMiddleware';
import { redirectMiddleware } from './middleware/redirectMiddleware';
import { blueGateMiddleware } from './middleware/blueGateMiddleware';
import reducer from './modules/reducer';

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

  const store = finalCreateStore(reducer, data);

  syncHistoryWithStore(history, store);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(reducer);
    });
  }

  return store;
}
