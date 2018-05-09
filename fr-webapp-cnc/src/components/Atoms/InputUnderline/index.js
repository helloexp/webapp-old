import React, { PureComponent, PropTypes } from 'react';
import cx from 'classnames';
import styles from './styles.scss';

const { bool, string } = PropTypes;

export default class InputUnderline extends PureComponent {
  static propTypes = {
    className: string,
    focus: bool,
    invalid: bool,
  };

  static defaultProps = {
    className: '',
    focus: false,
    invalid: false,
  };

  render() {
    const { focus, invalid, className } = this.props;

    return (
      <hr
        className={cx(styles.underline, {
          [styles.focus]: focus,
          [styles.invalid]: invalid,
        }, className)}
      />
    );
  }
}
