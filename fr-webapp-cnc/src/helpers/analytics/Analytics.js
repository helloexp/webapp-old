/* eslint-disable global-require, import/no-dynamic-require */
// Decorator used on top level component - Used in Application Wrapper (App Component)
// Initializes the analytics and pass the analytics function and hitTypes as context
import React, { Component, PropTypes } from 'react';
import ganalytics, { hitType } from 'utils/analytics';
import { isAnalyticsDisabledRoute } from 'utils/routing';
import getSiteConfig from 'config/site';

const { object, element, func } = PropTypes;

export default OriginalComponent => class Analytics extends Component {
  static propTypes = {
    children: element,
    location: object,
  };

  static childContextTypes = {
    track: func.isRequired,
    hitType: object.isRequired,
  };

  static contextTypes = {
    config: object.isRequired,
  };

  static displayName = OriginalComponent.displayName || OriginalComponent.name;

  getChildContext() { // eslint-disable-line class-methods-use-this
    return {
      track: ganalytics.track,
      hitType,
    };
  }

  componentWillMount() {
    const config = getSiteConfig();

    if (!isAnalyticsDisabledRoute()) {
      ganalytics.init(config.ANALYTICS.code, config.ANALYTICS.appName);
    }
  }

  render() {
    return <OriginalComponent {...this.props} {...this.state} />;
  }
};
