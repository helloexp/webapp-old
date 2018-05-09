import defaultConfig from './default';
import JPConfig from './jp';
import TWConfig from './tw';
import EUConfig from './eu';
import USConfig from './us';

const getFeatureConfig = (region) => {
  const configs = {
    jp: JPConfig,
    tw: TWConfig,
    eu: EUConfig,
    us: USConfig,
  };

  return { ...defaultConfig, ...configs[region] };
};

export default getFeatureConfig;
