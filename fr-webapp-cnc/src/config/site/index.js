import defaultConfig from './default';

let siteConfig = { ...defaultConfig };

export const setSiteConfig = config => (siteConfig = { ...defaultConfig, ...config });

const getSiteConfig = () => siteConfig;

export default getSiteConfig;
