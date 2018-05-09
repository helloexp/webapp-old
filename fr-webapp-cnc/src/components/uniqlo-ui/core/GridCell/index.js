import React, { PureComponent, PropTypes } from 'react';
import noop from 'utils/noop';
import { mergeClasses } from '../../helpers/utils/stylePropable';
import styles from './GridCell.scss';
import stylePropsParser from '../../helpers/utils/stylePropParser';

const {
  node,
  number,
  string,
  object,
  oneOfType,
  oneOf,
  bool,
  func,
} = PropTypes;

export default class GridCell extends PureComponent {

  static propTypes = {
    children: node,
    rowSpan: number,
    colSpan: number,
    className: string,
    clickHandler: func,
    rootClass: oneOfType([
      string,
      object,
    ]),
    contentAlign: oneOf([
      'center',
      'left',
      'right',
    ]),
    verticalPadding: oneOf([
      'xxs',
      'xs',
      's',
      'sm',
      'm',
      'sl',
      'l',
    ]),
    horizontalPadding: oneOf([
      'xxs',
      'xs',
      's',
      'm',
      'l',
    ]),
    centerContentVertically: bool,
    backgroundColor: string,
  };

  static contextTypes = {
    compConfig: object,
  };

  static defaultProps = {
    contentAlign: 'center',
    clickHandler: noop,
    centerContentVertically: false,
  };

  handleClick = () => {
    this.props.clickHandler();
  };

  render() {
    const {
      children,
      rootClass,
      className,
      contentAlign,
      centerContentVertically,
      colSpan,
      } = this.props;

    let classArgs = [stylePropsParser(className, styles), styles.gridCell, stylePropsParser(contentAlign, styles)];

    if (centerContentVertically) {
      classArgs = [...classArgs, styles.verticallyCenter];
    }

    const RootTag = rootClass || 'div';

    return (
      <RootTag
        className={mergeClasses(...classArgs)}
        colSpan={colSpan}
        onClick={this.handleClick}
      >
        {children}
      </RootTag>
    );
  }
}
