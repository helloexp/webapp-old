import { LOCATION_CHANGE } from 'react-router-redux';
import { redirect as navigateTo } from 'utils/routing';
import { trackNavigation } from 'utils/gtm';

export function redirectMiddleware() {
  return ({ dispatch, getState }) => next => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { redirect, type } = action;

    if (type === LOCATION_CHANGE) {
      trackNavigation();
    }

    if (!redirect || !redirect.location) {
      return next(action);
    }

    const { location } = redirect;

    navigateTo(location);

    return next(action);
  };
}
