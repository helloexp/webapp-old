import { getCurrentBrand } from 'utils/routing';
import { getRoutingPathName, getRoutingSearch } from 'redux/modules/selectors';
import { isLoginCookieInValid } from 'redux/modules/account/selectors';
import { forceLogin } from 'redux/modules/account/auth';

export default function clientMiddleware(client) {
  return ({ dispatch, getState }) => next => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { promise, types, hideLoading = false, ...rest } = action;

    if (!promise) {
      return next(action);
    }

    const [REQUEST, SUCCESS, FAILURE] = types;

    next({ ...rest, type: REQUEST, isXHr: !hideLoading });

    const state = getState();
    const path = getRoutingPathName(state);
    const isForceLogin = isLoginCookieInValid(state, { path });

    if (isForceLogin) {
      const search = getRoutingSearch(state);

      dispatch(forceLogin(path + search));

      return Promise.reject();
    }

    const actionPromise = promise(client, getCurrentBrand(state));

    actionPromise
      .then(result => next({ ...rest, result, type: SUCCESS, isXHr: false }))
      .catch(error => next({ ...rest, error, type: FAILURE, isXHr: false }));

    return actionPromise;
  };
}
