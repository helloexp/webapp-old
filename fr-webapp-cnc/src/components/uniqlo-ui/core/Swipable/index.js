import React, { PureComponent, PropTypes } from 'react';
import castArray from 'utils/castArray';
import Image from '../../Image';
import { mergeClasses } from '../../helpers/utils/stylePropable';
import stylePropsParser from '../../helpers/utils/stylePropParser';
import styles from './Swipable.scss';

const { node, object, number, func, bool, string } = PropTypes;
let totalWidth;

const getTotalWidth = elements => Array.from(elements[0] || []).reduce((acc, el) => acc + el.offsetWidth, 0);

const prepareStyle = (me) => {
  const { translation } = me.state;
  const { speed } = me.props;
  const items = me && me.rootElement && me.rootElement.childNodes && me.rootElement.childNodes[0].childNodes ?
    castArray(me.rootElement.childNodes[0].childNodes) :
    [];
  const width = getTotalWidth(items);

  const baseStyles = {
    swipeMain: {
      transitionDuration: `${speed}ms`,
      WebkitTransform: `translate3d(-${translation}%, 0, 0)`,
      transform: `translate3d(-${translation}%, 0, 0)`,
    },
  };

  if (width) {
    baseStyles.swipeMain.width = width;
  } else {
    baseStyles.swipeMain.overflowY = 'scroll';
  }

  return baseStyles;
};

// For generating the bullet buttons on bottom
const getBulletNav = (me) => {
  const { cycle, children, bulletClass } = me.props;
  const { selectedIndex } = me.state;
  const highLightIndex = cycle ? selectedIndex - 1 : selectedIndex;
  const bullets = React.Children.map(children, (child, count) => {
    const index = cycle ? count + 1 : count;
    const handleEmptyClick = me.bulletNavClick.bind(me, index);
    const emptyHighlightClass = styles.highlightEmpty;
    const itemClassname = mergeClasses(styles.wrapper, styles.empty, highLightIndex === count ? emptyHighlightClass : '');

    return <div className={itemClassname} key={count} onClick={handleEmptyClick} />;
  });
  const rootClass = mergeClasses(styles.bulletWrapper, stylePropsParser(bulletClass, styles));

  return <div className={rootClass}>{bullets}</div>;
};

// For the navigational arrows
const getNavigation = (me) => {
  const { nextIcon, previousIcon, nextClassName, previousClassName, children, cycle, bulletNav } = me.props;
  const navigation = {
    next: null,
    previous: null,
  };

  const imageClasses = {
    nextClassName: mergeClasses('swipable', 'next', nextClassName),
    previousClassName: mergeClasses('swipable', 'previous', previousClassName),
  };

  const index = me.state.selectedIndex;

  if (nextIcon && (cycle || children.length - 1 > index)) {
    navigation.next = <Image className={imageClasses.nextClassName} onClick={me.goNext} source={nextIcon} />;
  }

  if (previousIcon && (cycle || index > 0)) {
    navigation.previous = <Image className={imageClasses.previousClassName} onClick={me.goPrevious} source={previousIcon} />;
  }

  if (bulletNav) {
    navigation.bulletNav = getBulletNav(me);
  }

  return navigation;
};

const setChildComponentClass = (child) => {
  if (!React.isValidElement(child)) {
    return child;
  }

  let childCopy = child;
  const { _type, variation, className } = childCopy.props;

  switch (_type) {
    case 'ImagePlusText':
      if (variation.startsWith('singleMedia')) {
        childCopy = React.cloneElement(childCopy, {
          className: mergeClasses(className, 'inSwipableSingleMedia'),
        });
      }

      break;
    default:
  }

  return childCopy;
};

// To select as specific index
const selectIndex = (_this, newIndex, onMount) => {
  let newSelectedIndex = newIndex;
  let translation;

  // Calculation for default Translation - END
  const children = _this.rootElement.childNodes[0];
  const childNodes = children.childNodes;
  let defaultSelectWidth = 0;

  totalWidth = 0;

  for (let count = 0; count < childNodes.length; count++) {
    if (_this.props.selectedIndex === count) {
      defaultSelectWidth = totalWidth;
    }

    totalWidth += childNodes[count].offsetWidth;
  }

  const childWidth = children.offsetWidth;

  totalWidth = totalWidth < childWidth ? childWidth : totalWidth + ((100 / totalWidth) * 9);

  const defaultTranslation = (defaultSelectWidth / totalWidth) * 100;

  if (_this.props.cycle) {
    newSelectedIndex = newIndex > _this.items.length - 2 ? 1 : newIndex;
    newSelectedIndex = newSelectedIndex < 1 ? _this.items.length - 2 : newSelectedIndex;
    translation = !_this.props.pan ? newIndex * _this.state.pageWidthPerCent : defaultTranslation;
  } else if (_this.props.activeTranslation && !onMount) {
    translation = _this.state.translation;
  } else {
    translation = !_this.props.pan ? newIndex * _this.state.pageWidthPerCent : defaultTranslation;
  }

  // To completely show the selected tab in both ends.
  const childTranslation = [];

  childTranslation.push(0);

  for (let count = 0; count < childNodes.length; count++) {
    childTranslation[count + 1] = childTranslation[count] + (childNodes[count].offsetWidth / totalWidth) * 100;
  }

  const rootElementWidth = _this.rootElement.offsetWidth;
  const rootElementTranslation = (rootElementWidth / totalWidth) * 100;
  const currentTranslation = childTranslation[newSelectedIndex];
  const leftEnd = _this.state.translation;
  const rightEnd = _this.state.translation + rootElementTranslation;

  if (currentTranslation <= leftEnd) {
    translation = currentTranslation;
  } else if (childTranslation[newSelectedIndex + 1] >= rightEnd) {
    if (childNodes[newSelectedIndex].offsetWidth > rootElementWidth) {
      translation = currentTranslation;
    } else translation = childTranslation[newSelectedIndex + 1] - rootElementTranslation;
  }

  // To limit the translation limit if default index=childNodes.length.
  const maxTranslation = 100 - rootElementTranslation;

  if (translation > maxTranslation) {
    translation = maxTranslation;
  }

  _this.setState({
    selectedIndex: newSelectedIndex,
    translation,
    clientX: null,
    animate: true,
  });
};

// mouse drag handler
const transformComponent = (me, event) => {
  const { clientX, translation } = me.state;
  const newClientX = event.changedTouches[0].clientX;
  const dx = newClientX - clientX;
  const thisElem = me.rootElement;
  const elemWidth = thisElem && thisElem.childNodes[0].offsetWidth || 1;
  const containerWidth = thisElem && thisElem.offsetWidth;
  const dxPerCent = dx / elemWidth * 100;
  let newTranslation = translation - dxPerCent;
  const maxTranslation = (elemWidth - containerWidth) / elemWidth * 100;

  if (!clientX) {
    me.setState({
      openX: newClientX,
      clientX: newClientX,
      isSwiping: true,
    });
  } else {
    if (newTranslation < 0) {
      // Need fix
      newTranslation = 0;
    } else if (newTranslation > maxTranslation) {
      newTranslation = maxTranslation;
    }

    me.setState({
      translation: newTranslation,
      clientX: newClientX,
      animate: false,
      isSwiping: true,
    });
  }
};

const getSpaceStyles = space => ({
  container: {
    marginLeft: `-${space}px`,
    marginRight: `-${space}px`,
  },
  item: {
    paddingLeft: `${space}px`,
    paddingRight: `${space}px`,
  },
});

export default class Swipable extends PureComponent {

  static propTypes = {
    children: node,
    className: string,
    selectedIndex: number,
    style: object,
    onIndexChange: func,
    display: number,
    pan: bool,
    speed: number,
    leftNavIcon: string,
    rightNavIcon: string,
    nextClassName: string,
    previousClassName: string,
    bulletClass: string,
    translation: bool,
    itemClassName: string,
    swipeItemClassName: string,
    cycle: bool,
    bulletNav: bool,
    activeTranslation: bool,
    itemsSpace: number,
  };

  static defaultProps = {
    display: 1,
    pan: false,
    cycle: false,
    speed: 200,
    translation: true,
    selectedIndex: 0,
    activeTranslation: false,
  };

  componentWillMount() {
    this.updateComponent(this.props);
  }

  componentDidMount() {
    const selectedIndex = this.props.cycle ? 1 : this.props.selectedIndex;

    selectIndex(this, selectedIndex, true);
  }

  componentWillReceiveProps(nextProps) {
    this.updateComponent(nextProps);
    if (nextProps.selectedIndex !== this.props.selectedIndex) {
      selectIndex(this, parseInt(nextProps.selectedIndex, 10));
    }
  }

  isSwipeVertical = (x1, x2, y1, y2) => {
    const xDist = Math.abs(x1 - x2);
    const yDist = Math.abs(y1 - y2);

    return !(xDist > yDist);
  };

  touchObject = {
    startX: 0,
    startY: 0,
  };
  handleTouchStart = (event) => {
    this.touchObject = {
      startX: event.touches[0].pageX,
      startY: event.touches[0].pageY,
    };
  };

  handleTouchMove = (event) => {
    const isVertical = this.isSwipeVertical(
        this.touchObject.startX,
        event.touches[0].pageX,
        this.touchObject.startY,
        event.touches[0].pageY
    );

    if (isVertical) {
      // it means it's a vertical direction so stop transform
      return;
    }

    if (event.cancelable) {
      event.preventDefault();
    }

    transformComponent(this, event);
  };

  handleTouchEnd = (event) => {
    this.handleSwipe(event);
  };

  handleSwipe = (event) => {
    const _this = this;
    const { state, props } = _this;
    const { cycle, pan } = props;
    const { pageWidthPerCent, translation, openX, isSwiping } = state;
    const closeX = event.changedTouches[0].clientX;
    const finalIndex = _this.items.length - 1;
    const translationRatio = translation / pageWidthPerCent;
    let currentTranslation;
    let newIndex;

    if (!isSwiping) {
      newIndex = Math.ceil(translationRatio);
    } else {
      newIndex = Math[(closeX - openX) < 0 ? 'ceil' : 'floor'](translationRatio);
    }

    if (cycle) {
      newIndex = newIndex > finalIndex - 1 ? 1 : newIndex;
      newIndex = newIndex < 1 ? finalIndex - 1 : newIndex;
      currentTranslation = !pan ? newIndex * pageWidthPerCent : translation;
    } else {
      newIndex = newIndex > finalIndex ? finalIndex : newIndex;
      currentTranslation = !pan ? newIndex * pageWidthPerCent : translation;
    }

    if (_this.prevIndex !== newIndex) {
      _this.prevIndex = newIndex;
      _this.setState({
        selectedIndex: newIndex,
        clientX: null,
        animate: true,
        isSwiping: false,
        translation: currentTranslation,
      }, _this.transitionTo(newIndex));
    } else {
      _this.setState({
        clientX: null,
      });
    }
  };

  updateComponent(props) {
    const _this = this;
    const { children, selectedIndex, cycle, activeTranslation } = props;
    let tempItems = Array.isArray(children) ? children : [children];

    if (cycle) {
      tempItems = [tempItems[tempItems.length - 1], ...tempItems, tempItems[0]];
    }

    _this.items = tempItems;

    const pageWidthPerCent = 100 / _this.items.length;
    const translation = activeTranslation && _this.state ? _this.state.translation : selectedIndex * pageWidthPerCent;

    _this.state = {
      clientX: null,
      animate: true,
      selectedIndex,
      pageWidthPerCent,
      translation,
      isSwiping: false,
    };
  }

  transitionTo = (selectedIndex) => {
    if (this.props.onIndexChange) {
      this.props.onIndexChange(selectedIndex);
    }
  };

  prevIndex = 0;

  bulletNavClick(item) {
    this.prevIndex = this.state.selectedIndex;
    selectIndex(this, parseInt(item, 10));
  }

  goNext = () => {
    this.prevIndex = this.state.selectedIndex;
    selectIndex(this, this.state.selectedIndex + 1);
  };

  goPrevious = () => {
    this.prevIndex = this.state.selectedIndex;
    selectIndex(this, this.state.selectedIndex - 1);
  };

  render() {
    const _this = this;
    const { swipeMain } = prepareStyle(_this);
    const { className, itemClassName, swipeItemClassName, pan, itemsSpace } = _this.props;
    const { animate } = _this.state;
    const children = _this.items;
    const swipeItemClass = pan ? styles.swipeItemPaned : styles.swipeItemWithotPan;
    const animationClass = animate ? styles.animated : styles.notAnimated;
    const navigation = getNavigation(_this);
    const getRefs = ref => (_this.rootElement = ref);
    const classNames = {
      container: mergeClasses(styles.swipable, stylePropsParser(className, styles)),
      swipeMainClass: mergeClasses(styles.swipeMain, animationClass, stylePropsParser(itemClassName, styles)),
      swipeItemClass: mergeClasses(styles.swipeItem, swipeItemClass, stylePropsParser(swipeItemClassName, styles)),
    };
    const spaceStyles = itemsSpace && getSpaceStyles(itemsSpace) || {};

    return (
      <div className={styles.swipableWrapper}>
        <div className={classNames.container} ref={getRefs} style={spaceStyles.container}>
          <div
            className={classNames.swipeMainClass}
            onTouchCancel={_this.handleTouchEnd}
            onTouchEnd={_this.handleTouchEnd}
            onTouchMove={_this.handleTouchMove}
            onTouchStart={_this.handleTouchStart}
            style={swipeMain}
          >
            {
              children.map((child, index) =>
                <div
                  className={classNames.swipeItemClass}
                  key={index}
                  style={spaceStyles.item}
                >
                  {setChildComponentClass(child)}
                </div>
              )
            }
          </div>
          {navigation.previous} {navigation.next}
          {navigation.bulletNav}
        </div>
      </div>
    );
  }
}
