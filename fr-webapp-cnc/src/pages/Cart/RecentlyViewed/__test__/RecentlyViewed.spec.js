import React from 'react';
import i18n from 'i18n/strings-en';
import RecentlyViewed from '../../RecentlyViewed';

function mountItem(props) {
  return testHelpers.mountWithAll(
    <WithContext context={{ routerContext: { location: { pathname: '' } } }}>
      <RecentlyViewed {...props} />
    </WithContext>,
    { styleRecommendations: { recentlyViewedData: [{ data1: 'data1' }] } }
  );
}

describe('pages/Cart/RecentlyViewed', () => {
  const navigationTexts = {
    cancelBtnLabel: i18n.common.cancelText,
    confirmBtnLabel: i18n.common.confirmLabel,
    warningMessage: '',
  };
  const wrapper = mountItem({
    brand: 'uq',
    navigationTexts,
    isUniqloStorePayment: true,
    recentlyViewed: [{ data1: 'data1' }],
    recentlyViewedData: [{ data1: 'data1' }],
    productData: [{ data1: 'data1' }],
  });

  it('should render correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render Heading', () => {
    expect(wrapper.find('h3').length).to.equal(1);
  });

  it('should render proper title', () => {
    expect(wrapper.find('h3').text()).to.equal(i18n.cart.recentlyViewedHeading);
  });

  it('should render ProductCardCarousel', () => {
    expect(wrapper.find('ProductCardCarousel').length).to.equal(1);
  });
});
