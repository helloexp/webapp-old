import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-ja';
import PlaceOrder from '../index';

function mountItem(props = {}) {
  return testHelpers.mountWithAll(<PlaceOrder {...props} />);
}

describe('src/pages/Checkout/components/PlaceOrder', () => {
  let wrapper;
  const onPlaceOrder = sinon.spy();

  describe('PlaceOrder component - Button enabled', () => {
    beforeEach(() => {
      wrapper = mountItem({ processOrder: onPlaceOrder });
    });

    it('should render PlaceOrder component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render confirm order message Text', () => {
      const placeOrderHeading = wrapper.find('Text').first();

      expect(placeOrderHeading.props().children).to.equal(i18n.reviewOrder.confirmOrderMessage);
    });

    it('should render enabled PlaceOrder Button', () => {
      const placeOrderButton = wrapper.find('Button');

      expect(placeOrderButton.props().label).to.equal(i18n.reviewOrder.placeOrder);
      expect(placeOrderButton.props().disabled).to.equal(false);
    });

    it('should trigger callback on clicking PlaceOrder Button', () => {
      const placeOrderButton = wrapper.find('Button');

      placeOrderButton.simulate('click');
      expect(onPlaceOrder.called).to.equal(true);
    });
  });
  describe('PlaceOrder component - Button enabled', () => {
    beforeEach(() => {
      wrapper = mountItem({ disabled: true, processOrder: onPlaceOrder });
    });

    it('should render PlaceOrder Button', () => {
      const placeOrderButton = wrapper.find('Button');

      expect(placeOrderButton.props().label).to.equal(i18n.reviewOrder.placeOrder);
      expect(placeOrderButton.props().disabled).to.equal(true);
    });
  });
});
