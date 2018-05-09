import React, { PureComponent, PropTypes } from 'react';
import getSiteConfig from 'config/site';
import getFeatureConfig from 'config/feature';
import { ConfigurationManager } from 'components/uniqlo-ui/helpers/configuration';
import getDisplayName from 'utils/getDisplayName';

const { object } = PropTypes;

export default OriginalComponent => class composedWithRegion extends PureComponent {
  static displayName = `withRegionConfig(${getDisplayName(OriginalComponent)})`;
  static componentName = getDisplayName(OriginalComponent);
  static ComposedComponent = OriginalComponent;

  static propTypes = {
    params: object,
  };

  static contextTypes = {
    config: object,
  };

  static childContextTypes = {
    config: object,
    featureConfig: object,
    compConfig: object,
  };

  getChildContext() {
    const context = this.context;
    const { region, language } = context.config;
    const siteConfig = { region, language, ...getSiteConfig(region) };
    const featureConfig = getFeatureConfig(region);
    const componentConfig = ConfigurationManager.getCompConfig(featureConfig.ComponentConfig);

    return {
      config: { ...context.config, ...siteConfig },
      featureConfig: context.featureConfig || featureConfig,

      compConfig: context.compConfig || componentConfig,
    };
  }

  render() {
    return <OriginalComponent {...this.props} {...this.state} />;
  }
};
