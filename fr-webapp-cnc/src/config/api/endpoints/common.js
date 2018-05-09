const host = 'https://test3.uniqlo.com';
const base = `${host}/jp/store/restfulapi/v1`;
const config = {
  host,
  base,
  clientId: 'cms_sp_id',
  clientSecret: 'cms_sp_secret',
  locale: 'jp',
  region: 'jp',
  brand: 'uq',

  getCodeInfo: '/common/code/cd_id',
};

export default config;
