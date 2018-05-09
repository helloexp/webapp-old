import React, { PropTypes, PureComponent } from 'react';
import { mergeClasses, mergeStyles } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser';
import styles from './SvgIcons.scss';

const { node, string, func, object } = PropTypes;

export default class SvgIcon extends PureComponent {
  static propTypes = {
    children: node,
    color: string,
    hoverColor: string,
    onMouseEnter: func,
    onMouseLeave: func,
    onClick: func,
    className: string,
    /**
     * Allows you to redifine what the coordinates
     * without units mean inside an svg element. For example,
     * if the SVG element is 500(width) by 200(height), and you
     * pass viewBox="0 0 50 20", this means that the coordinates inside
     * the svg will go from the top left corner (0,0) to bottom right (50,20)
     * and each unit will be worth 10px.
     */
    viewBox: string,
    style: object,
    stroke: string,
  };

  static defaultProps = {
    onMouseEnter: () => null,
    onMouseLeave: () => null,
    onClick: () => null,
    viewBox: '0 0 24 24',
    className: '',
  };

  state = {
    hovered: false,
  };

  handleMouseLeave(event) {
    this.setState({ hovered: false });
    this.props.onMouseLeave(event);
  }

  handleMouseEnter(event) {
    this.setState({ hovered: true });
    this.props.onMouseEnter(event);
  }

  handleClick = (event) => {
    this.props.onClick(event);
  };

  render() {
    const {
      children,
      color,
      hoverColor,
      onClick,
      viewBox,
      className,
      style,
      stroke,
      ...other
    } = this.props;
    const { hovered } = this.state;
    const onColor = hoverColor || color;
    const iconstatus = { };

    if (color) {
      iconstatus.fill = color;
      iconstatus.stroke = stroke || color;
    }

    if (hovered && onColor) {
      iconstatus.fill = onColor;
      iconstatus.stroke = stroke || onColor;
    }

    const mergedStyles = mergeStyles(style, iconstatus);
    let events = hoverColor ? {
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
    } : {};

    events = onClick ? { ...events, onClick: this.handleClick } : { ...events };

    const classNames = mergeClasses(styles.svgIcon, stylePropsParser(className, styles));

    return (
      <svg className={classNames} style={mergedStyles} viewBox={viewBox} {...other} {...events} >
        {children}
      </svg>
    );
  }
}
