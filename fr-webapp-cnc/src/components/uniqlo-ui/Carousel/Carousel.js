import React, { PropTypes, PureComponent } from 'react';
import ConfigurationManager from '../helpers/configuration/configurationManager';
import BaseConfig from '../helpers/configuration/baseConfig';
import { mergeClasses } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser';
import CarouselHead from './CarouselHead';
import CarouselTile from './CarouselTile';
import NavHead from './NavHead';
import styles from './Carousel.scss';

const { bool, oneOf, node, number, func, object, string } = PropTypes;

export default class Carousel extends PureComponent {

  static propTypes = {
    // Animation for the carousel,
    animation: oneOf(['none', 'scroll', 'fade']),

    // Does the animation is auto
    autoScroll: bool,

    // Childrens supplied to Carousel
    children: node,

    className: string,

    // Currently selected tile.
    current: number,

    // Tiles to be displayed on screen
    display: number,

    // Navigation arrows for carousel
    navHead: bool,

    // Callback to receive post slide
    onSlide: func,

    // Tiles to scroll on animation
    scroll: PropTypes.number,

    // To show/hide the tab head of Carousel
    tabHead: bool,

    // Tab Head Position
    tabPosition: oneOf(['bottom', 'top']),

    // ARROW HEADS
    arrowButton: bool,
  };

  static contextTypes = {
    compConfig: object,
  };

  static defaultProps = {
    autoScroll: false,
    tabHead: true,
    animation: 'none',
    tabPosition: 'bottom',
    navHead: false,
    display: 1,
    scroll: 1,
    arrowButton: true,
  };

  state = {
    current: this.props.current || 0,
    tileCount: 0,
    totalTile: 0,
    currentAnim: null,
  };

  componentWillMount() {
    const { current } = this.state;
    let tileCount = 0;

    React.Children.map(this.props.children, (child) => {
      if (child.type.name !== 'CarouselHead') {
        tileCount++;
      }
    });

    this.setState({
      current,
      totalTile: tileCount,
    });

    const compConfig = this.context.compConfig || ConfigurationManager.getCompConfig(BaseConfig);
    const carouselCfg = compConfig.carousel || {};

    this.slideDuration = carouselCfg.slideDuration;
  }

  componentDidMount() {
    if (this.props.autoScroll && this.state.currentAnim === null) {
      this.timeoutScroll = setInterval(() => {
        this.initScroll();
      }, this.slideDuration);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.current !== nextProps.current) {
      this.setState({
        current: nextProps.current,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.current !== nextProps.current) {
      return !clearInterval(this.state.currentAnim);
    }

    return nextState.current !== this.state.current;
  }

  componentWillUnmount() {
    if (this.timeoutScroll) {
      clearInterval(this.timeoutScroll);
      this.timeoutScroll = false;
    }
  }

  initScroll(newCurrent) {
    const {
      current,
      totalTile,
      currentAnim,
    } = this.state;
    const {
      scroll,
      onSlide,
    } = this.props;
    let activeTile;

    clearInterval(currentAnim);
    activeTile = newCurrent !== undefined ? newCurrent : current + scroll;
    activeTile = activeTile < 0 ? totalTile + activeTile : activeTile;
    activeTile = activeTile === totalTile ? 0 : activeTile;

    this.setState({
      current: activeTile,
      currentAnim: null,
    });

    if (onSlide) {
      onSlide(activeTile);
    }
  }

  handleClick = (item) => {
    const { current } = this.state;
    const newitem = parseInt(item, 10);

    if (!isNaN(newitem) && newitem !== current) {
      this.initScroll(newitem);
    }
  };

  handleNavigator = (type) => {
    const {
      current,
      currentAnim,
    } = this.state;
    const {
      scroll,
      autoScroll,
    } = this.props;

    if (currentAnim !== null || autoScroll === false) {
      if (type === 'forward') {
        this.initScroll(current + scroll);
      } else if (type === 'back') {
        this.initScroll(current - scroll);
      }
    }
  };

  renderChild() {
    const {
      children,
      animation,
      tabPosition,
      display,
      scroll,
    } = this.props;
    const {
      current,
      totalTile,
    } = this.state;
    let head;
    let offset = 0;
    const tiles = React.Children.map(children, (child, index) => {
      let currentChild;

      const additionalProps = {
        key: index,
      };

      if (child.type.componentName === 'CarouselHead') {
        Object.assign(additionalProps, {
          current,
          animation,
          onTouchTap: this.handleClick,
        });
        head = React.cloneElement(child, additionalProps);
        offset++;
      } else {
        const width = 100 / display;

        additionalProps.style = child.props.style || {};
        Object.assign(additionalProps.style, {
          width: `${width}%`,
        });
        Object.assign(additionalProps, {
          animation,
          tilePosition: tabPosition === 'top' ? 'bottom' : 'top',
          index: head ? index - offset : index,
          display,
          current,
          scroll,
          totalTile,
        });

        if (child.type.componentName === 'CarouselTile') {
          currentChild = React.cloneElement(child, additionalProps);
        } else {
          currentChild = <CarouselTile {...additionalProps}>{child}</CarouselTile>;
        }

        return currentChild;
      }

      return null;
    }).filter(Boolean);

    return {
      tiles,
      head,
    };
  }

  renderArrowHead() {
    const { navHead } = this.props;

    if (!navHead) {
      return {};
    }

    const navHeadGenerator = (direction, value) => (
      <NavHead
        direction={direction}
        onTouchTap={this.handleNavigator}
        value={value}
      />
    );

    return {
      left: navHeadGenerator('left', 'back'),
      right: navHeadGenerator('right', 'forward'),
    };
  }

  render() {
    const {
      className,
      tabHead,
      tabPosition,
      arrowButton,
    } = this.props;
    const {
      current,
      totalTile,
    } = this.state;

    let carouselHead;
    const renderedChildren = this.renderChild();
    const rootStyles = mergeClasses(styles.carousel, stylePropsParser(className, styles));

    if (tabHead) {
      if (!renderedChildren.head) {
        carouselHead = (
          <CarouselHead
            current={current}
            headCount={totalTile}
            key={renderedChildren.tiles.length}
            onTouchTap={this.handleClick}
            tabPosition={tabPosition}
          />
        );
      } else {
        carouselHead = renderedChildren.head;
      }
    }

    if (tabPosition === 'top') {
      renderedChildren.tiles.unshift(carouselHead);
    } else {
      renderedChildren.tiles.push(carouselHead);
    }

    const navigation = this.renderArrowHead();

    return (
      <div className={rootStyles}>
        {arrowButton ? navigation.left : null}
        {renderedChildren.tiles}
        {arrowButton ? navigation.right : null}
      </div>
    );
  }
}
