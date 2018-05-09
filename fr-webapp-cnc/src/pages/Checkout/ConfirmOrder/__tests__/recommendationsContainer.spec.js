import React from 'react';
import RecommendationsContainer from '../RecommendationsContainer';

const store = {
  styleRecommendations: {},
  wishlist: {
    all: {
      uq: {
        products: [],
      },
      gu: {
        products: [],
      },
    },
  },
};

const context = {
  routerContext: {
    location: { pathname: '' },
  },
};

const defaultProps = {
  brand: 'uq',
};

function mountItem(props) {
  return testHelpers.mountWithAll(
    <WithContext context={context}>
      <RecommendationsContainer {...defaultProps} {...props} />
    </WithContext>, store
  );
}

describe('src/pages/Checkout/ConfirmOrder/RecommendationsContainer', () => {
  let wrapper;

  it('should render RecommendationsContainer component correctly', () => {
    wrapper = mountItem();
    expect(wrapper.find('RecentlyViewed').length).to.equal(1);
  });

  it('should not render member edit link when isDefaultDetailsComplete prop is true', () => {
    wrapper = mountItem({ isDefaultDetailsComplete: true });
    expect(wrapper.find('Link').length).to.equal(0);
  });

  it('should not render Recommendations when isUniqloBrand is false', () => {
    wrapper = mountItem();
    expect(wrapper.find('Recommendations').length).to.equal(0);
  });

  it('should render Recommendations when isUniqloBrand is true', () => {
    wrapper = mountItem({ isUniqloBrand: true });
    expect(wrapper.find('Recommendations').length).to.equal(1);
  });
});
