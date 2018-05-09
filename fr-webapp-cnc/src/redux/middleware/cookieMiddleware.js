import reactCookie from 'react-cookie';
import btoa from 'btoa';
import atob from 'atob';

/**
 * This middleware sets or removes a cookie. If the `value` key is present,
 * it tries to create a new cookie, otherwise it tries read. If `remove=true`
 * it will remove the cookie.
 *
 *
  return {
    type: 'ADD_COOKIE',
    cookie: {
      key: 'the-name-of-the-cookie',
      value: '{a: 12332435665769, b:321}',
      format: 'json',
      expires: new Date(2016, 11, 01),
    },
  };

  return {
    type: 'READ_COOKIE',
    cookie: {
      key: 'the-name-of-the-cookie',
    },
  };

  return {
    type: 'REMOVE_COOKIE',
    cookie: {
      key: 'the-name-of-the-cookie',
      remove: true,
    },
  };
 **/

export function cookieMiddleware() {
  return ({ dispatch, getState }) => next => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    if (!action.cookie) {
      return next(action);
    }

    const { key, expires, format, remove, domain, path } = action.cookie;
    let value = action.cookie.value;

    // If value is pressent save the cookie
    if (value) {
      if (format === 'json') {
        // Encode to base64 when saving json
        value = btoa(JSON.stringify(value));
      }

      // Isomorphic cookies!
      reactCookie.save(key, value, {
        path: path || '/',
        expires,
        domain,
      });
    } else if (remove) {
      // Remove the cookie if values is not pressent
      reactCookie.remove(key, {
        path: path || '/',
        domain,
      });
    } else {
      let data = reactCookie.load(key, {
        doNotParse: true,
      });

      if (data && format === 'json') {
        data = JSON.parse(atob(data));
      }

      return next({
        ...action,
        cookie: {
          key,
          value: data,
        },
      });
    }

    return next(action);
  };
}
