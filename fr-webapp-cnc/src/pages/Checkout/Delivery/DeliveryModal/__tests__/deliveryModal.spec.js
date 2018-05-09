import React from 'react';
import { expect } from 'chai';
import config from 'config/site/jp.js';
import i18n from 'i18n/strings-ja';
import DeliveryModal from '../index';

function setup(props = {}, store = {}) {
  return testHelpers.mountWithAll(<DeliveryModal {...props} />, store, config, i18n);
}

describe('DeliveryModal component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = setup();
  });

  it('should render DeliveryModal component', () => {
    expect(wrapper.length).to.equal(1);
  });

  describe('isDrawerVisible is set to false', () => {
    beforeEach(() => {
      wrapper = setup({ isDrawerVisible: false });
    });

    it('should not render DrawerModal', () => {
      const DrawerModal = wrapper.find('DrawerModal');

      expect(DrawerModal.length).to.equal(0);
    });
  });

  describe('isDrawerVisible is set to true', () => {
    beforeEach(() => {
      wrapper = setup({ isDrawerVisible: true });
    });

    it('should render DrawerModal', () => {
      const DrawerModal = wrapper.find('DrawerModal');

      expect(DrawerModal.length).to.equal(1);
    });

    it('should render the deliveryDate heading correctly', () => {
      const deliveryDateHeading = wrapper.find('Heading').first();

      expect(deliveryDateHeading.props().headingText).to.equal(i18n.checkout.deliveryDate);
    });

    it('should render the uq brand heading correctly', () => {
      const uqBrandHeading = wrapper.find('Heading').at(1);

      expect(uqBrandHeading.props().headingText).to.equal(i18n.common.uniqlo);
    });

    it('should render the standardDeliveryHeading correctly', () => {
      const standardDeliveryHeading = wrapper.find('Heading').at(2);

      expect(standardDeliveryHeading.props().headingText).to.equal(i18n.checkout.standardDeliveryHeading);
    });

    it('should render the standardDeliveryMessage correctly', () => {
      const standardDeliveryMessage = wrapper.find('Text').first();

      expect(standardDeliveryMessage.props().children).to.equal(i18n.checkout.standardDeliveryMessage);
    });

    it('should render the links for the brand uq correctly', () => {
      const deliveryDateLink = wrapper.find('Link').first();
      const nextDayFaqLink = wrapper.find('Link').at(1);

      expect(deliveryDateLink.props().to).to.equal(config.deliveryUrls.uq.deliveryDateLink);
      expect(deliveryDateLink.props().children).to.equal(i18n.checkout.deliveryDateConditions);
      expect(nextDayFaqLink.props().to).to.equal(config.deliveryUrls.uq.nextDayFaqLink);
      expect(nextDayFaqLink.props().children).to.equal(i18n.checkout.nextDayFaq);
    });

    it('should render the gu brand heading correctly', () => {
      const guBrandHeading = wrapper.find('Heading').at(5);

      expect(guBrandHeading.props().headingText).to.equal(i18n.common.gu);
    });

    it('should render the notSpecifiedDateMessage correctly', () => {
      const notSpecifiedDateMessage = wrapper.find('Text').at(2);

      expect(notSpecifiedDateMessage.props().children).to.equal(i18n.checkout.notSpecifiedDateMessage);
    });

    it('should render the specifiedDateMessage correctly', () => {
      const specifiedDateMessage = wrapper.find('Text').at(3);

      expect(specifiedDateMessage.props().children).to.equal(i18n.checkout.specifiedDateMessage);
    });

    it('should render the links for the brand gu correctly', () => {
      const deliveryDateLink = wrapper.find('Link').at(2);
      const nextDayFaqLink = wrapper.find('Link').at(3);

      expect(deliveryDateLink.props().to).to.equal(config.deliveryUrls.gu.deliveryDateLink);
      expect(deliveryDateLink.props().children).to.equal(i18n.checkout.deliveryDateConditions);
      expect(nextDayFaqLink.props().to).to.equal(config.deliveryUrls.gu.nextDayFaqLink);
      expect(nextDayFaqLink.props().children).to.equal(i18n.checkout.nextDayFaq);
    });
  });
});
