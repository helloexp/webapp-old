import React, { PureComponent, PropTypes } from 'react';
import cx from 'classnames';
import uniqueId from 'utils/uniqueId';
import { trackEvent } from 'utils/gtm';
import styles from './styles.scss';

const { func, bool, string } = PropTypes;

export default class Radio extends PureComponent {
  static propTypes = {
    value: string,
    onChange: func,
    checked: bool,
    disabled: bool,
    name: string,
    id: string,
    className: string,

    // GTM props
    analyticsOn: string,
    analyticsLabel: string,
    analyticsCategory: string,
  };

  static defaultProps = {
    get id() {
      return uniqueId('radio_');
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
      className,
      analyticsOn,
      analyticsLabel,
      analyticsCategory,
      ...rest
    } = this.props;

    const analyticsAttrs = {
      'analytics-on': analyticsOn,
      'analytics-label': analyticsLabel,
      'analytics-category': analyticsCategory,
    };

    return (
      <label
        className={cx(styles.label, {
          [styles.checked]: this.props.checked,
          [styles.disabled]: this.props.disabled,
          [className]: className,
        })}
        htmlFor={id}
      >
        <input
          type="radio"
          className={styles.input}
          onChange={this.handleChange}
          id={id}
          {...rest}
          {...analyticsAttrs}
        />
      </label>
    );
  }
}
