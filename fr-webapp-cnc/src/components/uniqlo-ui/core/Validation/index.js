import React, { Component, PropTypes } from 'react';
import noop from 'utils/noop';
import Tooltip from 'components/Atoms/Tooltip';
import styles from './styles.scss';
import validator from './Validator';

const { func, array, string, oneOfType, number, bool } = PropTypes;

/**
 * Adds {Boolean} isValid param to OriginalComponent
 * @param OriginalComponent
 */
export default OriginalComponent => class Validation extends Component {

  static propTypes = {
    onChange: func,
    onFocus: func,
    onBlur: func,
    validations: array,
    value: oneOfType([string, number]),
    isValid: bool,
    toolTipClass: string,
    name: string,
  };

  static contextTypes = {
    registerInput: func,
    unRegisterInput: func,
    setErrorMessage: func,
  };

  static defaultProps = {
    isValid: true,
    onChange: noop,
    onFocus: noop,
    onBlur: noop,
  };

  state = {
    isValid: this.props.isValid,
    errorMessage: null,
    /**
     *  focus state in OriginalComponent
     * @type {Boolean}
     */
    focus: false,
  };

  isValidationRequired() {
    return Array.isArray(this.props.validations) && this.props.validations.length;
  }

  componentWillMount() {
    this.currentValue = this.props.value;

    if (this.isValidationRequired()) {
      this.setErrorMessage(this.props.name);
      (this.context.registerInput || noop)(this);
    }
  }

  componentWillUnmount() {
    if (this.isValidationRequired()) {
      this.setErrorMessage(this.props.name);
      (this.context.unRegisterInput || noop)(this);
    }
  }

  setErrorMessage(name, errorMessage = null) {
    if (this.context.setErrorMessage) {
      this.context.setErrorMessage(name, errorMessage);
    }
  }
  componentWillReceiveProps(nextProps) {
    const newState = {};

    if (typeof nextProps.value !== 'undefined') {
      this.currentValue = nextProps.value;
    }

    if (this.isValidationRequired() && this.props.isValid !== nextProps.isValid) {
      newState.isValid = nextProps.isValid;
    }

    if (Object.keys(newState).length > 0) {
      this.setState(newState);
    }
  }

  setValue(event) {
    const isEventPassed = event && event.nativeEvent instanceof Event;
    const value = event.target.value;

    if (isEventPassed) {
      // Persist the event since we will need this event outside this event loop.
      event.persist();
    }

    this.currentValue = value;
    this.isValid();
    this.props.onChange(isEventPassed ? event : undefined);
  }

  handleFocus = (event) => {
    const value = event.target.value;

    this.currentValue = value;
    this.props.onFocus(event);
    this.setState({ focus: true });
  };

  handleBlur = (event) => {
    const isEventPassed = event && event.nativeEvent instanceof Event;
    const value = event.target.value;

    if (isEventPassed) {
      // Persist the event since we will need this event outside this event loop.
      event.persist();
    }

    this.currentValue = value;
    this.isValid(value);
    this.setState({ focus: false });
    this.props.onBlur(event);
  };

  isValid() {
    let isValidInput = true;

    if (this.isValidationRequired()) {
      const requiredIndex = this.props.validations.findIndex(validation => validation.rule === 'required');

      if (!(requiredIndex === -1 && (this.currentValue === null || this.currentValue === undefined || this.currentValue === ''))) {
        isValidInput = this.isValidationRequired() && this.props.validations.every(this.validate, this);
      }
    }

    if (isValidInput === true) {
      this.setState({ isValid: true, errorMessage: null });
      this.setErrorMessage(this.props.name);
    }

    return isValidInput;
  }

  validate(validation) {
    const isValid = !validation.params ? validator[validation.rule](this.currentValue) : validator[validation.rule](this.currentValue, validation.params);

    if (isValid === false) {
      this.setState({ isValid, errorMessage: validation.errorMessage });
      this.setErrorMessage(this.props.name, validation.errorMessage);
    }

    return isValid;
  }

  getErrorMessage() {
    return this.errorMessage;
  }

  handleChange = (event) => {
    this.setValue(event);
  }

  showError(message) {
    this.setState({
      isValid: false,
      errorMessage: message || null,
    });
  }

  hideError = () => {
    this.setState({
      errorMessage: null,
    });
  };

  render() {
    const { validations, toolTipClass, ...restProps } = this.props; // eslint-disable-line no-unused-vars
    const { isValid, errorMessage, focus } = this.state;
    const hasValidations = this.isValidationRequired();

    if (hasValidations) {
      Object.assign(restProps, { isValid });
    }

    const errorToolTip = errorMessage && focus
      ? <Tooltip className={toolTipClass} type="error" onClick={this.hideError}>{errorMessage}</Tooltip>
      : null;
    const component = (<OriginalComponent
      {...restProps}
      onFocus={this.handleFocus}
      onBlur={this.handleBlur}
      onChange={this.handleChange}
    />);

    return (
      hasValidations
        ? <div className={styles.labelContainer}>{errorToolTip}{component}</div>
        : component
    );
  }
};
