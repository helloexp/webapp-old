import constants from 'config/site/default';

const host = 'https://test3.uniqlo.com';
const baseUserInfoPath = `${host}/jp/member/v1`;

const config = {
  host,
  base: baseUserInfoPath,
  locale: 'jp',
  region: 'jp',
  brand: 'uq',
  userInfo: '/info.json',
  userInfoAddresses: '/addresses.json',
  defaultShipping: '/addresses/default_shipping',
  updateAddress: '/addresses/',
  storeAddress: {
    uq: `/addresses/store/${constants.UQ_ADDRESS_ID}.json`,
    gu: `/addresses/store/${constants.GU_ADDRESS_ID}.json`,
  },
  sejCvs: `/addresses/convenience_store/${constants.SEJ_ADDRESS_ID}.json`,
  lawsonCvs: `/addresses/convenience_store/${constants.LAWSON_ADDRESS_ID}.json`,
  fmCvs: `/addresses/convenience_store/${constants.FM_ADDRESS_ID}.json`,
};

export default config;
