import React, { PureComponent, PropTypes } from 'react';
import { trackEvent } from 'utils/gtm';
import { requestAnimationFrame } from 'utils/animationFrame';
import validation from 'components/uniqlo-ui/core/Validation';
import InputLabel from 'components/Atoms/InputLabel';
import InputUnderline from 'components/Atoms/InputUnderline';
import cx from 'classnames';
import styles from './styles.scss';

const { arrayOf, shape, oneOfType, bool, string, number, func } = PropTypes;

/**
 * Controlled select component
 * @todo Return value instead change event (refactor on Validation HOC needed first)
 */
@validation
export default class Select extends PureComponent {
  static propTypes = {
    values: arrayOf(
      oneOfType([
        shape({
          label: oneOfType([string, number]).isRequired,
          value: oneOfType([string, number]).isRequired,
        }).isRequired,
        string.isRequired,
        number.isRequired,
      ])
    ).isRequired,
    value: oneOfType([string, number]).isRequired,
    onChange: func.isRequired,
    onFocus: func,
    onBlur: func,
    label: string,
    disabled: bool,
    id: string,
    className: string,
    name: string,
    required: bool,
    emptyOption: bool,
    singleOption: bool,
    inputStyle: string,
    /** Comes from @validation */
    isValid: bool,

    // GTM props
    analyticsOn: string,
    analyticsLabel: string,
    analyticsCategory: string,
  };

  static defaultProps = {
    isValid: true,
  };

  state = {
    focus: false,
  };

  componentWillReceiveProps(nextProps) {
    const {
      analyticsOn,
      analyticsLabel,
      analyticsCategory,
      value,
    } = this.props;

    if (value !== nextProps.value && analyticsOn) {
      requestAnimationFrame(() => {
        trackEvent({
          action: analyticsOn,
          label: analyticsLabel,
          value: nextProps.value,
          category: analyticsCategory,
        });
      });
    }
  }

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

  getOptions = (emptyOption) => {
    const options = [];

    if (emptyOption) {
      options.push(<option value="" key="-1" />);
    }

    return options.concat(this.props.values.map((optionValue, idx) => {
      const { value, label } = typeof optionValue === 'object'
        ? optionValue
        : { value: optionValue, label: optionValue };

      return <option value={value} key={idx}>{label}</option>;
    }));
  };

  render() {
    const {
      label,
      className,
      value,
      disabled,
      id,
      name,
      required,
      emptyOption,
      isValid,
      singleOption,
      onChange,
      inputStyle,

      analyticsOn,
      analyticsLabel,
      analyticsCategory,
    } = this.props;

    const analyticsAttrs = {
      'analytics-on': analyticsOn,
      'analytics-label': analyticsLabel,
      'analytics-category': analyticsCategory,
    };

    const isEmpty = value === '';
    const isActive = this.state.focus || !isEmpty;

    return (
      <div className={cx(styles.wrapper, className)}>
        <InputLabel
          star={required}
          className={cx(styles.label, { [styles.inactive]: !isActive })}
          htmlFor={id}
          focus={this.state.focus}
          invalid={!isValid}
        >{label}</InputLabel>
        <div className={cx(inputStyle, styles.selectWrapper, { [styles.singleOption]: singleOption })}>
          <select
            className={styles.select}
            value={value}
            onChange={onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            disabled={singleOption || disabled}
            id={id}
            name={name}
            required={required}
            {...analyticsAttrs}
          >
            { this.getOptions(emptyOption) }
          </select>
        </div>
        <InputUnderline focus={this.state.focus} invalid={!isValid} />
      </div>
    );
  }
}
