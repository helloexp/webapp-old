import React from 'react';
import i18n from 'i18n/strings-en';
import BrandHeader from '../../BrandHeader';

const defaultProps = {
  brand: 'uq',
  isUniqlo: true,
  isButtonShown: false,
};

function mountItem(props = {}, store) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<BrandHeader {...renderProps} />, store);
}

describe('src/components/BrandHeader', () => {
  let wrapper;

  describe('Without GoToCart Button', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render BrandHeader component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render Brand Logo correctly', () => {
      const logo = wrapper.find('Image');

      expect(logo.length).to.equal(1);
    });

    it('should show cart products count correctly', () => {
      const count = wrapper.find('Text').first();

      expect(count.length).to.equal(1);
    });

    it('should not render goto cart Button', () => {
      const goToCart = wrapper.find('Button');

      expect(goToCart.length).to.equal(0);
    });
  });

  describe('With GoToCart Button', () => {
    const spy = sinon.spy();

    beforeEach(() => {
      wrapper = mountItem({ isButtonShown: true, goToCart: spy });
    });

    it('should render goto cart Button', () => {
      const goToCart = wrapper.find('Button');

      expect(goToCart.length).to.equal(1);
      expect(goToCart.props().label).to.equal(i18n.cart.viewCart);
    });

    it('should trigger callback when clicking on goToCart button', () => {
      const goToCart = wrapper.find('Button');

      goToCart.simulate('click');

      chai.expect(spy.called).to.equal(true);
    });
  });
});
