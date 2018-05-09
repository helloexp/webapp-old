const host = 'https://stage-style.uniqlo.com';
const basePath = `${host}/api`;

const config = {
  base: basePath,
  version: 'v0',
  region: 'jp',
  language: 'ja',

  searchItemCode: '/searchItemCode.json',
};

export default config;
