import Config from 'config';

const host = 'https://test3-api.fastretailing.com';
const baseCouponsPath = `${host}/coupon/100/{brand}/${Config.region}`;

const config = {
  host,
  base: baseCouponsPath,
  locale: 'jp',
  region: 'jp',
  brand: 'uq',
  store: 'store',
  url: '/all/for/user',
  consume: '/consume',
  validate: '/validate',
};

export default config;
