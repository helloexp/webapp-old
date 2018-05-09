import React, { Component, PropTypes, cloneElement } from 'react';
import noop from 'utils/noop';
import Text from 'components/Atoms/Text';
import { mergeClasses } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser.js';
import Icon from '../core/Icon';
import Link from '../Link';
import styles from './AccordionItem.scss';

const { object, array, bool, func, number, oneOfType, string, node } = PropTypes;
const parseText = (text) => {
  const replacedText = text.replace(/<\/?a[^>]*>/g, '');

  return replacedText;
};

let classNames = {};

export default class AccordionItem extends Component {
  static propTypes = {
    accordionCallback: func,
    children: oneOfType([array, object, node, func]),
    content: oneOfType([array, object, node, func]),
    className: string,
    openIcon: string,
    closeIcon: string,
    expandMultiple: bool,
    itemReferenceId: number,
    expanded: bool,
    headingText: string,
    targetWindow: string,
    type: string,
    url: string,
    animate: bool,
    animationDuration: number,
    animationDelay: number,
  };

  static defaultProps = {
    accordionCallback: noop,
    targetWindow: '_self',
    animate: true,
  };

  state = {
    expanded: false,
  };

  componentWillMount() {
    this.setState({ expanded: this.props.expanded });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.expanded !== this.state.expanded) {
      this.setState({ expanded: nextProps.expanded });
    }
  }

  getHeadingIcon() {
    const {
      closeIcon,
      openIcon,
      className,
    } = this.props;
    const { expanded } = this.state;

    const customIconName = expanded ? closeIcon : openIcon;

    if (customIconName) {
      return (
        <div className={mergeClasses(styles.icon, stylePropsParser(className, styles))}>
          <Icon name={customIconName} className={styles.iconStroke} />
        </div>
      );
    }

    return (
      <div
        className={mergeClasses(
          expanded ? styles.chevronIconUp : styles.chevronIconDown,
          stylePropsParser(className, styles),
        )}
      />
    );
  }

  expandCollapse = (event) => {
    const {
      expandMultiple,
      accordionCallback,
      itemReferenceId,
    } = this.props;

    this.setState({ expanded: !this.state.expanded });

    if (!expandMultiple) {
      accordionCallback(itemReferenceId, event);
    }
  };

  renderAccordionItemType() {
    const { url, headingText, className, targetWindow, type } = this.props;
    const linkClassNames = {
      linkContainer: styles.linkContainer,
      link: mergeClasses(styles.spacingAccordionM, styles.bottomBorder),
      iconRight: mergeClasses(styles.iconRight, styles.iconChevronRightSmall, stylePropsParser(className, styles)),
      linkHeading: styles.normalWithoutURL,
    };
    let heading = headingText;
    let arrowIcon = <span className={linkClassNames.iconRight} />;

    if (type === 'normal') {
      heading = <span className={linkClassNames.linkHeading}>{headingText}</span>;
      arrowIcon = null;
    }

    return <Link className={linkClassNames.link} target={targetWindow} to={url}>{heading} {arrowIcon}</Link>;
  }

  renderContents() {
    const {
      children,
      content: propContent,
      className,
      headingText,
      url,
    } = this.props;

    const { expanded } = this.state;
    const spacingAccordionClass = styles.spacingAccordionM;
    const lineSeparatorClass = styles.lineSeparator;
    const lightLineSeparatorClass = styles.lightLineSeparator;

    classNames = {
      accordionProxyLink: styles.accordionProxyLink,
      contentContaner: styles.contentContaner,
      content: mergeClasses(styles.content, expanded ? styles.expanded : styles.collapsed),
      heading: mergeClasses(styles.heading, expanded ? styles.expanded : styles.collapsed),
      headingText: styles.text,
      headingClass: styles.headingText,
      iconRight: mergeClasses(styles.iconRight, styles.iconChevronRightSmall, stylePropsParser(className, styles)),
      imagePlusText: mergeClasses(styles.imagePlusText, expanded ? styles.expanded : styles.collapsed),
      sideSpacing: styles.sideSpacing,
      spacingAccordionM: expanded ? spacingAccordionClass : mergeClasses(spacingAccordionClass, styles.bottomBorder),
      lineSeparator: expanded ? lineSeparatorClass : mergeClasses(lineSeparatorClass, styles.hidden),
      lightLineSeparator: expanded ? lightLineSeparatorClass : mergeClasses(lightLineSeparatorClass, styles.hidden),
      urlContainer: styles.urlContainer,
    };

    const arrowIcon = <span className={classNames.iconRight} />;
    const urlMarkUp = this.renderAccordionItemType();

    const itemStyles = `${classNames.content} ${styles.noMargin} ${classNames.sideSpacing}`;
    let item = null;
    const propChildren = propContent || children;
    const content = expanded ? React.Children.map(propChildren, (child) => {
      const childComponent = child.props._type;

      if (childComponent === 'ProxyLink') {
        item =
          (<Link className={classNames.accordionProxyLink} to={child.props.linkUrl}>
            <div className={classNames.content}>
              <div className={classNames.sideSpacing}>{parseText(child.props.linkText)}{arrowIcon}</div>
            </div>
          </Link>)
        ;
      } else if (childComponent === 'ImagePlusText') {
        item = <div className={classNames.imagePlusText}>{child}</div>;
      } else if (childComponent === 'Accordion') {
        item =
          (<div className={classNames.content}>
            {cloneElement(child, { className: classNames.sideSpacing })}
          </div>)
        ;
      } else {
        item =
          (<div className={itemStyles}>
            {child}
          </div>)
        ;
      }

      return item;
    }) : null;

    const defaultMarkUp = (
      <div className={classNames.contentContaner}>
        <div className={classNames.heading} onClick={this.expandCollapse}>
          <div className={classNames.spacingAccordionM}>
            <Text size={1} weight="bolder" className={classNames.headingText}>{headingText}</Text>
            { this.getHeadingIcon() }
          </div>
        </div>
        <div className={classNames.lightLineSeparator} />
        {content}
        <div className={classNames.lineSeparator} />
      </div>
    );

    return url ? urlMarkUp : defaultMarkUp;
  }

  render() {
    const { itemReferenceId, className, animate, animationDelay, animationDuration } = this.props;

    classNames.container = mergeClasses(styles.accordionItem, styles.container, stylePropsParser(className, styles));

    let animationStyles;

    if (animate) {
      classNames.container = `${classNames.container} ${styles.accItmSlide}`;
      animationStyles = animate ? {
        animationDelay: `${animationDelay / 1000.0}s`,
        animationDuration: `${animationDuration / 1000.0}s`,
      } : null;
    }

    return (
      <div className={classNames.container} id={itemReferenceId} style={animationStyles}>
        {this.renderContents()}
      </div>
    );
  }
}
