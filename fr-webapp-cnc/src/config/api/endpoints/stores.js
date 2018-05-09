const host = 'https://test3-store.fastretailing.com';
const baseStorePath = `${host}/api`;

const config = {
  host,
  base: baseStorePath,
  version: '200',
  locale: 'jp',
  region: 'jp',
  brand: {
    uq: 'uniqlo',
    gu: 'gu',
  },
  referrer: 'test',

  storeList: '/getStoreList.json',
  storeDetail: '/getStoreDetail.json',
};

export default config;
