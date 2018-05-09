import React, { PureComponent, PropTypes } from 'react';
import { mergeClasses } from '../../helpers/utils/stylePropable';
import stylePropsParser from '../../helpers/utils/stylePropParser';
import styles from './Grid.scss';

const { string, any, func } = PropTypes;

export default class Grid extends PureComponent {

  static propTypes = {
    className: string,
    childrenWrapperClass: string,
    verticalSpacing: string,
    horizontalSpacing: string,
    children: any,
    maxCols: any,
    cellHeight: any,
    onClick: func,
  };

  render() {
    const {
      verticalSpacing,
      horizontalSpacing,
      children,
      className,
      childrenWrapperClass,
       onClick,
    } = this.props;

    const wrappedChildren = React.Children.map(children, (currentChild, index) => {
      const verticalGutter = verticalSpacing ? `${verticalSpacing}VPadding` : '';
      const horizontalGutter = horizontalSpacing ? `${horizontalSpacing}HPadding` : '';
      const colSpan = currentChild.props.colSpan ? currentChild.props.colSpan : 1;
      const cellSpan = `colSpan${colSpan}`;
      const parentClassName = mergeClasses(styles.item, styles.noTopMargin, styles[cellSpan],
               styles[verticalGutter], styles[horizontalGutter], stylePropsParser(childrenWrapperClass, styles));

      return <div className={parentClassName} key={index}>{currentChild}</div>;
    });

    return (
      <div className={mergeClasses(styles.grid, stylePropsParser(className, styles))} onClick={onClick}>
        {wrappedChildren}
      </div>
    );
  }
}
