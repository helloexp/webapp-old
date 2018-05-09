const host = 'https://test3-api.fastretailing.com';
const basePath = `${host}/catalog`;

const config = {
  base: basePath,
  version: 'v3',
  region: 'jp',
  client: 'mobileweb',
  language: 'ja',
  productDetail: '/item/detail',
  productList: '/item/list',
};

export default config;
