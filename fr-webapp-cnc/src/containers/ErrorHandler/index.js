import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import scrollToTop from 'utils/scroll';
import { getCustomErrors, getDetailedErrors } from 'redux/modules/errorHandler/selectors';
import {
  checkErrorMessage,
  resetAPICustomErrorMessages,
  resetErrorRedirectStatus,
  resetDetailedErrorMessages,
  popDetailedErrorMessage,
  resetScrollUpFlag,
} from 'redux/modules/errorHandler';

const { func, object, string, bool } = PropTypes;

function getRelevantErrors(errorKeys, errors) {
  return errorKeys.reduce((acc, key) => ({ ...acc, [key]: errors[key] }), {});
}

/**
 * HOC that enhances components to make them capable of listening to error messages

 * @export
 * @param {Class|Function}  Component - React component original definition
 * @param {Object}  customErrorKeys - custom error message keys to which the component should listen to
 * @returns {Class} ErrorHandler wrapped component
 */
export default function ErrorHandlerWrapper(errorKeys = [], errorType = 'customErrors') {
  return Component => @connect((state) => {
    const { isErrorRedirected, isGDSValidationError, isACPFValidationError, scrollUp } = state.errorHandler;
    let errorProps = { isErrorRedirected, isGDSValidationError, isACPFValidationError, scrollUp };
    let relevantErrors = {};

    if (errorType === 'customErrors') {
      relevantErrors = getRelevantErrors(errorKeys, getCustomErrors(state));
      errorProps = {
        ...errorProps,
        [errorType]: relevantErrors,
        error: checkErrorMessage(relevantErrors) || '',
      };
    } else if (errorType === 'detailedErrors') {
      relevantErrors = getRelevantErrors(errorKeys, getDetailedErrors(state));
      errorProps = { ...errorProps, [errorType]: relevantErrors };
    }

    return errorProps;
  }, {
    removeErrorMessages: resetAPICustomErrorMessages,
    removeDetailedErrorMessages: resetDetailedErrorMessages,
    removeSingleFieldErrorMessage: popDetailedErrorMessage,
    resetErrRedirectFlag: resetErrorRedirectStatus,
    resetScrollToTopUpFlag: resetScrollUpFlag,
  })
  class ErrorHandledComponent extends PureComponent {
    static propTypes = {
      removeErrorMessages: func,
      resetErrRedirectFlag: func,
      removeDetailedErrorMessages: func,
      removeSingleFieldErrorMessage: func,
      customErrors: object,
      error: string,
      isErrorRedirected: bool,
      scrollUp: bool,
      resetScrollToTopUpFlag: func,
    }

    componentWillMount() {
      const { resetErrRedirectFlag, isErrorRedirected } = this.props;

      if (isErrorRedirected) {
        resetErrRedirectFlag();
      }

      this.additionalProps = errorType === 'detailedErrors'
        ? { removeSingleFieldErrorMessage: this.removeSingleFieldErrorMessage }
        : {};
    }

    componentDidMount() {
      const { scrollUp, resetScrollToTopUpFlag } = this.props;

      if (scrollUp) {
        scrollToTop();
        resetScrollToTopUpFlag();
      }
    }

    componentWillUnmount() {
      const { removeErrorMessages, customErrors, isErrorRedirected, resetErrRedirectFlag, removeDetailedErrorMessages } = this.props;

      if (isErrorRedirected) {
        resetErrRedirectFlag();

      // If we are not redirecting, pop all connected error messages(if at all needed)
      } else if (errorType === 'customErrors' && checkErrorMessage(customErrors)) {
        removeErrorMessages(customErrors);
      } else if (errorType === 'detailedErrors') {
        removeDetailedErrorMessages(errorKeys);
      }
    }

    removeSingleFieldErrorMessage = (errorKey, fieldName) => {
      this.props.removeSingleFieldErrorMessage(errorKey, fieldName);
    }

    render() {
      return <Component {...this.props} {...this.additionalProps} />;
    }
  };
}
