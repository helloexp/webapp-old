import React, { Component, PropTypes } from 'react';
import { trackEvent } from 'utils/gtm';
import classNames from 'classnames';
import { mergeClasses } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser';
import Text from '../Text';
import Link from '../Link';
import Image from '../Image';
import styles from './Tab.scss';

const {
  bool,
  oneOf,
  string,
  object,
  number,
  func,
  oneOfType,
} = PropTypes;

const typeToClass = {
  bordered: 'containerBordered',
  borderLess: 'containerBorderless',
  genderTab: 'genderTab',
  childVariation: 'childVariation',
  imageTab: 'containerBorderless',
  accountTab: 'accountLink',
};

const createChild = (me, tabStyles) => {
  const {
    defaultImage,
    className,
    defaultStyle,
    hoverStyle,
    imageStyle,
    backgroundColor,
    link,
    target,
    text,
    active,
    index,
    iconClass,
    highlightColor,
    type,
  } = me.props;

  const typeBorderClass = highlightColor && highlightColor === 'black' ? styles.borderBlackClass : styles.borderGenderClass;
  let tabChild;
  const rootStyle = me.state.hovered ? hoverStyle : defaultStyle;
  const combinedStyles = mergeClasses(styles.tab, stylePropsParser(className, tabStyles));

  let rootClass = active ? mergeClasses(combinedStyles, tabStyles.active) : combinedStyles;

  rootClass = index === 0 ? mergeClasses(rootClass, tabStyles.first) : rootClass;

  const baseClass = mergeClasses(rootClass, iconClass, stylePropsParser(backgroundColor || 'defaultBackground', styles));

  const tabProps = {
    className: baseClass,
    style: rootStyle,
    contentType: ['imageTab', 'bordered', 'accountTab'].includes(type) ? 'tabImageLink' : '',
  };
  const linkProps = {
    to: link,
    target,
  };
  const rootTagProps = link ? { ...linkProps, ...tabProps } : tabProps;

  if (type === 'imageTab' || type === 'accountTab') {
    tabChild =
      (<Link {...rootTagProps} >
        <Image className={imageStyle} source={defaultImage} />
      </Link>)
    ;
  } else {
    tabChild =
      (<Link {...rootTagProps} >
        <Text className={typeBorderClass} content={text} />
      </Link>)

    ;
  }

  return tabChild;
};

export default class Tab extends Component {
  static propTypes = {
    active: bool,
    defaultImage: string,
    defaultStyle: object,
    hoverImage: string,
    hoverStyle: object,
    imageStyle: oneOfType([string, object]),
    index: number,
    link: string,
    onPress: func,
    target: oneOf(['_blank', '_self', '_parent', '_top']),
    text: string,
    className: string,
    updateTabSet: func,
    type: string,
    iconClass: string,
    containerClass: string,
    label: number,
    labelClass: string,

    // GTM props
    analyticsOn: string,
    analyticsLabel: string,
    analyticsCategory: string,
  };

  static defaultProps = {
    onPress: () => null,
    target: '_self',
  };

  state = {
    hovered: false,
  };

  handleMouseDown = (event) => {
    const {
      updateTabSet,
      onPress,
      index,

      analyticsOn,
      analyticsLabel,
      analyticsCategory,
    } = this.props;

    updateTabSet(index);
    onPress(event, index);

    if (analyticsOn) {
      trackEvent({
        action: analyticsOn,
        label: analyticsLabel,
        category: analyticsCategory,
      });
    }
  };

  handleMouseEnter = () => {
    this.setState({ hovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ hovered: false });
  };

  render() {
    const _this = this;
    const {
      defaultImage,
      type,
      containerClass,
      label,
      labelClass,

      analyticsOn,
      analyticsLabel,
      analyticsCategory,
    } = _this.props;
    const tabChild = createChild(_this, styles);
    const shouldIncludeClass = !defaultImage || ['imageTab', 'accountTab'].includes(type);
    const containerCls = classNames({
      [styles.tab]: shouldIncludeClass,
      [styles[typeToClass[type]]]: shouldIncludeClass,
      [styles[containerClass]]: shouldIncludeClass && containerClass,
    });
    const labelChild = label ? <span className={styles[labelClass]}>{label}</span> : null;

    const analyticsAttrs = {
      'analytics-on': analyticsOn,
      'analytics-label': analyticsLabel,
      'analytics-category': analyticsCategory,
    };

    return (
      <div
        className={containerCls}
        onClick={_this.handleMouseDown}
        onMouseEnter={_this.handleMouseEnter}
        onMouseLeave={_this.handleMouseLeave}
        {...analyticsAttrs}
      >
        {tabChild}
        {labelChild}
      </div>
    );
  }
}
