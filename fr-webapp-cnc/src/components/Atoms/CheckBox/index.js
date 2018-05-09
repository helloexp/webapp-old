import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames/bind';
import uniqueId from 'utils/uniqueId';
import { trackEvent } from 'utils/gtm';
import styles from './styles.scss';

const cx = classNames.bind(styles);
const { bool, string, func } = PropTypes;

/**
 * Controlled checkbox component
 */
export default class CheckBox extends PureComponent {
  static propTypes = {
    checked: bool.isRequired,
    disabled: bool,
    label: string,
    onChange: func.isRequired,
    className: string,
    id: string,

    // GTM props
    analyticsOn: string,
    analyticsLabel: string,
    analyticsCategory: string,
  };

  static defaultProps = {
    get id() {
      return uniqueId('checkbox_');
    },
  };

  handleChange = (event) => {
    const newCheckedState = !this.props.checked;

    this.props.onChange(event);

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
  };

  render() {
    const {
      id,
      checked,
      disabled,
      className,
      label,

      analyticsOn,
      analyticsLabel,
      analyticsCategory,
    } = this.props;

    const analyticsAttrs = {
      'analytics-on': analyticsOn,
      'analytics-label': analyticsLabel,
      'analytics-category': analyticsCategory,
    };

    const labelClassNames = cx('label', className, {
      checked,
      disabled,
    });

    return (
      <label className={labelClassNames} htmlFor={id}>
        <input
          type="checkbox"
          className={styles.input}
          id={id}
          value={checked}
          disabled={disabled}
          onChange={this.handleChange}
          {...analyticsAttrs}
        />
        {label ? <span>{label}</span> : null}
      </label>
    );
  }
}
