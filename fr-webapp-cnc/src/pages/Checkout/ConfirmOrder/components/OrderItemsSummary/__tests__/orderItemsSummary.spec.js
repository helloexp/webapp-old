import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import OrderItemsSummary from '../index';

const defaultProps = {
  shipments: [],
  orderNo: '011708071654-20579',
};

function mountItem(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<OrderItemsSummary {...renderProps} />);
}

describe('src/pages/Checkout/ConfirmOrder/components/OrderItemsSummary', () => {
  let wrapper;

  describe('OrderItemsSummary - payment type is not payAtStore', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render OrderItemsSummary component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should show order number heading with link', () => {
      const link = wrapper.find('Link').first();
      const heading = link.find('Heading').last();

      expect(heading.props().headingText).to.equal(`${i18n.orderConfirmation.orderNo} : # 011708071654-20579`);
    });

    it('should show ProductImages component', () => {
      const productImages = wrapper.find('ProductImages');

      expect(productImages.length).to.equal(1);
    });
  });

  describe('OrderItemsSummary - payment type is payAtStore', () => {
    beforeEach(() => {
      wrapper = mountItem({ payAtStore: true });
    });

    it('should not show order number heading with for payAtStore orders', () => {
      const link = wrapper.find('Link');

      expect(link.length).to.equal(0);
    });
  });
});
