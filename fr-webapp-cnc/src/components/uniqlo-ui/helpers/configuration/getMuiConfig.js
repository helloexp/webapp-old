import merge from 'lodash.merge';
import baseConfig from './baseConfig';

export function getCompConfig(overrideConfig) {
  return merge({}, baseConfig, overrideConfig);
}
