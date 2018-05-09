import React, { Component, PropTypes } from 'react';
import noop from 'utils/noop';
import { trackEvent } from 'utils/gtm';
import { mergeClasses } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser.js';
import Text from '../Text';
import styles from './Chip.scss';

const { string, object, func, array, number } = PropTypes;

export default class Chip extends Component {

  static propTypes = {
    children: React.PropTypes.oneOfType([
      array,
      object,
    ]).isRequired,
    className: string,
    headingText: string,
    onMouseClick: func,
    onMouseEnter: func,
    onMouseLeave: func,
    onTouchTap: func,
    current: number,
    listWrapperClass: string,

    // GTM props
    analyticsOn: string,
    analyticsLabel: string,
    analyticsValue: string,
    analyticsCategory: string,
  };

  static defaultProps = {
    onMouseClick: noop,
    onMouseEnter: noop,
    onMouseLeave: noop,
    onTouchTap: noop,
  };
  state = {
    colorName: null,
    id: null,
  };

  componentWillMount() {
    this.setState({ id: this.props.current });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.current !== nextProps.current) {
      this.setState({ id: nextProps.current });
    }
  }

  getHoveredData = (data, event) => {
    this.setState({ colorName: data });
    this.props.onMouseEnter(event);
  };

  getChildren = (children) => {
    let clicked = false;
    const renderChildren = React.Children.map(children,
      (child, index) => {
        clicked = false;
        if (this.state.id === index) clicked = true;

        return React.cloneElement(child, {
          clickCallBack: this.handleClick,
          hoverCallBack: this.getHoveredData,
          hoverOutCallBack: this.handleMouseOut,
          clicked,
          refId: index,
        });
      });

    return renderChildren;
  };

  handleClick = (getid, event, data) => {
    this.setState({ id: getid });
    this.props.onMouseClick(event, getid, data);
    this.props.onTouchTap(event, getid, data);

    const {
      analyticsOn,
      analyticsLabel,
      analyticsCategory,
    } = this.props;

    if (analyticsOn) {
      trackEvent({
        action: analyticsOn,
        label: analyticsLabel,
        value: data,
        category: analyticsCategory,
      });
    }
  };

  handleMouseOut = (event) => {
    this.props.onMouseLeave(event);
  };

  render() {
    const {
      headingText,
      children,
      className,
      listWrapperClass,

      analyticsOn,
      analyticsLabel,
      analyticsCategory,
    } = this.props;

    const classNames = {
      container: mergeClasses(stylePropsParser(className, styles), styles.chip),
      headingText: styles.headText,
      listBody: mergeClasses(styles.listBody, styles.chipChild),
      listWrapper: mergeClasses(styles.listWrapper, stylePropsParser(listWrapperClass, styles)),
    };

    const analyticsAttrs = {
      'analytics-on': analyticsOn,
      'analytics-label': analyticsLabel,
      'analytics-category': analyticsCategory,
    };

    const renderChildren = this.getChildren(children);

    return (
      <div className={classNames.container} {...analyticsAttrs}>
        <Text className={classNames.headingText}>
          {headingText}{this.state.colorName}
        </Text>
        <div className={classNames.listWrapper}>
          <ul className={classNames.listBody}>
            {renderChildren}
          </ul>
        </div>
      </div>
    );
  }
}
