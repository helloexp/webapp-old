import React, { Component, PropTypes } from 'react';

const { func } = PropTypes;

export default OriginalComponent => class FormValidator extends Component {

  static childContextTypes = {
    registerInput: func,
    unRegisterInput: func,
    validateForm: func,
    getErrorMessages: func,
    setErrorMessage: func,
  };

  componentWillMount() {
    this.inputs = {};
    this.errorMessages = {};
  }

  getChildContext() {
    return {
      registerInput: this.registerInput.bind(this),
      unRegisterInput: this.unRegisterInput.bind(this),
      validateForm: this.validateForm.bind(this),
      getErrorMessages: this.getErrorMessages.bind(this),
      setErrorMessage: this.setErrorMessage.bind(this),
    };
  }

  setErrorMessage(fieldId, errorMessage) {
    this.errorMessages[fieldId] = errorMessage;
  }

  getErrorMessages() {
    const errorMessages = [];

    Object.keys(this.errorMessages).forEach((name) => {
      const errorMessage = this.errorMessages[name];

      if (errorMessage) {
        errorMessages.push(errorMessage);
      }
    });

    return errorMessages;
  }

  registerInput(component) {
    if (component.props.validations && component.props.name && this.inputs) {
      this.inputs[component.props.name] = component;
    }
  }

  unRegisterInput(component) {
    if (component.props.validations && component.props.name) {
      delete this.inputs[component.props.name];
    }
  }

  validateForm() {
    const inputs = this.inputs;

    return Object.keys(inputs).every(name => inputs[name].isValid());
  }

  render() {
    return <OriginalComponent {...this.props} />;
  }
};
