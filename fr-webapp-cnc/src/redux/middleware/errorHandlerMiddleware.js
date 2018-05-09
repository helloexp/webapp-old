import { apiTypes } from 'config/api';
import { nonLoginGDSErrorCodes } from 'config/site/default';
import {
  pushAPIErrorMessage,
  popAPIErrorMessage,
  pushDetailedErrorMessage,
  ErrorReactor,
  getDetailedErrorMessages,
  resetDetailedErrorMessages,
} from 'redux/modules/errorHandler';
import { getInstanceOfApplePaySession } from 'helpers/ApplePay';
import { apiUrlPatterns, getBrandFromAPIEndpoint } from 'utils/urlPatterns';
import { trackError } from 'utils/gtm';
import { getRoutingPathName, getRoutingSearch } from 'redux/modules/selectors';
import { updateItemsInventoryStatus } from 'redux/modules/cart';
import { forceLogin } from 'redux/modules/account/auth';

const methodSet = {
  delete: 'D',
  get: 'G',
  post: 'P',
  put: 'U',
};

/**
 * A thunk for getting the acronym for the RESTful api method
 * (Special Case: GDS API is hosted at Akamai and it supports only 'get' and 'post'.
 * Hence 'put' basically a 'post' and 'delete' is a 'get' with the method name in request URL.
 * @param  {string} method - the original REST method
 * @param  {string} endpoint - api url
 * @param  {string} apiType - basically to identify special cases
 * @returns  {string} Acronym ('D' - DELETE, 'G' - GET, 'P' - POST, 'U' - PUT (update) )
 */
function parseMethod(method, endpoint, apiType) {
  if (apiType === apiTypes.GDS) {
    const gdsApiPatterns = apiUrlPatterns.GDS;

    if (method === 'get') {
      return gdsApiPatterns.delete.test(endpoint) ? methodSet.delete : methodSet.get;
    }

    if (method === 'post') {
      return gdsApiPatterns.put.test(endpoint) ? methodSet.put : methodSet.post;
    }
  }

  return methodSet[method];
}

/**
 * Middleware for intercepting API errors
 * Sample configuration:
 *
 *    errorHandler: {
 *      showMessage: true,       [default: false]
 *      enableReaction: true,    [default: false]
 *      isFakeError: false,      [default: false]
 *      isBlueGateError: true,   [default: false]
 *      skipErrorCodes: Array.<Number>   [default: []]
 *      apiType: 'ACPF' | 'GDS'  [default: undefined] - so that we could treat different APIs differently
 *      canResolve: true,        [default: false] - to decide whether we should resolve or reject promise
 *                                                 (irrespective of error handler reactions).
 *      redirectTo: 'route/to/location',
 *      customErrorKey: 'someIdenfitierKey',
 *    }
 *
 * @param store
 * @param store.dispatch
 * @param store.getState
 * @return {function(*): function(*=): *}
 */
export const errorHandlerMiddleware = store => next => (action) => {
  const { dispatch, getState } = store;

  if (typeof action === 'function') {
    return action(dispatch, getState);
  }

  const state = getState();
  const { error, errorHandler = {}, ...rest } = action;
  const isErrHandlerConfigured = Object.keys(errorHandler).length > 0;

  // only execute Middleware code if there is an error
  if (error) {
    const { resultCode, code, cartDtlList, statusCode, method, endpoint, response } = error;
    const pathname = getRoutingPathName(state);
    const search = getRoutingSearch(state);

    if (
      (statusCode === 400 || statusCode === 401) &&
      (/member\/v1\/info\.json/.test(endpoint)) ||
      isErrHandlerConfigured && errorHandler.isBlueGateError
    ) {
      const actionPrefix = errorHandler.isBlueGateError
        ? ['account', 'checkout'].find(route => pathname.includes(route))
        : '';

      trackError(error, actionPrefix);
    }

    if (
      code === 103 ||
      // If any GDS API returns HTTP 401 and resultCode not in the nonLoginGDSErrorCodes list
      // 401 in case of ACPF registration errors need not be redirected to login. No resultcodes for the errors, so used customErrorKey
      (!nonLoginGDSErrorCodes.includes(resultCode) && statusCode === 401 && errorHandler.customErrorKey !== 'registerUserAddress')
    ) {
      // Token is expired or invalid,
      // hence redirect to account platform to get a new token.
      return next(forceLogin(`${pathname}${search}`));
    }

    // skip middleware if 'errorHandler' is not configured
    if (isErrHandlerConfigured) {
      const {
        redirectTo,
        customErrorKey,
        apiType,
        canResolve = false,
        showMessage = false,
        enableReaction = false,
        skipErrorCodes = [],
      } = errorHandler;
      const apiBrand = getBrandFromAPIEndpoint(error.endpoint);
      const isUnknownError = statusCode === 0 || statusCode === 422;
      const isServerError = statusCode >= 500;
      const isACPFValidationError = code === 'validation_failed';
      const isGDSValidationError = resultCode === '1001' && error.dtlList;
      const isValidResultCode = !skipErrorCodes.includes(~~resultCode);

      // If error has a GDS result code or HTTP 5xx
      if (isValidResultCode || isServerError || isACPFValidationError || isGDSValidationError || isUnknownError) {
        const { pageErrors } = state.errorHandler;
        const apiMethod = parseMethod(method, endpoint, apiType);
        const applePaySession = getInstanceOfApplePaySession();
        const { getReaction, getMessage } = new ErrorReactor(store, action, apiMethod, applePaySession);
        let errCode = resultCode;

        // No resultcodes for ACPF registration errors. Error handling based on status codes.
        if (customErrorKey === 'registerUserAddress' && [401, 409, 422].includes(statusCode)) {
          errCode = statusCode;
        } else if (isServerError) {
          if (['applePayPIB', 'applePayOrder'].includes(customErrorKey)
          && ((resultCode === '2002' && statusCode === 503)
          || (resultCode === '2001' && statusCode === 500))
          ) {
            errCode = resultCode;
          } else {
            errCode = '5xx';
          }
        } else if (isUnknownError) {
          errCode = statusCode;
        } else if (isACPFValidationError) {
          errCode = error.errors && error.errors.length && error.errors[0].code;
        }

        const errorCodeReactions = getReaction()[errCode];
        const errorCodeMessages = getMessage()[errCode];
        const reaction = enableReaction && errorCodeReactions && (
          errorCodeReactions.hasOwnProperty(apiMethod)
          ? errorCodeReactions[apiMethod]
          : errorCodeReactions.DEFAULT
        );
        let message = showMessage && errorCodeMessages && (
          errorCodeMessages.hasOwnProperty(apiMethod)
          ? errorCodeMessages[apiMethod]
          : errorCodeMessages.DEFAULT
        );
        let pushMessageAction = {};
        let pushDetailedMessageAction = {};
        let resetDetailedErrorMessagesAction = {};

        // Special cases when GDS API returns detailed error
        if (cartDtlList) {
          resetDetailedErrorMessagesAction = resetDetailedErrorMessages(['cartItems']);
          const count = cartDtlList.length > 1 ? 'MANY' : 'SINGLE';

          message = errorCodeMessages.hasOwnProperty(count) ? errorCodeMessages[count] : message;
          // error corresponding to each cart item with l2Code
          pushDetailedMessageAction = pushDetailedErrorMessage(
            getDetailedErrorMessages(cartDtlList, 'cartItems', getMessage, apiMethod),
            'cartItems'
          );

          next(updateItemsInventoryStatus(apiBrand, cartDtlList));
        }

        if (response && response.error_list) {
          resetDetailedErrorMessagesAction = resetDetailedErrorMessages(['giftCards']);
          // error corresponding to each gift card applied with giftcard number
          pushDetailedMessageAction = pushDetailedErrorMessage(
            getDetailedErrorMessages(response.error_list, 'giftCards', getMessage, apiMethod),
            'giftCards'
          );
        }

        if (isGDSValidationError) {
          if (error.dtlList && error.dtlList.some(item => item.detailCode === 'coupon_id')) {
            message = errorCodeMessages.HALF_SIZE_COUPON || message;
          }

          resetDetailedErrorMessagesAction = resetDetailedErrorMessages(['formValidation']);
          pushDetailedMessageAction = pushDetailedErrorMessage(
            getDetailedErrorMessages(error.dtlList, 'gdsValidation', getMessage, apiMethod),
            'formValidation',
            { isGDSValidationError }
          );
        }

        if (isACPFValidationError) {
          if (errCode === 'out_of_range') {
            message = error.errors && error.errors.length && error.errors[0].message;
          } else {
            resetDetailedErrorMessagesAction = resetDetailedErrorMessages(['formValidation']);
            pushDetailedMessageAction = pushDetailedErrorMessage(
              getDetailedErrorMessages(error.errors, 'acpfValidation'),
              'formValidation',
              { isACPFValidationError },
            );
          }
        }

        if (resetDetailedErrorMessagesAction.type) next(resetDetailedErrorMessagesAction);
        if (pushDetailedMessageAction.type) next(pushDetailedMessageAction);

        if (typeof message === 'string') {
          if (customErrorKey) {
            pushMessageAction = pushAPIErrorMessage(message, customErrorKey);
            // don't push the same message
          } else if (!pageErrors.includes(message)) {
            pushMessageAction = pushAPIErrorMessage(message);
          }
        }

        if (typeof reaction === 'function') {
          const promise = reaction();

          if (promise && promise.then) {
            promise
              .then(() => next({ ...rest, redirect: { location: redirectTo } }))
              // push message only after reaction has completed
              .then(() => pushMessageAction.type && next(pushMessageAction));
          } else if (pushMessageAction.type) {
            // reaction did not return a promise, push message in sync
            next(pushMessageAction);
          }

          // 'canResolve' decides whether to resolve or reject the API promise.
          // This is would be useful if we want to decide whether to exit the promise
          // chain or proceed even if the API error was solved by the reaction.
          return canResolve ? promise : Promise.reject();
        }

        // there were no reactions, should push the message now
        if (pushMessageAction.type) {
          next(pushMessageAction);
        }

        return next({ ...rest, response: error.response, redirect: { location: redirectTo } });
      }
    }
  }

  // If errorHandler was configured (with a 'customErrorKey') and there were NO error for the
  // same API this time but state has an error message from a previous time, then remove it.
  if (isErrHandlerConfigured) {
    const { customErrorKey } = errorHandler;

    if (state.errorHandler.customErrors[customErrorKey]) {
      next(popAPIErrorMessage(customErrorKey, true));
    }
  }

  // configuration for errorHandlerMiddleware was not found
  // OR error handler was configured but there was no error
  // OR we couln't handle the error
  return next(action);
};
