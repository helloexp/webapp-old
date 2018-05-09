import { createSelector } from 'reselect';

/**
 * Get the custom errors object from state
 */
export const getCustomErrors = state => state.errorHandler.customErrors;

/**
 * Get the detailed errors object from state
 */
export const getDetailedErrors = state => state.errorHandler.detailedErrors;

/**
 * Check if ACPF validation error has occured
 * @returns {Boolean}
 */
const isACPFValidationError = state => state.errorHandler.isACPFValidationError;

/**
 * Get the detailed form validation errors object from state
 * @returns {Object}
 */
export const getFormValidationErrors = createSelector(
  [getDetailedErrors],
  detailedErrors => detailedErrors.formValidation,
);

/**
 * Error prop from ErrorHandler HOC
 * @returns {String}
 */
const getApiError = (state, props) => props.error;

/**
 * Get error list object by giving more priority for ACPF errors
 * @returns {Object}
 */
export const getErrorList = createSelector(
  [isACPFValidationError, getFormValidationErrors, getApiError],
  (acpfValidationError, validationErrors, apiError) => (acpfValidationError ? validationErrors : { apiError })
);

/**
 * Show error list only if there are error keys
 * @returns {Boolean}
 */
export const shouldShowErrorList = createSelector([getErrorList], errors => !!(Object.keys(errors).length > 0 && Object.values(errors).filter(Boolean).length));
