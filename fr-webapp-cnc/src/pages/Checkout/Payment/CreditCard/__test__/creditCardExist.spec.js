import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-ja';
import CreditCardExist from '../CreditCardExist';

const defaultProps = {
  i18n,
  savedCreditCard: {
    dbKey: '0101JP17090718391268990',
    cardType: 'VISA/MASTER',
    maskedCardNo: '448450******0001',
    expiry: '0925',
    cardHolder: 'user',
    selected: false,
  },
  temporalCreditCard: {
    isSaveThisCard: 'true',
    expMonth: '9',
    expYear: '2025',
    selected: false,
    cardType: 'visa',
    ccLastFourDigits: '4484500000000002',
    cardCvv: '123',
    name: 'user',
  },
  isEditInProgress: false,
  isDeletePopup: true,
};

function mountItem(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<CreditCardExist {...renderProps} />);
}

describe('src/pages/Checkout/Payment/CreditCard/CreditCardExist', () => {
  let wrapper;

  describe('CreditCardExist - Edit not in progress', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render CreditCardExist component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render CreditCardPreview component for saved credit card', () => {
      const ccPreview = wrapper.find('CreditCardPreview').first();

      expect(ccPreview.props().creditCard).to.eql(defaultProps.savedCreditCard);
    });

    it('should render CreditCardPreview component for temporal credi card', () => {
      const ccPreview = wrapper.find('CreditCardPreview').last();

      expect(ccPreview.props().creditCard).to.eql(defaultProps.temporalCreditCard);
    });

    it('should render MessageBox component', () => {
      const deletePopup = wrapper.find('MessageBox');

      expect(deletePopup.length).to.equal(1);
    });
  });

  describe('CreditCardExist - Edit in progress', () => {
    beforeEach(() => {
      wrapper = mountItem({
        savedCreditCard: {},
        temporalCreditCard: {},
        isDeletePopup: false,
      });
    });

    it('should not render CreditCardPreview component', () => {
      const ccPreview = wrapper.find('CreditCardPreview').last();

      expect(ccPreview.length).to.equal(0);
    });

    it('should render MessageBox component', () => {
      const deletePopup = wrapper.find('MessageBox');

      expect(deletePopup.length).to.equal(0);
    });
  });
});
