import clientStorage from 'utils/clientStorage';
import { toCache, fromCache, rmCache } from 'utils/cacheClient';
import config from '../config';

/**
 * Api method names
 * @type {Array<string>}
 */
const methods = ['get', 'post', 'put', 'PATCH', 'delete'];

// used by getAccessToken to supply locally cached version tokens to API calls.
let cachedAccessToken;

/**
 * format URL used for non-graphQL API calls.
 * Basically appends a leading / if one if not there and combines the host if one was provided.
 * Host is provided in all the cases as of now.
 * @param {string} path
 * @param {string} host
 * @returns {string}
 */
function formatUrl(path, host) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;

  if (host) {
    return host + path;
  }

  return adjustedPath;
}

/**
 * Generate response body
 * @param {*} data
 * @param {*} body
 * @returns {*}
 */
function generateBody(data, body) {
  if (body) {
    return body;
  }

  if (data) {
    return JSON.stringify(data);
  }

  return null;
}

/**
 * Generate credentials
 * @param {string} credentials
 * @returns {string}
 */
function generateCredentials(credentials) {
  if (credentials) {
    return [
      'omit',
      'include',
      'same-origin',
    ].indexOf(credentials) === -1 ? 'include' : credentials;
  }

  return 'same-origin';
}

/**
 * Generate request endpoint
 * @param {string} path
 * @param {string} host
 * @param {Object} paramsWithToken
 * @returns {string}
 */
function generateEndpoint(path, host, paramsWithToken) {
  let endpoint = formatUrl(path, host);

  if (paramsWithToken) {
    const queryParams = Object.keys(paramsWithToken).map(key => `${key}=${paramsWithToken[key]}`);

    endpoint = `${endpoint}?${queryParams.join('&')}`;
  }

  return endpoint;
}

/**
 * Parse API json response

 * @export
 * @param {Object} res - response object
 * @param {String} method - REST API method
 * @param {Object} params - query parameters used in API call
 * @returns {Promise}
 */
export function parseJSON(res, { method, params }) {
  const json = res.text().then((text) => {
    try {
      // Some APIs are not returning JSON when failing,
      // instead APIs return a word like "Unauthorized"
      // or an empty body response.
      return JSON.parse(text);
    } catch (error) {
      return {
        statusCode: res.status,
        ...error,
      };
    }
  });

  if (res.status >= 400) {
    // When the server response contains important JSON data for errors
    return json.then(error => ({
      ...error,
      method,
      params,
      endpoint: res.url,
      statusCode: res.status,
    })).then(Promise.reject.bind(Promise));
  }

  // There are certain cases where GDS API return status 2xx
  // but also sends some errorCodes in an error_list<array>.
  // These errors also need to be handled like the 4xxs.
  // The condition res.status >= 200 && res.status <= 400 checks both.
  // We return the first error object matching the codes in errorCodes2xx<array>

  return json.then((response) => {
    if (res.status >= 200 && res.status <= 400) {
      const errorCodeFound = response.error_list &&
      response.error_list.find(error => config.errorCodes2xx.includes(error.resultCode));

      if (errorCodeFound) {
        return Promise.reject({
          ...errorCodeFound,
          response,
          method,
          params,
          endpoint: res.url,
          statusCode: res.status,
        });
      }
    }

    return response;
  });
}

/**
 * This function process the error when the server is down or there's not
 * connectivity available. It also process all other errors, but doesn't do anything special for those.
 */
function handleConnectionErrors(error, { method, params, endpoint }) {
  return Promise.reject({
    ...error,
    statusCode: error.statusCode || 0,
    method,
    params,
    endpoint,
  });
}

/**
 * Get access token used in API calls.
 * this can come from locally cached version or from local storage.
 * @returns {Promise}  The promise resolves to a string.
 */
function getAccessToken() {
  const now = Date.now();

  // if cached accesstoken is not fresh or not present, look for a better one in local storage.
  if (cachedAccessToken && cachedAccessToken.tokenExpiresIn > now) {
    return Promise.resolve(cachedAccessToken.accessToken);
  }

  return clientStorage
    .get(config.app.localStorageKeys.authStorage)
    .then((user) => {
      cachedAccessToken = user;

      return user && user.accessToken;
    });
}

/**
 * Generate request headers
 * @param {Object} additionalHeaders
 * @param {boolean} accessTokenInHeader
 * @param {string} accessToken
 * @returns {*}
 */
function generateHeaders(additionalHeaders, accessTokenInHeader, accessToken) {
  if (accessToken) {
    if (accessTokenInHeader) {
      additionalHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }

  const headersObject = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  const headersInstance = new Headers();

  Object.keys(headersObject).forEach(headerKey =>
    headersInstance.append(headerKey, headersObject[headerKey]));

  return headersInstance;
}

/**
 * Generate api method
 * @param {string} method
 * @param {Object} req
 * @returns {ApiClient~method}
 */
function generateApiMethod(method, req) {
  return (path, { host, params, data, body, headers, credentials, tokenType = null } = {}) => {
    const additionalHeaders = {
      ...headers,
      'user-agent': req && req.headers['user-agent'],
    };

    return getAccessToken().then((accessToken) => {
      let accessTokenInHeader = false;
      let urlParams = params;

      if (tokenType) {
        if (tokenType === 'Bearer') {
          accessTokenInHeader = true;
        } else if (accessToken) {
          urlParams = { ...params, [tokenType]: accessToken };
        }
      }

      const endpoint = generateEndpoint(path, host, urlParams);

      return fetch(endpoint, {
        method,
        credentials: generateCredentials(credentials),
        body: generateBody(data, body),
        headers: generateHeaders(additionalHeaders, accessTokenInHeader, accessToken),
      })
      .then(result => parseJSON(result, { method, params }))
      .catch(error => handleConnectionErrors(error, { method, params, endpoint }));
    });
  };
}

/*
 * This silly underscore is here to avoid a mysterious "ReferenceError: ApiClient is not defined" error.
 * See Issue #14. https://github.com/erikras/react-redux-universal-hot-example/issues/14
 *
 * Remove it at your own risk.
 */
class _ApiClient {
  constructor(req, res) {
    this.getRequest = () => req;

    this.getResponse = () => res;

    for (let i = 0; i < methods.length; i++) {
      const method = methods[i];

      this[method] = generateApiMethod(method, req);
    }

    // caching layer
    // see helpers/CacheClient.js for info
    // toCache('key',vaule, optional-lifetime);
    this.toCache = toCache;

    // fromCache('key')
    this.fromCache = fromCache;

    // rm('key')
    this.rmCache = rmCache;

    // client db storage. 1 day expiry default.
    this.toDb = clientStorage.set.bind(clientStorage);
    this.fromDb = clientStorage.get.bind(clientStorage);
    this.rmDb = clientStorage.remove.bind(clientStorage);
  }
}

const ApiClient = _ApiClient;

export default ApiClient;
