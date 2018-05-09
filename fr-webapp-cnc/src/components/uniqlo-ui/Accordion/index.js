import React, { PureComponent, PropTypes } from 'react';
import { mergeClasses } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser.js';
import styles from './Accordion.scss';

const { string, number, object, array, bool, oneOfType, oneOf } = PropTypes;
const classNames = {};

export default class Accordion extends PureComponent {

  static propTypes = {
    children: oneOfType([array, object]),
    accordionitems: oneOfType([array, object]),
    className: string,
    id: string,
    expandMultiple: bool,
    type: string,
    align: oneOf(['Left', 'Center']),
    animateItems: bool,
    animationDuration: number,
  };

  static contextTypes = {
    type: string,
    pageProperties: oneOfType([string, object]),
  };

  static defaultProps = {
    animateItems: true,
    animationDuration: 270,
  };

  state = {
    id: null,
  };

  handleClick = itemReferenceId => this.setState({ id: itemReferenceId });

  variationCheck(type) {
    const { className } = this.props;

    if (type === 'menuItem') {
      classNames.container = mergeClasses(styles.accordion, styles.menu, stylePropsParser(className, styles));
      classNames.lineSeparator = mergeClasses(styles.accordion, styles.menu, styles.lineSeparator);
    } else if (type === 'category') {
      classNames.container = mergeClasses(styles.accordion, styles.category, stylePropsParser(className, styles));
      classNames.lineSeparator = mergeClasses(styles.accordion, styles.category, styles.lineSeparator);
    } else {
      classNames.container = mergeClasses(styles.accordion, styles.container, stylePropsParser(className, styles));
      classNames.lineSeparator = mergeClasses(styles.accordion, styles.lineSeparator);
    }
  }

  render() {
    const {
      children,
      accordionitems,
      expandMultiple,
      type: variationAsProp,
      align,
      animateItems,
      animationDuration,
    } = this.props;

    const { type: variationAsContext, pageProperties } = this.context;

    // For category page
    const categoryId = pageProperties && pageProperties.componentProperties.categoryId;
    const pageType = 'normal';
    const type = variationAsProp === 'context' ? variationAsContext || pageType : variationAsProp;
    const tileId = this.state.id;

    let multipleExpanded = true;

    this.variationCheck(type);
    const propChildren = accordionitems || children;
    const hasMultipleItems = Array.isArray(propChildren) && propChildren.length > 0;
    const animationDelay = hasMultipleItems ? animationDuration / propChildren.length : 0;

    const renderChildren = React.Children.map(propChildren, (child, index) => {
      let expanded = tileId === index;

      const childExpanded = child.props.expanded;

      if (childExpanded && tileId === null) {
        if (expandMultiple) {
          expanded = true;
        } else if (multipleExpanded) {
          multipleExpanded = false;
          expanded = true;
        }
      }

      // TO MAKE THE CLASSIFICATION MENU OPENED FOR A SELECTED CATEGORY
      if (type === 'category' && Array.isArray(child.props.content) &&
        child.props.content[0] && child.props.content[0].props.accordionitems) {
        const checker = child.props.content[0].props.accordionitems.filter(item => (item.props.id || '').indexOf(categoryId) !== -1);

        if (checker.length > 0) {
          expanded = true;
        }
      }

      return React.cloneElement(child, {
        accordionCallback: this.handleClick,
        expanded,
        itemReferenceId: index,
        expandMultiple,
        type,
        align,
        animate: animateItems,
        animationDuration,
        animationDelay: index * animationDelay,
      });
    });

    return (
      <div className={classNames.container}>
        {renderChildren}
      </div>
    );
  }
}
