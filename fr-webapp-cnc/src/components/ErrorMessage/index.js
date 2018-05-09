import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import { popAPIErrorMessage } from 'redux/modules/errorHandler';
import scrollToTop from 'utils/scroll';
import styles from './styles.scss';

const { func, string, number, oneOf, bool, oneOfType } = PropTypes;

@connect(
  null,
  { removeErrorMessage: popAPIErrorMessage }
)
export default class ErrorMessage extends Component {
  static propTypes = {
    message: string,
    type: oneOf(['warning', 'error']),
    rootClassName: string,
    showCloseButton: bool,
    removeErrorMessage: func,
    scrollUpOnError: bool,
    /**
     * Based on this, errorHandler reducer will update pageErrors/customErrors.
     */
    isCustomError: bool,
    /**
     * will accept one of these:
     *  number - index of msg in state.errorHandler.pageErrors
     *  string - customErrorKey in state.errorHandler.customErrors
     */
    errorIdentifier: oneOfType([string, number]),

    // GTM props
    analyticsOn: string,
    analyticsLabel: string,
    analyticsValue: string,
    analyticsCategory: string,
  };

  static defaultProps = {
    type: 'error',
    isCustomError: false,
    showCloseButton: false,
  };

  static scrollToError(oldProps, newProps) {
    if (newProps.scrollUpOnError && oldProps.message !== newProps.message) {
      scrollToTop();
    }
  }

  componentWillMount() {
    this.constructor.scrollToError({}, this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.constructor.scrollToError(this.props, nextProps);
  }

  componentWillUnmount() {
    this.removeMessage();
  }

  removeMessage = () => {
    const { errorIdentifier, removeErrorMessage, isCustomError } = this.props;

    if (errorIdentifier) {
      removeErrorMessage(errorIdentifier, isCustomError);
    }
  };

  render() {
    const {
      message,
      type,
      showCloseButton,
      rootClassName,

      analyticsOn,
      analyticsLabel,
      analyticsValue,
      analyticsCategory,
    } = this.props;
    const closeButtonMarkup = showCloseButton && (
      <Button
        className={styles.closeButton}
        onTouchTap={this.removeMessage}
        analyticsOn={analyticsOn}
        analyticsLabel={analyticsLabel}
        analyticsValue={analyticsValue}
        analyticsCategory={analyticsCategory}
      />
    );

    return (
      <div className={`${styles.errorMessage} ${styles[rootClassName]}`}>
        {closeButtonMarkup}
        <Text className={styles[`${type}Text`]}>
          {message}
        </Text>
      </div>
    );
  }
}
