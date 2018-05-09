// third-party core reducers
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';

// core app reducers
import app from './app';
import auth from './account/auth';
import cart from './cart/reducer';
import errorHandler from './errorHandler';
import header from './header';
import order from './checkout/order';

export default {
  errorHandler,
  app,
  auth,
  cart,
  header,
  order,
  reduxAsyncConnect,
  routing: routerReducer,
};
