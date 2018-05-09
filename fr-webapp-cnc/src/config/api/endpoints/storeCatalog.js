const host = 'https://api.fastretailing.com';
const baseStorePath = `${host}/catalog`;

const config = {
  host,
  base: baseStorePath,
  version: 'v2',
  locale: 'jp',
  region: 'jp',
  brand: 'uq',
  referrer: 'test',

  storeList: '/store/status',
};

export default config;
