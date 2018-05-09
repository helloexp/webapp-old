const host = 'https://test3-api.fastretailing.com';
const gdsHost = 'https://test3.uniqlo.com';

const baseAccountsPath = `${host}/identity/v1`;
const updateBaseHost = `${gdsHost}/jp/store/restful/api/put/v1`;

const config = {
  host,
  gdsHost,
  base: baseAccountsPath,
  putBase: updateBaseHost,
  locale: 'jp',
  region: 'jp',
  brand: 'uq',
  clientid: 'profile-jp',
  memberid: '/memberid',
  requestToken: '/token',
  addresses: '/address',
  gdsAccess: '/store/FSC01010E02.do',
  logout: '/auth/logout',
  linkage: '/linkage',
  loginPreparation: '/customer/login_preparation',
  defaultShipping: 'default_shipping',
  clientsecret: 'profile-secret',
};

export default config;
