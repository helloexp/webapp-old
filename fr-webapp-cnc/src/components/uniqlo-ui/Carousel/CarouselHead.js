import React, { PropTypes, PureComponent } from 'react';
import { mergeClasses, mergeStyles } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser';
import styles from './CarouselHead.scss';

const { node, object, number, func, string } = PropTypes;

export default class CarouselHead extends PureComponent {

  static propTypes = {
    // Childen nodes
    children: node,

    className: string,

    // Styfuncrent selected head
    current: number,

    // Total heads available
    headCount: number,

    // Event to be triggered on selecting the tab head
    onTouchTap: func,

    style: object,
    highlightStyle: object,
  };

  state = {
    highlight: 0,
  };

  // to update theme inside state whenever a new theme is passed down
  // from the parent / owner using context
  componentWillReceiveProps(nextprops) {
    const { current } = this.props;

    if (nextprops.current !== undefined && nextprops.current !== current) {
      this.setState({ highlight: nextprops.current });
    }
  }

  handleClick = (item) => {
    try {
      const newitem = parseInt(item, 10);

      this.props.onTouchTap(newitem);
    } catch (err) {
      // Any error handling
    }
  };

  render() {
    const {
      children,
      className,
      headCount,
      style,
      highlightStyle,
    } = this.props;
    const { highlight } = this.state;

    const rootClasses = mergeClasses(
      styles.carouselHead,
      stylePropsParser(className, styles)
    );

    let itemStyle;
    let renderedChildren;
    let wrapperStyles = style;
    const availHead = React.Children.count(children);

    if (availHead) {
      const headWidth = (100 / availHead) - 0.3;

      wrapperStyles = mergeStyles(wrapperStyles, {
        width: `${headWidth}%`,
      });
      renderedChildren = React.Children.map(children, (child, index) => {
        const itemClassname = mergeClasses(
          styles.wrapper,
          highlight === index ? styles.highlightBasic : ''
        );

        itemStyle = mergeStyles(
          wrapperStyles,
          highlight === index ? highlightStyle : {}
        );

        return (
          <div className={itemClassname} key={index} onClick={() => this.handleClick(index)} style={itemStyle}>
            {child}
          </div>
        );
      });
    } else if (headCount && headCount > 0) {
      renderedChildren = [];
      for (let count = 0; count < headCount; count++) {
        const itemClassname = mergeClasses(
          styles.wrapper,
          styles.empty,
          highlight === count ? styles.highlightEmpty : ''
        );

        itemStyle = mergeStyles(
          wrapperStyles,
          highlight === count ? highlightStyle : {}
        );

        renderedChildren.push(
          <div className={itemClassname} key={count} onClick={() => this.handleClick(count)} style={itemStyle} />
        );
      }
    }

    return (
      <div className={rootClasses} style={style} >
        {renderedChildren}
      </div>
    );
  }
}
