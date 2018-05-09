import React, { Component, PropTypes } from 'react';

export default class WithContextHoC extends Component {
  static propTypes = {
    children: PropTypes.any,
    context: PropTypes.object,
  };

  validateChildren() {
    if (this.props.children === undefined) {
      throw new Error('No child components were passed into WithContext');
    }
    if (this.props.children.length > 1) {
      throw new Error('You can only pass one child component into WithContext');
    }
  }

  render() {
    class WithContext extends React.Component { // eslint-disable-line react/no-multi-comp
      getChildContext() {
        return this.props.context;
      }

      render() {
        return this.props.children;
      }
    }

    const context = this.props.context;

    WithContext.childContextTypes = {};

    for (const propertyName in context) {
      if ({}.hasOwnProperty.call(context, propertyName)) {
        WithContext.childContextTypes[propertyName] = PropTypes.any;
      }
    }

    this.validateChildren();

    return (
      <WithContext context={this.props.context}>
        {this.props.children}
      </WithContext>
    );
  }
}
