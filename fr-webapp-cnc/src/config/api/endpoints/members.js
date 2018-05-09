const host = 'https://test3.uniqlo.com';
const region = 'jp';
const baseMembersPath = `${host}/${region}/member`;

const config = {
  host,
  base: baseMembersPath,
  region,
  locale: 'ja',
  brand: 'uq',
  barcode: 'barcode.png',
};

export default config;
