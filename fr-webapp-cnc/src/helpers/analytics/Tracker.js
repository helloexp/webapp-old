// Decorator for injecting analytics method and hitType to component
// Receive the context and pass it as props to the wrapped component
import React, { Component, PropTypes } from 'react';

const { object, func } = PropTypes;

export default OriginalComponent => class Tracker extends Component {

  static contextTypes = {
    track: func.isRequired,
    hitType: object.isRequired,
  };
  static displayName = OriginalComponent.displayName || OriginalComponent.name;
  render() {
    const props = {};

    Object.assign(props, this.props, {
      track: this.context.track,
      hitType: this.context.hitType,
    });

    return <OriginalComponent {...props} {...this.state} />;
  }
};
