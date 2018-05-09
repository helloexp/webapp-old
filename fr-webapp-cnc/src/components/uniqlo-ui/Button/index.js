import React, { Component, PropTypes } from 'react';
import noop from 'utils/noop';
import { trackEvent } from 'utils/gtm';
import { BUTTON_DISABLE_DURATION } from 'config/site/default';
import { mergeClasses } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser.js';
import Text from '../Text';
import Link from '../Link';
import styles from './Button.scss';

const { string, object, func, node, bool, oneOfType } = PropTypes;

export default class Button extends Component {
  static propTypes = {
    children: node,
    className: string,
    anchorClass: string,
    labelClass: string,
    // TODO: make universal
    hoverStyle: oneOfType([string, object]),
    id: string,
    label: string,
    link: string,
    onMouseEnter: func,
    onMouseLeave: func,
    onTouchTap: func,
    style: object,
    target: string,
    noLabelStyles: bool,
    disabled: bool,
    preventMultipleClicks: bool,

    // GTM props
    analyticsOn: string,
    analyticsLabel: string,
    analyticsValue: string,
    analyticsCategory: string,

    // Apple Pay props
    lang: string,
    userType: string,
  };

  static defaultProps = {
    disabled: false,
    onMouseEnter: noop,
    onMouseLeave: noop,
    onTouchTap: noop,
  };

  state = {
    clicked: false,
  };

  componentWillUnmount() {
    if (this.props.preventMultipleClicks) {
      clearTimeout(this.resetClick);
    }
  }

  handleMouseEnter = (event) => {
    this.setState({ hovered: true });
    this.props.onMouseEnter(event);
  };

  handleMouseLeave = (event) => {
    this.setState({ hovered: false });
    this.props.onMouseLeave(event);
  };

  handleTouchTap = (event) => {
    const {
      analyticsOn,
      analyticsLabel,
      analyticsValue,
      analyticsCategory,
      preventMultipleClicks,
      userType,
    } = this.props;

    if (analyticsOn) {
      trackEvent({
        action: analyticsOn,
        label: analyticsLabel,
        value: analyticsValue,
        category: analyticsCategory,
        userType,
      });
    }

    if (preventMultipleClicks) {
      this.setState({ clicked: true });
      this.resetClick = setTimeout(() => this.setState({ clicked: false }), BUTTON_DISABLE_DURATION);
    }

    this.props.onTouchTap(event);
  };

  render() {
    const {
      label,
      labelClass,
      noLabelStyles,
      anchorClass,
      hoverStyle,
      className,
      id,
      disabled,
      children,
      link,
      target,
      style,
      lang,

      analyticsOn,
      analyticsLabel,
      analyticsValue,
      analyticsCategory,
    } = this.props;

    const ButtonClassNames = {
      buttonClass: mergeClasses(styles.button, stylePropsParser(className, styles) || className, styles[hoverStyle]),
      anchorClass: mergeClasses(styles.anchor, styles[anchorClass]),
    };
    const enhancedButtonChildren = children || (label
      ? <Text className={mergeClasses(noLabelStyles ? '' : 'label', labelClass, 'btnLabel')} >{label}</Text>
      : null);

    const buttonProps = {
      id,
      style,
      disabled: disabled || this.state.clicked,
      onClick: this.handleTouchTap,
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
    };

    if (lang) buttonProps.lang = lang;

    const analyticsAttrs = {
      'analytics-on': analyticsOn,
      'analytics-label': analyticsLabel,
      'analytics-value': analyticsValue,
      'analytics-category': analyticsCategory,
    };

    const anchorProps = {
      to: link,
      target,
    };

    const renderNode = (
      <button className={ButtonClassNames.buttonClass} {...buttonProps} {...analyticsAttrs} >
        {enhancedButtonChildren}
      </button>
    );

    const linkNode = link ?
      <Link className={ButtonClassNames.anchorClass} {...anchorProps} >{renderNode}</Link> :
      renderNode;

    return linkNode;
  }
}
