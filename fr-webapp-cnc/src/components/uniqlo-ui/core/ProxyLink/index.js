import React, { PureComponent, PropTypes } from 'react';
import noop from 'utils/noop';
import Link from 'components/uniqlo-ui/Link';
import { mergeClasses } from '../../helpers/utils/stylePropable';
import stylePropsParser from '../../helpers/utils/stylePropParser';
import styles from './ProxyLink.scss';

const { string, object, func, node, oneOfType, array } = PropTypes;

export default class ProxyLink extends PureComponent {
  static propTypes = {
    linkText: string,
    linkUrl: string,
    onClickEvent: func,
    children: oneOfType([array, object, string]),
    image: node,
    className: string,
    rootClass: string,
    targetwindow: string,
  };

  static defaultProps = {
    onClickEvent: noop,
  };

  static contextTypes = {
    compConfig: object,
  };

  render() {
    const {
      linkUrl,
      linkText,
      children,
      image,
      targetwindow,
      className,
      rootClass,
      onClickEvent,
      ...other
    } = this.props;

    const combinedClasses = stylePropsParser(className, styles);

    const absoluteUrlPattern = /^(https?:)?\/\//;
    const compProps = { className: mergeClasses(styles.proxyLink, combinedClasses, rootClass) };
    let RootTag = 'a';

    if (absoluteUrlPattern.test(linkUrl)) {
      compProps.href = linkUrl;
    } else if (linkUrl) {
      RootTag = Link;
      compProps.to = linkUrl;
    }

    return (
      <RootTag
        {...compProps}
        className={mergeClasses(styles.proxyLink, combinedClasses, rootClass)}
        onClick={onClickEvent}
        {...other}
        target={targetwindow}
      >
        {image}
        {children}
        {linkText}
      </RootTag>
    );
  }
}
