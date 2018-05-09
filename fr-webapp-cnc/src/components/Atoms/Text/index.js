import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from './styles.scss';

const cx = classNames.bind(styles);
const { string, number, node, oneOf } = PropTypes;

const types = {
  default: 'default',
  inline: 'inline',
  paragraph: 'paragraph',
};

export default class Text extends PureComponent {
  static propTypes = {
    children: node,
    className: string,
    type: oneOf(Object.keys(types)),
    weight: oneOf(['bolder', 'lighter']),
    size: number,
  };

  static defaultProps = {
    size: 0,
  };

  static type = types;

  render() {
    const { children, weight, size, type } = this.props;

    const className = cx('base', 'txt', {
      bolder: weight === 'bolder',
      lighter: weight === 'lighter',
      [`plus${size}`]: size > 0,
      [`minus${-size}`]: size < 0,
      [type]: this.constructor.type.hasOwnProperty(type),
    }, this.props.className);

    const Component = type === this.constructor.type.inline ? 'span' : 'div';

    return (
      <Component className={className}>{children}</Component>
    );
  }
}
