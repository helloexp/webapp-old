import React, { PropTypes, PureComponent } from 'react';
import { mergeClasses } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser.js';
import styles from './NavHead.scss';

const { oneOf, any, func, string } = PropTypes;

export default class NavHead extends PureComponent {

  static propTypes = {

    className: string,

    arrowClassName: string,

    // Direction of the arrow
    direction: oneOf(['up', 'down', 'right', 'left', 'none']),

    // Click callback
    onTouchTap: func,

    // Value associated with click
    value: any,
  };

  static defaultProps = {
    direction: 'right',
  };

  handleClick = () => {
    const { onTouchTap, value } = this.props;

    if (onTouchTap) {
      if (value) {
        onTouchTap(value);
      } else {
        onTouchTap();
      }
    }
  };

  render() {
    const _this = this;
    const {
      arrowClassName,
      className,
      direction,
    } = _this.props;
    const rootClasses = mergeClasses(styles.navHead, stylePropsParser(className, styles), styles[direction]);
    const arrowClasses = mergeClasses(styles.arrow, stylePropsParser(arrowClassName, styles));

    const renderedChildren = <div className={arrowClasses} />;

    return (
      <div className={rootClasses} onClick={_this.handleClick} >
        {renderedChildren}
      </div>
    );
  }
}
