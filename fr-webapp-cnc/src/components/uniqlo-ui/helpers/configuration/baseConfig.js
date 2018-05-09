export default {
  carousel: {
    slideDuration: 4000,
  },
  textInput: {
    showHint: true,
  },
  coordinate: {
    styleUrl: 'http://style.uniqlo.com/api/v0/styleDetail.json',
    productLink: 'http://www.uniqlo.com/jp/stylingbook/pc/style/',
  },
  grid: {
    maxCols: 12,
  },
  gridCell: {
    rootClass: 'div',
    colSpan: 1,
    rowSpan: 1,
  },
  modal: {
    dialogHeight: '500px',
    dialogWidth: '500px',
    dialogTopPosition: '50px',
  },
  proxyLink: {
    textDecoration: 'underline',
  },
  productGrid: {
    pdpBaseUrl: '/jp/products/details',
    graphqlMaxCount: 20,
  },
  filter: {
    sizeChart: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'],
  },
  filmStrip: {
    graphqlContent: 'application/graphql',
    graphqlProductUrl: '/catalog/v1/uq/jp/graphql',
    link: '/jp/ja/outfit/',
  },
  collage: {
    graphqlContent: 'application/graphql',
    graphqlProductUrl: '/catalog/v1/uq/jp/graphql',
    link: '/jp/shopbylook/',
  },
};
