import React, { PureComponent, PropTypes } from 'react';
import { mergeClasses } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser.js';
import Icon from '../core/Icon';
import styles from './Text.scss';

const { string, object, func, node, oneOfType } = PropTypes;

export default class Text extends PureComponent {
  static displayName = 'Text';

  static propTypes = {
    children: node,
    className: string,
    iconButton: string,
    /**
     * onPress props for triggers the click event
     */
    onPress: func,
    /**
     * Override the inline-styles of the root element.
     */
    style: object,
    content: oneOfType([node, string]),
  };

  handleOnPress = (event) => {
    if (this.props.onPress) this.props.onPress(event);
  };

  render() {
    const {
      className,
      content,
      style,
      iconButton,
      children,
    } = this.props;

    const classNames = {
      container: mergeClasses(styles.text, stylePropsParser(className, styles), 'txt'),
    };

    return (
      <div
        className={classNames.container}
        onClick={this.handleOnPress}
        style={style}
      >
        {iconButton
          ? <Icon className="text" name={iconButton} />
          : null}
        {content || children}
      </div>
    );
  }
}
