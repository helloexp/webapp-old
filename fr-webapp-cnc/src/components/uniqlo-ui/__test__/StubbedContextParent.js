import React from 'react';

export default class StubbedContextParent extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
  };

  displayName: 'StubbedContextParent';

  render() {
    return React.Children.only(this.props.children);
  }
}
