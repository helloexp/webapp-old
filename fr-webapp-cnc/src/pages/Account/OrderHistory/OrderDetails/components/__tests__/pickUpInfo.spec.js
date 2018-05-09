import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import PickUpInfo from '../PickUpInfo';

const defaultProps = {
  convenienceStore: true,
};

function mountItem(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<PickUpInfo {...renderProps} />);
}

describe('src/pages/Account/OrderHistory/components/PickUpInfo', () => {
  let wrapper;

  describe('PickUpInfo - payment type is Lawson or FamilyMart', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render PickUpInfo component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should show InfoToolTip', () => {
      const infoToolTips = wrapper.find('InfoToolTip');

      expect(infoToolTips.length).to.equal(1);
    });

    it('should show CVS store info texts', () => {
      const infoHeading = wrapper.find('Text').first();
      const infoText1 = wrapper.find('Text').at(4);
      const infoText2 = wrapper.find('Text').last();

      expect(infoHeading.props().children).to.equal(i18n.orderHistory.CVSInfoHeading[17]);
      expect(infoText1.props().children).to.equal(i18n.orderHistory.CVSInfoText1[17]);
      expect(infoText2.props().children).to.equal(i18n.orderHistory.CVSInfoText3[17]);
    });
  });

  describe('PickUpInfo - delivery type is SevenEleven', () => {
    beforeEach(() => {
      wrapper = mountItem({ isSevenEleven: true, deliveryType: '15', barcodeURL: 'https://google.com' });
    });

    it('should show SevenEleven info link', () => {
      const infoLink = wrapper.find('Link').first();

      expect(infoLink.props().children).to.equal(i18n.orderHistory.CVSInfoText2[15]);
    });
  });

  describe('PickUpInfo - delivery type is PickupAtUQStore', () => {
    beforeEach(() => {
      wrapper = mountItem({ convenienceStore: false, pickUpStore: true });
    });

    it('should show UQ store info texts', () => {
      const infoTexts = wrapper.find('Text');

      expect(infoTexts.length).to.equal(2);
    });
  });

  describe('PickUpInfo - delivery type is not pickupAtStore or CVS', () => {
    beforeEach(() => {
      wrapper = mountItem({ convenienceStore: false, pickUpStore: false });
    });

    it('should not show PickUpInfo if delivery type is not CVS or UQStore', () => {
      expect(wrapper.html()).to.equal(null);
    });
  });
});
