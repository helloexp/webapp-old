import React from 'react';
import ProductCard from 'components/ProductCard';
import Text from 'components/uniqlo-ui/Text';
import constants from 'config/site/default';
import siteConfig from 'config/site/us';
import ItemTest from '../index';

const product = {
  alteration: '0',
  color: 'BLACK',
  count: '1',
  currentSkuId: '182706-09-999',
  secondItem: false,
  flagItems: [],
  genderName: 'WOMEN',
  id: '182706',
  image: '//im.uniqlo.com/images/jp/pc/goods/182706/item/09_182706_small.jpg',
  isMultiBuy: false,
  modifySize: '0',
  price: 495,
  promoDtlFlg: '0',
  seqNo: '1',
  sku: '182706',
  title: 'スター・ウォーズワッペン',
  SKUflags: {
    discount: false,
    online_limit: false,
  },
};

const defaultProps = {
  onChange: () => null,
  onRemove: () => null,
  brand: 'uq',
  currentSkuId: '182706-09-999',
  secondItem: false,
  displayBanner: true,
  item: product,
  multiBuyFlag: 'まとめ買い対象',
  promoNm: product.promoNm,
};

function mountItem(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<ItemTest {...renderProps} />);
}

describe('Cart Item', () => {
  it('should pass on length prop to ProductCard if defined', () => {
    chai.expect(mountItem().find(ProductCard).props().product.properties.find(prop => prop.key === 'length')).to.equal(undefined);

    const itemWithLengthDefined = mountItem({ item: { ...product, length: 'something' } })
      .find(ProductCard).props().product.properties.find(prop => prop.key === 'length');

    chai.expect(itemWithLengthDefined).to.not.equal(undefined);
    chai.expect(itemWithLengthDefined.value).to.equal(`${siteConfig.PDP.inseamTypes[product.alteration].lengthLabel}: something`);
  });

  it('should change inseamType when different alteration is passed as prop', () => {
    let alterationType = '0';
    let wrapper = mountItem({ item: { ...product, alteration: alterationType, length: 'something' } });
    let productCardProps = wrapper.find(ProductCard).props().product.properties.find(prop => prop.key === 'length');

    chai.expect(productCardProps.value).to.equal(`${siteConfig.PDP.inseamTypes[alterationType].lengthLabel}: something`);

    alterationType = '1';
    wrapper = mountItem({ item: { ...product, alteration: alterationType, length: 'something' } });
    productCardProps = wrapper.find(ProductCard).props().product.properties.find(prop => prop.key === 'length');
    chai.expect(productCardProps.value).to.equal(`${siteConfig.PDP.inseamTypes[alterationType].lengthLabel}: something`);
  });

  it('should increase the number of props passed on if size or sku or numAlteration is defined', () => {
    let size = null;
    let sku = null;
    let alteration = '0';
    let wrapper = mountItem({ item: { ...product, size, sku, alteration } });
    let productCardProps = wrapper.find(ProductCard).props().product.properties;
    const initialLength = productCardProps.length;

    size = '2';
    wrapper = mountItem({ item: { ...product, size, sku, alteration } });
    productCardProps = wrapper.find(ProductCard).props().product.properties;

    chai.expect(productCardProps.length).to.equal(initialLength);

    sku = 'something';
    wrapper = mountItem({ item: { ...product, size, sku, alteration } });
    productCardProps = wrapper.find(ProductCard).props().product.properties;

    chai.expect(productCardProps.length).to.equal(initialLength + 1);

    alteration = '4';
    wrapper = mountItem({ item: { ...product, size, sku, alteration } });
    productCardProps = wrapper.find(ProductCard).props().product.properties;

    chai.expect(productCardProps.length).to.equal(initialLength + 2);
  });

  it('should have promo section if there is a promo number, displayBanner is true and it is multi buy', () => {
    let wrapper = mountItem({ displayBanner: true, item: { ...product, isMultiBuy: false, promoNm: 'promo' } });
    const initialTextNodesNumber = wrapper.find(Text).length;

    wrapper = mountItem({ displayBanner: true, item: { ...product, isMultiBuy: true, promoNm: 'promo' } });
    chai.expect(wrapper.find(Text).length).to.equal(initialTextNodesNumber + 2);
  });

  it('should have promo section with add more link if there is a promo number,' +
    'displayBanner is true and product promoDtlFlg equal to multiBuy notQualified', () => {
    const { cart: { multiBuy: { notQualified } } } = constants;
    let wrapper = mountItem({ displayBanner: true, item: { ...product, isMultiBuy: false, promoNm: 'promo', promoDtlFlg: notQualified } });
    const initialAnchorNodesNumber = wrapper.find('a').length;

    wrapper = mountItem({ displayBanner: true, item: { ...product, isMultiBuy: true, promoNm: 'promo', promoDtlFlg: notQualified } });
    chai.expect(wrapper.find('a').length).to.equal(initialAnchorNodesNumber);
  });
});
