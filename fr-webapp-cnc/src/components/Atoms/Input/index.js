import React, { PureComponent, PropTypes } from 'react';
import validation from 'components/uniqlo-ui/core/Validation';
import InputLabel from 'components/Atoms/InputLabel';
import InputUnderline from 'components/Atoms/InputUnderline';
import cx from 'classnames';
import styles from './styles.scss';

const { oneOfType, bool, string, number, func } = PropTypes;

/**
 * Controlled input component
 * @todo Return value instead change event (refactor on Validation HOC needed first)
 */
@validation
export default class Input extends PureComponent {
  static propTypes = {
    value: oneOfType([string, number]).isRequired,
    onChange: func.isRequired,
    onFocus: func,
    onBlur: func,
    label: string,
    type: string,
    unit: string,
    step: string,
    disabled: bool,
    id: string,
    className: string,
    placeholder: string,
    required: bool,
    toolTipClass: string,
    inputStyle: string,
    labelStyle: string,
    /** Comes from @validation */
    isValid: bool,
  };

  static defaultProps = {
    type: 'text',
    placeholder: '',
    isValid: true,
  };

  state = {
    focus: false,
  };

  onFocus = (event) => {
    const { onFocus } = this.props;

    if (onFocus) {
      onFocus(event);
    }

    this.setState({ focus: true });
  };

  onBlur = (event) => {
    const { onBlur } = this.props;

    if (onBlur) {
      onBlur(event);
    }

    this.setState({ focus: false });
  };

  render() {
    const {
      value,
      step,
      onChange,
      onFocus, // eslint-disable-line
      onBlur, // eslint-disable-line
      disabled,
      id,
      type,
      placeholder,
      className,
      required,
      unit,
      label,
      isValid,
      inputStyle,
      labelStyle,
      ...other
    } = this.props;
    const isEmpty = value === '';
    const isActive = this.state.focus || !isEmpty;

    return (
      <div className={cx(styles.wrapper, className)}>
        <InputLabel
          star={required}
          className={cx(styles.label, labelStyle, { [styles.inactive]: !isActive })}
          htmlFor={id}
          focus={this.state.focus}
          invalid={!isValid}
        >{label}</InputLabel>
        <div className={cx(inputStyle, styles.inputWrapper)}>
          <input
            {...{ step, value, onChange, disabled, id, type, placeholder, required }}
            className={cx(styles.input, { [styles.notEmpty]: !isEmpty })}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            {...other}
          />
          <span className={cx(styles.unit, { [styles.active]: isActive })}>{unit}</span>
        </div>
        <InputUnderline focus={this.state.focus} invalid={!isValid} />
      </div>
    );
  }
}
