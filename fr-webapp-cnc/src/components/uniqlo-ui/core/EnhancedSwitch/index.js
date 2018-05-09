import React, { Component, PropTypes } from 'react';
import { trackEvent } from 'utils/gtm';
import cx from 'classnames';
import styles from './EnhancedSwitch.scss';

const { bool, func, string } = PropTypes;

export default class EnhancedSwitch extends Component {

  static propTypes = {
    defaultChecked: bool,
    changeByProps: bool,
    checked: bool,
    disabled: bool,
    inputType: string.isRequired,
    name: string,
    onSwitch: func,
    required: bool,
    value: string,
    spaRadio: bool,
    id: string,

    // GTM props
    analyticsOn: string,
    analyticsLabel: string,
    analyticsCategory: string,
  };

  static defaultProps = {
    onSwitch: () => null,
  };

  state = {
    checked: false,
  };

  componentWillMount = () => {
    this.setState({ checked: this.props.defaultChecked || this.props.checked });
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.hasOwnProperty('checked') && nextProps.checked !== this.state.checked) {
      this.setState({ checked: nextProps.checked });
    }
  };

  handleChange = (event) => {
    const {
      inputType,
      checked,
      onSwitch,
      changeByProps,
    } = this.props;

    onSwitch(event);

    const newCheckedState = !this.state.checked;

    const {
      analyticsOn,
      analyticsLabel,
      analyticsCategory,
    } = this.props;

    if (analyticsOn) {
      trackEvent({
        action: analyticsOn,
        label: analyticsLabel,
        value: newCheckedState,
        category: analyticsCategory,
      });
    }

    if (checked && inputType === 'checkbox' && !changeByProps) {
      this.setState({ checked: newCheckedState });
    }
  };

  render() {
    const {
      name,
      value,
      inputType,
      disabled,
      spaRadio,
      id,

      analyticsOn,
      analyticsLabel,
      analyticsCategory,
    } = this.props;

    const classNames = {
      check: cx(styles.check, disabled ? styles.disabledCheck : ''),
    };

    const inputProps = {
      name,
      value,
      disabled,
      type: inputType,
      className: styles.enhancedSwitch,
      onChange: this.handleChange,
      checked: this.state.checked,
    };

    const spaInputProps = {
      spaRadio,
      name,
      value,
      disabled,
      type: inputType,
      onChange: this.handleChange,
      checked: this.state.checked,
    };

    const analyticsAttrs = {
      'analytics-on': analyticsOn,
      'analytics-label': analyticsLabel,
      'analytics-category': analyticsCategory,
    };

    if (spaRadio) {
      return (
        <div className={styles.spaSwitch}>
          <input
            className={styles.radioInput}
            id={id}
            {...spaInputProps}
            {...analyticsAttrs}
          />
          <label className={styles.radioLabel} htmlFor={id} />
          <div className={classNames.check} />
        </div>
      );
    }

    return (
      <input
        id={id}
        {...inputProps}
        {...analyticsAttrs}
      />
    );
  }
}
