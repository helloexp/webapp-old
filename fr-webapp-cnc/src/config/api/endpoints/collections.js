const host = 'https://test3-api.fastretailing.com';
const baseCollectionsPath = `${host}/collection/v3`;
const wishlistBasePath = `${host}/collection/v2/{brand}`;

const apiConfig = {
  host,
  base: baseCollectionsPath,
  wishlistBase: wishlistBasePath,
  item: '/item',
  items: '/items',
  style: '/style',
  styles: '/styles',
  stores: '/store',
  summary: '/summary',
  mysize: '/mysize',
  searchTerm: '/searchTerm',
  locale: 'jp',
  region: 'jp',
  brand: 'uq',
};

export default apiConfig;
