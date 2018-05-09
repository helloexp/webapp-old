import React, { PropTypes, PureComponent } from 'react';
import { mergeClasses } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser.js';
import styles from './CarouselTile.scss';

const { oneOf, number, object, node, string } = PropTypes;

export default class CarouselTile extends PureComponent {
  static displayName = 'CarouselTile';

  static propTypes = {

    // Animation for the carousel
    animation: oneOf(['none', 'scroll', 'fade']),

    // Children of the tile
    children: node,

    className: string,

    // Current tab to be open
    current: number,

    // items to be displayed per screen
    display: number,

    // index of the tile
    index: number,

    // Items to scroll
    scroll: number,

    // style
    style: object,

    // Position of the tile
    tilePosition: oneOf(['top', 'bottom']),

    // total number of tiles
    totalTile: number,
  };

  static defaultProps = {
    current: 0,
  };

  getCalculatedStyle() {
    const {
      display,
      index,
      current,
      scroll,
      totalTile,
    } = this.props;
    const style = {};
    const left = 100 / display;
    const max = current + display + scroll;
    let lowMax;
    let highMin;
    let tileLeft;
    const min = current - scroll;

    if (max > totalTile - 1) {
      lowMax = max - totalTile;
    }

    if (min < 0) {
      highMin = totalTile + min;
    }

    if (index > current && index < max) {
      tileLeft = (index - current) * left;
      Object.assign(style, {
        zIndex: 1,
        marginLeft: `${tileLeft}%`,
      });
      if (index < (current + display)) {
        Object.assign(style, {
          opacity: 1,
        });
      }
    } else if (max > totalTile - 1 && index < lowMax) {
      tileLeft = (totalTile + index - current) * left;
      Object.assign(style, {
        zIndex: 1,
        marginLeft: `${tileLeft}%`,
      });
      if (index < (lowMax - scroll)) {
        Object.assign(style, {
          opacity: 1,
        });
      }
    } else if (index < current && index >= min) {
      tileLeft = (index - current) * left;
      Object.assign(style, {
        zIndex: 1,
        marginLeft: `${tileLeft}%`,
      });
    } else if (index >= highMin) {
      tileLeft = (index - totalTile) * left;
      Object.assign(style, {
        zIndex: 1,
        marginLeft: `${tileLeft}%`,
      });
    }
  }

  render() {
    const {
      animation,
      children,
      className,
      tilePosition,
      style,
      current,
      index,
    } = this.props;

    if (animation === 'scroll') {
      this.getCalculatedStyle();
    }

    const rootClasses = mergeClasses(
      styles.carouselTile,
      stylePropsParser(className, styles),
      styles[animation],
      styles[tilePosition],
      index === current ? styles.show : styles.hide
    );

    return (
      <div className={rootClasses} style={style} >
        {children}
      </div>
    );
  }
}
