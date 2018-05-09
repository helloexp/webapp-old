import React, { PureComponent, PropTypes } from 'react';
import cx from 'classnames';
import Image from '../Image';
import Icon from '../core/Icon';
import styles from './Tooltip.scss';

const { string, node, array, object, oneOf, oneOfType } = PropTypes;
const marginPadding = 4;

function getDeviceWidth() {
  return window.innerWidth > 0 ? window.innerWidth : screen.width;
}

function getMarginPadding(value) {
  return (value / 100) * getDeviceWidth();
}

function getToolTipWidth(toolTip) {
  const style = window.getComputedStyle(toolTip);
  const properties = {
    marginLeft: parseInt(style.getPropertyValue('margin-left'), 10),
    marginRight: parseInt(style.getPropertyValue('margin-right'), 10),
  };

  return getDeviceWidth() - (properties.marginLeft + properties.marginRight);
}

function getChildren(children) {
  const imageContainer = [];
  const imageElement = [];
  const renderChildren = [];

  React.Children.forEach(children,
    (child, index) => {
      const childType = child && child.props && (child.props._type || child.type.componentName);

      if (childType === 'Text') {
        renderChildren.push(React.cloneElement(child, {
          className: 'textFromTooltip',
          key: index,
        }));
      } else if (childType === 'Image') {
        imageElement.push(React.cloneElement(child, {
          className: 'imageFromTooltip',
          key: index,
        }));
      } else if (childType === 'Link') {
        renderChildren.push(React.cloneElement(child, {
          className: styles.linkFromTooltip,
          key: index,
        }));
      } else {
        renderChildren.push(child);
      }
    }
  );

  imageContainer.push(
    <div className={imageElement.length > 1 ? styles.imageContainer : styles.imageContainerSingleImage}>
      {imageElement}
    </div>
  );

  renderChildren.filter(Boolean).splice(1, 0, imageContainer);

  return renderChildren;
}

export default class Tooltip extends PureComponent {
  static propTypes = {
    className: string,
    heading: string,
    iconClassName: string,
    iconStyles: string,
    triggerImage: string,
    style: object,
    position: oneOf(['top', 'bottom', 'auto']),
    children: oneOfType([
      array,
      node,
      object,
    ]),
  };

  static defaultProps = {
    position: 'auto',
  };

  state = {
    extraLeft: 0,
    center: 0,
    isVisible: false,
    toolTipDirectionInfo: {},
  };

  componentDidMount() {
    window.addEventListener('resize', this.refreshTooltip);
    window.addEventListener('click', this.hideTooltip);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.refreshTooltip);
    window.removeEventListener('click', this.hideTooltip);
  }

  setRootRef = ref => (this.toolTip = ref);

  setTooltipRef = ref => (this.toolTipRef = ref);

  offsetCalculation() {
    const rect = this.toolTip.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    return {
      top: rect.top,
      bottom: windowHeight - rect.bottom,
    };
  }

  determineToolTipDirection(paddingToBeApplied, arrowHeight) {
    const elementOffSetValues = this.offsetCalculation();
    const maxContainerHeightTop = elementOffSetValues.top - arrowHeight -
    2 * paddingToBeApplied;
    const maxContainerHeightBottom = elementOffSetValues.bottom - arrowHeight -
    2 * paddingToBeApplied;
    const topBottomThreshold = 100;

    // Default check for max Height top, if less, replace with bottom height.
    let toolTipBelow;

    switch (this.props.position) {
      case 'top':
        toolTipBelow = false;
        break;
      case 'bottom':
        toolTipBelow = true;
        break;
      default:
        toolTipBelow = maxContainerHeightTop < topBottomThreshold;
        break;
    }

    const maxContainerHeightApplied = toolTipBelow ? maxContainerHeightBottom : maxContainerHeightTop;

    return {
      isToolTipBelow: toolTipBelow,
      maxContainerHeight: maxContainerHeightApplied,
    };
  }

  refreshTooltip = () => {
    // to avoid calculations while orientation change animations are going on
    setTimeout(() => {
      this.updateToolTipPosition(this.state.isVisible);
    }, 100);
  };

  showTooltip = (event) => {
    const toggle = this.state.isVisible;

    event.stopPropagation();

    this.updateToolTipPosition(!toggle);
  };

  hideTooltip = () => {
    const toggle = this.state.isVisible;

    if (toggle) {
      this.updateToolTipPosition(!toggle);
    }
  };

  updateToolTipPosition = (setVisible) => {
    if (setVisible === true) {
      const arrowHeight = 10;
      const marginPaddingToBeApplied = getMarginPadding(marginPadding);
      const toggleLeftPosition = this.toolTip.getBoundingClientRect().left;
      const toolTipDirectionInfo = this.determineToolTipDirection(marginPaddingToBeApplied, arrowHeight);
      const elementCenter = this.toolTip.offsetWidth / 2;

      this.setState({
        isVisible: true,
        extraLeft: toggleLeftPosition,
        center: elementCenter,
        toolTipDirectionInfo,
      }, this.updateArrowPosition);
    } else {
      this.setState({
        isVisible: false,
        extraLeft: 0,
        center: 0,
        arrowPosition: 0,
      });
    }
  };

  updateArrowPosition = () => {
    const toggleElementClientRect = this.toolTip.getBoundingClientRect();
    const toggleCenter = toggleElementClientRect.width / 2;

    const tooltipElementClientRect = this.toolTipRef.getBoundingClientRect();

    /** ideally should be read from element node */
    const arrowWidth = 24;
    const arrowCenter = arrowWidth / 2;
    /** position correction to prevent the arrow protruding outside the block */
    const tooltipBorderCorrection = 2;

    const calculatedArrowPos = toggleElementClientRect.left - tooltipElementClientRect.left + toggleCenter - arrowCenter - tooltipBorderCorrection;

    /**
     * To prevent movement arrow outside tooltip rectangle
     * @type {number}
     */
    const arrowPosition = calculatedArrowPos + arrowWidth > tooltipElementClientRect.width
      ? tooltipElementClientRect.width - arrowWidth
      : calculatedArrowPos;

    this.setState({
      arrowPosition,
    });
  };

  classNames() {
    const { className } = this.props;
    const { isToolTipBelow } = this.state.toolTipDirectionInfo;

    return {
      container: cx(styles.tooltip, className),
      toolTipContainerClass: cx(styles.toolTipContainerClass, { [styles.downToolTipContainerClass]: isToolTipBelow }),
      toolTipForContainer: styles.toolTipForContainer,
      toolTipArrow: isToolTipBelow ? styles.upArrow : styles.downArrow,
      triggerElement: styles.triggerElement,
      childrenComponents: styles.childrenComponents,
    };
  }

  inlineStyles() {
    const style = {
      toolTipContainerClass: {
        width: this.toolTipRef ? getToolTipWidth(this.toolTipRef) : null,
      },
    };

    return {
      toolTipContainerStyle: { ...style.toolTipContainerClass, left: `-${this.state.extraLeft}px` },
      childrenComponents: { maxHeight: `${this.state.toolTipDirectionInfo.maxContainerHeight}px` },
      arrowContainerStyle: { left: `${this.state.arrowPosition}px` },
    };
  }

  renderToolTip() {
    const { heading, children } = this.props;
    const classNames = this.classNames();
    const inlineStyles = this.inlineStyles();
    const renderedChildren = getChildren(children);

    return (
      <div className={classNames.childrenComponents} style={inlineStyles.childrenComponents}>
        { heading && <div className={styles.heading}>{heading}</div> }
        {renderedChildren}
        <div className={classNames.toolTipArrow} style={inlineStyles.arrowContainerStyle} />
      </div>
    );
  }

  render() {
    const { triggerImage, style, iconClassName, iconStyles } = this.props;
    const classNames = this.classNames();
    const inlineStyles = this.inlineStyles();
    const toolTipState = this.state.isVisible === true ? styles.tooltipShow : styles.toolTipHide;
    const imageProps = {
      source: triggerImage,
      style,
      className: classNames.triggerElement,
    };
    const iconProps = {
      className: iconClassName,
      styleClass: iconStyles,
    };
    const triggerElementProps = triggerImage ? imageProps : iconProps;
    const TriggerElement = triggerImage ? Image : Icon;

    return (
      <div
        className={classNames.container}
        ref={this.setRootRef}
        tabIndex="0"
      >
        <div
          className={cx(classNames.toolTipContainerClass, toolTipState)}
          style={inlineStyles.toolTipContainerStyle}
          ref={this.setTooltipRef}
        >
          {this.renderToolTip()}
        </div>
        <div className={styles.toolTipForContainer}>
          <TriggerElement
            onClick={this.showTooltip}
            {...triggerElementProps}
          />
        </div>
      </div>
    );
  }
}
