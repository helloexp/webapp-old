import React, { Component, PropTypes } from 'react';
import Grid from '../core/Grid';
import GridCell from '../core/GridCell';
import styles from './Tabs.scss';

const {
  number,
  func,
  bool,
  node,
  oneOf,
  string,
} = PropTypes;

const renderChildren = (me) => {
  const { children: pChildren, noActive, items, members } = me.props;
  const activeIndex = me.state.activeIndex;
  const updateTabSet = me.updateTabSet;
  let content;
  const propChildren = items || members || pChildren;
  const gridDivisions = 12;
  const columns = Math.round(gridDivisions / propChildren.length);
  const children = React.Children.map(propChildren, (child, index) => {
    const tabContent = child.props.children;
    let selectTab = false;

    if ((me.genderFromUrl.toLowerCase() === (child.props.text && child.props.text.toLowerCase())
      || me.genderFromUrl === 'NA' && activeIndex === index) && tabContent) {
      selectTab = !noActive;
      content =
        (<div className={styles[me.props.contentClass]} >
          {tabContent}
        </div>)
      ;
    }

    return (
      <GridCell colSpan={columns} key={index}>
        {
          React.cloneElement(child, {
            index,
            updateTabSet,
            type: me.props.type,
            active: selectTab,
          })
        }
      </GridCell>
    );
  });

  return {
    content,
    children,
  };
};

export default class Tabs extends Component {

  static propTypes = {
    children: node.isRequired,
    items: node,
    members: node,
    cols: number,
    defaultTabIndex: number,
    onTabChange: func,
    padding: number,
    noActive: bool,
    className: string,
    contentClass: string,
    type: oneOf(['bordered', 'borderLess', 'genderTab', 'childVariation', 'imageTab', 'accountTab']),
  };

  static defaultProps = {
    onTabChange: () => null,
    padding: 0,
    defaultTabIndex: 0,
  };

  componentWillMount = () => {
    this.setState({ activeIndex: this.props.defaultTabIndex });
    this.genderFromUrl = 'NA';
    if (window.location.hash) {
      const lochash = window.location.hash.substr(1);
      const mylocation = (/gender=([^\s#?]*)/).exec(lochash) || [];

      this.genderFromUrl = mylocation[1];
    }
  };

  componentWillReceiveProps = (nextProps) => {
    if (this.props.defaultTabIndex !== nextProps.defaultTabIndex && !isNaN(nextProps.defaultTabIndex)) {
      this.setState({
        activeIndex: nextProps.defaultTabIndex,
      });
    }
  };

  updateTabSet = (index) => {
    this.setState({ activeIndex: index });
    this.props.onTabChange(index);
  };

  render() {
    const _this = this;
    const {
      className,
    } = _this.props;
    const {
      content,
      children: gridContent,
    } = renderChildren(_this);

    this.genderFromUrl = 'NA';

    return (
      <div className={styles.tabs} >
        <Grid childrenWrapperClass={styles.rootClass} className={className} >
          {gridContent}
        </Grid>
        {content}
      </div>
    );
  }
}
