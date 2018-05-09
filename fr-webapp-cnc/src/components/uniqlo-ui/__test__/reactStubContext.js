// "react-stub-context": "^0.3.0",

import React from 'react';
import StubbedContextParent from './StubbedContextParent';

function stubComponentContext(BaseComponentOrig, inputContext) {
  const BaseComponent = BaseComponentOrig;
  let context = inputContext;

  if (typeof context === 'undefined' || context === null) context = {};

  const contextTypes = {};
  const stubContext = context;

  function contextAggregator(key) {
    contextTypes[key] = React.PropTypes.any;
  }

  try {
    Object.keys(stubContext).forEach(contextAggregator);
  } catch (err) {
    throw new TypeError('createdStubbedContextComponent requires an object');
  }

  StubbedContextParent.contextTypes = contextTypes;
  StubbedContextParent.childContextTypes = contextTypes;
  StubbedContextParent.getChildContext = function getChildContext() {
    return stubContext;
  };

  class StubbedContextHandler extends React.Component {
    displayName: 'StubbedContextHandler';

    getWrappedElement() { return this.wrappedElement; }

    getWrappedParentElement() { return this.wrappedParentElement; }

    render() {
      this.wrappedElement = <BaseComponent {...this.state} {...this.props} />;
      this.wrappedParentElement = <StubbedContextParent>{this.wrappedElement}</StubbedContextParent>;

      return this.wrappedParentElement;
    }
  }
  StubbedContextHandler.childContextTypes = contextTypes;
  StubbedContextHandler.getChildContext = function getChildContext() {
    return stubContext;
  };

  BaseComponent.contextTypes = Object.assign({}, BaseComponent.contextTypes, contextTypes);

  StubbedContextHandler.getWrappedComponent = function getWrappedComponent() { return BaseComponent; };

  StubbedContextHandler.getWrappedParentComponent = function getWrappedComponent() { return StubbedContextParent; };

  return StubbedContextHandler;
}

module.exports = {
  stubContext: stubComponentContext,
};
