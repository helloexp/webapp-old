import React from 'react';
import i18n from 'i18n/strings-en';
import If from 'components/uniqlo-ui/If';
import Footer from '../index';
import BrandTabs from '../BrandTabs';
import BrandLinks from '../BrandLinks';

function mountItem(props = {}) {
  const renderProps = {
    isFooterShown: true,
    brand: 'uq',
    copyrightBrands: [],
    isBrandTabsShown: true,
    isLinksSectionShown: true,
    isLinksTopBorderShown: true,
    ...props,
  };

  return testHelpers.shallowWithAll(<Footer {...renderProps} />);
}

describe('components/Footer', () => {
  it('should show footer section', () => {
    chai.expect(
      mountItem().find('footer').length
    ).to.equal(1);

    chai.expect(
      mountItem({ isFooterShown: false }).find('footer').length
    ).to.equal(0);
  });

  it('should show brand tabs section', () => {
    chai.expect(
      mountItem().find(If).findWhere(ifComponent => ifComponent.props().then === BrandTabs).props().if
    ).to.equal(true);

    chai.expect(
      mountItem({ isBrandTabsShown: false }).find(If).findWhere(ifComponent => ifComponent.props().then === BrandTabs).props().if
    ).to.equal(false);
  });

  it('should show brand links section', () => {
    chai.expect(
      mountItem().find(If).findWhere(ifComponent => ifComponent.props().then === BrandLinks).props().if
    ).to.equal(true);

    chai.expect(
      mountItem({ isLinksSectionShown: false }).find(If).findWhere(ifComponent => ifComponent.props().then === BrandLinks).props().if
    ).to.equal(false);
  });

  it('should show copyright section', () => {
    const copyrightI18n = i18n.common.copyright;

    const noBrands = mountItem({ copyrightBrands: [] });

    chai.expect(
      noBrands.findWhere(n =>
        n.text() === copyrightI18n.uq).length
    ).to.equal(0);

    chai.expect(
      noBrands.findWhere(n =>
        n.text() === copyrightI18n.gu).length
    ).to.equal(0);

    const uqBrand = mountItem({ copyrightBrands: ['uq'] });

    chai.expect(
      uqBrand.findWhere(n =>
        n.children().length === 0 && n.text() === copyrightI18n.uq).length
    ).to.equal(1);

    chai.expect(
      uqBrand.findWhere(n =>
        n.children().length === 0 && n.text() === copyrightI18n.gu).length
    ).to.equal(0);

    const guBrand = mountItem({ copyrightBrands: ['gu'] });

    chai.expect(
      guBrand.findWhere(n =>
        n.children().length === 0 && n.text() === copyrightI18n.uq).length
    ).to.equal(0);

    chai.expect(
      guBrand.findWhere(n =>
        n.children().length === 0 && n.text() === copyrightI18n.gu).length
    ).to.equal(1);

    const bothBrands = mountItem({ copyrightBrands: ['uq', 'gu'] });

    chai.expect(
      bothBrands.findWhere(n =>
        n.children().length === 0 && n.text() === copyrightI18n.uq).length
    ).to.equal(1);

    chai.expect(
      bothBrands.findWhere(n =>
        n.children().length === 0 && n.text() === copyrightI18n.gu).length
    ).to.equal(1);
  });
});
