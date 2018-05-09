import React, { PropTypes, PureComponent } from 'react';
import { mergeClasses } from '../../helpers/utils/stylePropable';
import stylePropsParser from '../../helpers/utils/stylePropParser.js';
import styles from './Container.scss';

const { any, func, string, bool } = PropTypes;

export default class Container extends PureComponent {
  static propTypes = {
    children: any,
    className: string,
    onClick: func,
    passOnProps: bool,
  };

  handleClick = (event) => {
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      event.stopPropagation();
      onClick();
    }
  };

  render() {
    const { children, className, passOnProps, ...rest } = this.props;
    const propClassName = stylePropsParser(className, styles) || className;

    /** if passOnProps is specified, children, className and onClick as well as passOnProps
     *  will NOT be passed down further along as they do not make sense for our current use cases
     *  nested passing on will not work either, only first level children will get the passed on props
     *  can be extended if necessary
     */

    return (
      <div className={mergeClasses(styles.container, propClassName)} onClick={this.handleClick} >
        { passOnProps
          ? React.Children.map(children, child => React.cloneElement(child, typeof child.type === 'function' ? { ...rest } : null))
          : children}
      </div>
    );
  }
}
