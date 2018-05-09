import React from 'react';
import { prependRoot } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import { brandName } from 'config/site/default';
import Footer from 'components/Footer';
import FooterContainer from '../index';

function mountItem({ pathname = '', brand = brandName.uq, renderProps = {} }) {
  const state = {
    routing: {
      locationBeforeTransitions: {
        pathname,
        query: {
          brand,
        },
      },
    },
  };

  return testHelpers.mountWithAll(<FooterContainer {...renderProps} />, state);
}

describe('containers/Footer', () => {
  it('should show footer for components type A, B, C, D, E, not for F)', () => {
    chai.expect(
      mountItem({ pathname: prependRoot(routes.checkout) }).find(Footer).prop('isFooterShown')
    ).to.equal(true);

    chai.expect(
      mountItem({ pathname: '' }).find(Footer).prop('isFooterShown')
    ).to.equal(false);
  });

  it('should render only UQ copyright for type B)', () => {
    const wrapper = mountItem({ pathname: prependRoot(routes.checkout) });
    const component = wrapper.find(Footer);

    chai.expect(component.prop('isBrandTabsShown')).to.equal(false);
    chai.expect(component.prop('isLinksSectionShown')).to.equal(false);
    chai.expect(component.prop('copyrightBrands').length).to.equal(1);
    chai.expect(component.prop('copyrightBrands')[0]).to.equal('uq');

    const guComponent = mountItem({ pathname: prependRoot(routes.checkout), brand: brandName.gu }).find(Footer);

    chai.expect(component.prop('copyrightBrands').length).to.equal(1);
    chai.expect(guComponent.prop('copyrightBrands')[0]).to.equal('gu');
  });

  it('should render only UQ copyright for type C)', () => {
    const wrapper = mountItem({ pathname: prependRoot(routes.creditCard) });
    const component = wrapper.find(Footer);

    chai.expect(component.prop('isBrandTabsShown')).to.equal(false);
    chai.expect(component.prop('isLinksSectionShown')).to.equal(false);
    chai.expect(component.prop('copyrightBrands').length).to.equal(2);
  });
});
