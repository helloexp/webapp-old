import { accountApi } from 'config/api';
import {
  RESET_API_ERROR_MESSAGES,
  RESET_API_CUSTOM_ERROR_MESSAGES,
  RESET_API_PAGE_ERROR_MESSAGES,
  PUSH_API_ERROR_MESSAGE,
  POP_API_ERROR_MESSAGE,
  PUSH_DETAILED_ERROR_MESSAGE,
  RESET_DETAILED_ERROR_MESSAGES,
  POP_DETAILED_ERROR_MESSAGE,
  ERROR_REDIRECT,
  RESET_ERROR_REDIRECT,
  FAKE_ERROR_RESPONSE,
  FAKE_BLUEGATE_ERROR,
  RESET_INVENTORY_ERROR,
  RESET_SCROLL_UP_FLAG,
  initialState,
} from './constants';

/**
 * State reducers for storing error messages.
 * There will be two keys to store error messages in state:
 * 1. customErrors (Object)
 *      Developer can specify a 'customErrorKey' and can access
 *      the message customErrors['customErrorKey']
 * 2. pageErrors (Array)
 *      If no 'customErrorKey' is passed in config, error message
 *      will be treated as a common message to the whole page.
 * @param {Object} [state=initialState] current state of app
 * @param {Object} [action={}]  type and errorHandler params
 * @returns {Object} reduced state
 */
export function errorHandler(state = initialState, action = {}) {
  let newState = {};

  switch (action.type) {
    case RESET_API_ERROR_MESSAGES:
      return { ...state, ...initialState };

    case RESET_API_CUSTOM_ERROR_MESSAGES:
      const { specificCustomErrors } = action;

      if (specificCustomErrors) {
        const updatedCustomErrors = {};

        Object.keys(specificCustomErrors).forEach(key => (updatedCustomErrors[key] = ''));

        return { ...state, customErrors: { ...state.customErrors, ...updatedCustomErrors } };
      }

      return { ...state, customErrors: {} };

    case RESET_API_PAGE_ERROR_MESSAGES:
      return { ...state, pageErrors: [] };

    case PUSH_API_ERROR_MESSAGE:
      const { message, customErrorKey } = action.errorHandler;

      if (message) {
        if (customErrorKey && customErrorKey.length > 0) {
          const newCustomErrors = {};

          newCustomErrors[customErrorKey] = message;
          newState = { ...state, customErrors: { ...state.customErrors, ...newCustomErrors } };
        } else {
          newState = { ...state, pageErrors: [...state.pageErrors, message] };
        }
      } else {
        newState = state;
      }

      return newState;

    case POP_API_ERROR_MESSAGE:
      const { identifier, isCustomErrorKey } = action.errorHandler;

      if (isCustomErrorKey) {
        const newCustomErrors = { ...state.customErrors };

        delete newCustomErrors[identifier];
        newState = { ...state, customErrors: newCustomErrors };
      } else {
        const { pageErrors } = state;

        newState = {
          ...state,
          pageErrors: [
            ...pageErrors.slice(0, identifier),
            ...pageErrors.slice(identifier + 1),
          ],
        };
      }

      return newState;

    case PUSH_DETAILED_ERROR_MESSAGE:
      const { relatedKey, errorMessages, flags } = action.errorHandler;

      return {
        ...state,
        ...flags,
        detailedErrors: {
          ...state.detailedErrors,
          [relatedKey]: errorMessages,
        },
      };

    case RESET_DETAILED_ERROR_MESSAGES:
      const { relatedKeys = [] } = action.errorHandler;
      const newDetailedErrState = relatedKeys.reduce((acc, key) => ({ ...acc, [key]: {} }), {});

      return {
        ...state,
        isACPFValidationError: false,
        isGDSValidationError: false,
        detailedErrors: {
          ...state.detailedErrors,
          ...newDetailedErrState,
        },
      };

    case POP_DETAILED_ERROR_MESSAGE:
      const { errorKey, fieldName } = action.errorHandler;

      return {
        ...state,
        detailedErrors: {
          ...state.detailedErrors,
          [errorKey]: {
            ...state.detailedErrors[errorKey],
            [fieldName]: '',
          },
        },
      };

    case ERROR_REDIRECT:
      return {
        ...state,
        isErrorRedirected: !action.isReload,
        scrollUp: action.scrollUp,
      };

    case RESET_SCROLL_UP_FLAG:
      return {
        ...state,
        scrollUp: false,
      };

    case RESET_ERROR_REDIRECT:
      return {
        ...state,
        isErrorRedirected: false,
      };

    case RESET_INVENTORY_ERROR:
      return {
        ...state,
        inventoryError: [],
      };

    default:
      return state;
  }
}

/**
 * Reset all error messages to initial state
 * clean both pageErrors and customErrors
 * @returns {Object} action type
 */
export function resetAPIErrorMessages() {
  return { type: RESET_API_ERROR_MESSAGES };
}

/**
 * Cleans up all customErrors
 * @param {Object} specificCustomErrors - a set of custom errors to be reset
 * @returns {Object} action type
 */
export function resetAPICustomErrorMessages(specificCustomErrors) {
  return {
    type: RESET_API_CUSTOM_ERROR_MESSAGES,
    specificCustomErrors,
  };
}

/**
 * Cleans up all pageErrors
 * @returns {Object} action type
 */
export function resetAPIPageErrorMessages() {
  return { type: RESET_API_PAGE_ERROR_MESSAGES };
}

/**
 * Push an error message to state.
 * @param {String} message - message to be shown to the end user.
 * @param {String} customErrorKey - If 'customErrorKey' is specified, we add message
 * to a new key customErrors['customErrorKey']. Otherwise push the message to pageErrors.
 * @returns {Object} action params
 */
export function pushAPIErrorMessage(message, customErrorKey) {
  return {
    type: PUSH_API_ERROR_MESSAGE,
    errorHandler: { message, customErrorKey },
  };
}

/**
 * Pop an error message from the state.
 * @param {String|Number} identifier - Identifier can be index of error message in pageErrors
 * or it can be a 'customErrorKey' in customErrors.
 * @param {boolean} [isCustomErrorKey=false] - Determines whether to reduce customErrors or pageErrors
 * @returns {Object} action params
 */
export function popAPIErrorMessage(identifier, isCustomErrorKey = false) {
  return {
    type: POP_API_ERROR_MESSAGE,
    errorHandler: { identifier, isCustomErrorKey },
  };
}

/**
 * Push detailed error message object to state.
 * @param {Object} errorMessages
 * @param {String} relatedKey
 * @param {Object} flags
 * @returns {Object} action params
 */
export function pushDetailedErrorMessage(errorMessages, relatedKey, flags) {
  return {
    type: PUSH_DETAILED_ERROR_MESSAGE,
    errorHandler: { errorMessages, relatedKey, flags },
  };
}

/**
 * Remove specific detailed error message identified by errorKey and fieldName.
 * @param {String} relatedKey
 * @param {String} fieldName
 * @returns {Object} action params
 */
export function popDetailedErrorMessage(errorKey, fieldName) {
  return {
    type: POP_DETAILED_ERROR_MESSAGE,
    errorHandler: { errorKey, fieldName },
  };
}

/**
 * Remove all relevant detailed error message object from state.
 * @param {String} relatedKey
 * @returns {Object} action params
 */
export function resetDetailedErrorMessages(relatedKeys) {
  return {
    type: RESET_DETAILED_ERROR_MESSAGES,
    errorHandler: { relatedKeys },
  };
}

/**
 * Redirect using redirectMiddleware (to work even in server side)
 * @param {String} location - route to new location
 * @returns {Object} action params
 */
export function errorRedirect(location, isReload = false, scrollUp = false) {
  return {
    type: ERROR_REDIRECT,
    redirect: { location },
    isReload,
    scrollUp,
  };
}

/**
 * Reset isErrorRedirected flag
 */
export function resetErrorRedirectStatus() {
  return {
    type: RESET_ERROR_REDIRECT,
  };
}

/**
 * Reset `scrollUp` flag
 */
export function resetScrollUpFlag() {
  return {
    type: RESET_SCROLL_UP_FLAG,
  };
}

/**
 * Check if atleast of the keys has a value and return just message
 * or both message and key based on the parameter 'returnKeyAndMsg'
 * @param {Object} [errorMessages={}]
 * @param {Boolean} [returnKeyAndMsg=false]
 * @returns {String|Object} if returnKeyAndMsg is true, method will return
 * both key and message as an object; otherwise returns the message string
 */
export function checkErrorMessage(errorMessages = {}, returnKeyAndMsg = false) {
  for (const key of Object.keys(errorMessages)) {
    const message = errorMessages[key];

    if (message) {
      return returnKeyAndMsg ? { key: `${key}`, message } : message;
    }
  }

  return null;
}

/**
 * Fake a GET error response containing a GDS error code. This action is used
 * when redirecting back to SPA from bluegate, the error code comes in the query parameters.
 * @param {String} resultCode - The GDS error code
 * @returns {Object} action params
 */
export function fakeBlueGateError(resultCode) {
  return {
    type: FAKE_BLUEGATE_ERROR,
    error: {
      resultCode,
      method: 'get',
      endpoint: `${accountApi.gdsHost}/${accountApi.region}${accountApi.gdsAccess}`,
    },
    errorHandler: {
      showMessage: true,
      enableReaction: true,
      canResolve: true,
      customErrorKey: 'blueGateCreditCardError',
      isBlueGateError: true,
    },
  };
}

/**
 * An action to trigger errorHandlerMiddleware to do its job with mock error
 * @param {Object} error
 * @param {Object} errorHandler
 * @returns {Object} Redux action that triggers errorHandlerMiddleware
 */
export function fakeError({ error, errorHandler: errHConfig }) {
  return {
    type: FAKE_ERROR_RESPONSE,
    client: () => Promise.resolve(),
    errorHandler: { ...errHConfig, isFakeError: true },
    error,
  };
}

export function resetInventoryError() {
  return { type: RESET_INVENTORY_ERROR };
}
