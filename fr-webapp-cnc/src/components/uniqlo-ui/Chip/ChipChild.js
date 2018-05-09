import React, { PureComponent, PropTypes } from 'react';
import noop from 'utils/noop';
import { mergeClasses } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser.js';
import Text from '../Text';
import styles from './ChipChild.scss';

const { string, object, func, bool, number, oneOfType, array, any, node } = PropTypes;

export default class ChipChild extends PureComponent {

  static propTypes = {
    children: oneOfType([array, object, node]),
    className: string,
    clickCallBack: func,
    clicked: bool,
    largerImages: bool,
    allowDisabled: bool,
    headingContent: string,
    hoverCallBack: func,
    hoverOutCallBack: func,
    onMouseClick: func,
    onMouseEnter: func,
    onMouseLeave: func,
    onTouchTap: func,
    refId: number,
    toolTipData: string,
    enable: bool,
    imageContent: bool,
    callBackData: any,
  };

  static defaultProps = {
    onMouseClick: noop,
    onMouseEnter: noop,
    onMouseLeave: noop,
  };

  handleClick = (event) => {
    const { props } = this;

    if (!props.enable || props.allowDisabled) {
      props.clickCallBack(props.refId, event, props.callBackData);
      props.onMouseClick(event);
    }
  };

  handleHover = (event) => {
    const { props } = this;

    if (!props.enable || props.allowDisabled) {
      props.hoverCallBack(props.headingContent, event);
      props.onMouseEnter(event);
    }
  };

  handleMouseOut = (event) => {
    const { props } = this;

    if (!props.enable || props.allowDisabled) {
      props.hoverOutCallBack(event);
      props.onMouseLeave(event);
    }
  };

  render() {
    const {
      className,
      largerImages = false,
      children,
      toolTipData,
      enable,
      clicked,
      imageContent,
    } = this.props;

    const containerClassNames = mergeClasses(
      stylePropsParser(className, styles),
      styles.chipChild,
      styles.listItem,
      {
        [styles.imageContent]: imageContent,
        [styles.largerImages]: largerImages,
        [styles.selectedItem]: clicked,
        [styles.disabledItem]: enable,
      }
    );

    return (
      <li
        className={containerClassNames}
        onClick={this.handleClick}
        onMouseEnter={this.handleHover}
        onMouseLeave={this.handleMouseOut}
      >
        <div className={styles.children}>{children}</div>
        {toolTipData ? <Text className={styles.toolText}>{toolTipData}</Text> : null }
      </li>
    );
  }
}
