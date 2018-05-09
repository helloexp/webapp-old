import React, { PureComponent, PropTypes } from 'react';
import cx from 'classnames';
import styles from './styles.scss';

const { any, bool, string } = PropTypes;

export default class InputLabel extends PureComponent {
  static propTypes = {
    star: bool,
    htmlFor: string,
    className: string,
    focus: bool,
    invalid: bool,
    children: any,
  };

  static defaultProps = {
    star: false,
    htmlFor: null,
    className: '',
    focus: false,
    invalid: false,
  };

  render() {
    const { star, htmlFor, className, focus, invalid, children } = this.props;

    if (!children) {
      return null;
    }

    return (
      <label
        className={cx(styles.label, {
          [styles.star]: star,
          [styles.focus]: focus && !invalid,
          [styles.invalid]: invalid,
        }, className)}
        htmlFor={htmlFor}
      >{children}</label>
    );
  }
}
