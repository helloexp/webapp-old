import React, { PureComponent, PropTypes } from 'react';
import cx from 'classnames';

import styles from './styles.scss';

const { string, node, oneOf, bool } = PropTypes;

const types = {
  default: 'default',
  primary: 'primary',
  secondary: 'secondary',
  link: 'link',
  close: 'close',
  edit: 'edit',
  arrowRight: 'arrowRight',
  flat: 'flat',
};

/**
 * HOC to extend Button and Link components with same features:
 * - static property "type"
 * - extended className prop
 * - extended children prop
 * @param WrappedComponent
 * @return {{propTypes, type}}
 * @constructor
 */
export default function ClickHOC(WrappedComponent) {
  return class extends PureComponent {
    static propTypes = {
      children: node,
      className: string,
      type: oneOf(Object.keys(types)),
      disabled: bool,
    };

    static defaultProps = {
      disabled: false,
    };

    static type = types;

    render() {
      const { children, type, disabled } = this.props;

      const extendedClassNames = cx({
        [styles[type]]: this.constructor.type.hasOwnProperty(type),
        [styles.isDisabled]: disabled,
      }, this.props.className);

      const props = {
        ...this.props,
        className: extendedClassNames,
      };

      return (
        <WrappedComponent {...props}>
          { type === this.constructor.type.close ? '×' : children }
        </WrappedComponent>
      );
    }
  };
}
