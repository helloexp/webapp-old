import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import i18n from 'i18n/strings-en';
import ShippingSummary from '../index';

function mountItem(props = {}) {
  return testHelpers.mountWithAll(<ShippingSummary {...props} />);
}

describe('src/pages/Checkout/ConfirmOrder/components/ShippingSummary', () => {
  let wrapper;

  describe('ShippingSummary - not editable', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render ShippingSummary component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should show Heading', () => {
      const heading = wrapper.find('Heading');

      expect(heading.length).to.equal(1);
      expect(heading.props().headingText).to.equal(i18n.checkout.shippingPreference);
    });

    it('should show shipping preference text', () => {
      const text = wrapper.find('Text');

      expect(text.length).to.equal(1);
    });

    it('should not show edit button if not editable', () => {
      const editButton = wrapper.find('Button');

      expect(editButton.length).to.equal(0);
    });
  });

  describe('ShippingSummary - editable', () => {
    const goToEditPage = spy();

    beforeEach(() => {
      wrapper = mountItem({ editable: true, goToEditPage });
    });

    it('should show edit button if editable', () => {
      const editButton = wrapper.find('Button');

      expect(editButton.length).to.equal(1);
    });

    it('should trigger confirmAddress callback on clicking confirmAddressButton', () => {
      const editButton = wrapper.find('Button');

      editButton.simulate('click');
      expect(goToEditPage.calledOnce).to.equal(true);
    });
  });
});
