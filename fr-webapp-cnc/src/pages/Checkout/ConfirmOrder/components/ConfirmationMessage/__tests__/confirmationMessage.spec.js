import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import ConfirmationMessage from '../index';

function mountItem(props = { showToolTip: true }) {
  return testHelpers.mountWithAll(<ConfirmationMessage {...props} />);
}

describe('src/pages/Checkout/ConfirmOrder/components/ConfirmationMessage', () => {
  let wrapper;

  describe('ConfirmationMessage - payment type is not payAtStore', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render ConfirmationMessage component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should show order completion heading', () => {
      const heading = wrapper.find('Heading');

      expect(heading.props().headingText).to.equal(i18n.orderConfirmation.orderCompletion);
    });

    it('should show order confirmation message Text', () => {
      const confirmationMessage = wrapper.find('Text').first();

      expect(confirmationMessage.props().children).to.equal(i18n.orderConfirmation.confirmationMsg);
    });

    it('should show InfoToolTip', () => {
      const infoToolTip = wrapper.find('InfoToolTip').last();

      expect(infoToolTip.length).to.equal(1);
    });

    it('should show order completion message Text', () => {
      const completionMessage = wrapper.find('Text').last();

      expect(completionMessage.props().children).to.equal(i18n.orderConfirmation.completionMsg);
    });
  });

  describe('ConfirmationMessage - payment type is payAtStore', () => {
    beforeEach(() => {
      wrapper = mountItem({ paymentType: 'B' });
    });

    it('should not render MessageTexts component', () => {
      const productImages = wrapper.find('MessageTexts');

      expect(productImages.length).to.equal(0);
    });
  });
});
