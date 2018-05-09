import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-ja';
import Delivery from '../index';

const store = {
  delivery: {
    isEditDeliveryAddress: false,
    isEditDeliveryOption: false,
    deliveryTypes: ['5', '11', '15'],
    shippingThreshold: [{ deliveryType: '5' }],
    deliveryMethod: [{ deliveryType: '5', splitNo: '1' }],
    splitDetails: [],
    deliveryStandard: { 1: {} },
    nextDateOptions: { 1: { C: false } },
    currentShippingAddress: {
      firstName: 'カタカナ',
      lastName: 'カタカナ',
      firstNameKatakana: 'カタカナ',
      lastNameKatakana: 'カタカナ',
      prefecture: '富山県',
      city: 'カタカナ',
      street: 'カタカナ',
      streetNumber: 'カタカナ',
      apt: 'カタカナ',
      postalCode: '1076231',
      phoneNumber: '9999999999999',
    },
    updatedDeliveryMethodList: {
      1: {
        C: {
          deliveryRequestedDateTimes: [{ date: '00', timeSlots: ['00'] }],
        },
      },
    },
    deliveryMethodList: {
      1: {
        C: {
          deliveryRequestedDateTimes: [{ date: '00', timeSlots: ['00'] }],
          deliveryTypes: ['5'],
          deliveryDetails: [{ deliveryType: '5', splitDiv: 'C', splitNo: '1' }],
        },
      },
    },
    deliveryPreference: 'C',
  },
};

function mountItem(props = {}) {
  return testHelpers.mountWithAll(<Delivery {...props} />, store);
}

describe('src/pages/Checkout/Delivery', () => {
  let wrapper;
  const editDeliveryMethod = sinon.spy();

  beforeEach(() => {
    wrapper = mountItem({ editDeliveryMethod });
  });

  it('should render Delivery component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render Delivery methods Heading', () => {
    const deliveryHeading = wrapper.find('Heading').first();

    expect(deliveryHeading.props().headingText).to.equal(i18n.heading.deliveryMethod);
  });

  it('should render edit delivery method Button', () => {
    const editDelivery = wrapper.find('Button').first();

    expect(editDelivery.props().children).to.equal(i18n.common.edit);
  });

  it('should render DeliveryMethods method component', () => {
    const deliveryMethods = wrapper.find('DeliveryMethods');

    expect(deliveryMethods.length).to.equal(1);
  });

  it('should render GiftingDeliveryOptions component', () => {
    const giftingDeliveryOptions = wrapper.find('GiftingDeliveryOptions');

    expect(giftingDeliveryOptions.length).to.equal(1);
  });

  it('should render Payment methods Heading', () => {
    const paymentHeading = wrapper.find('Heading').last();

    expect(paymentHeading.props().headingText).to.equal(i18n.heading.paymentMethod);
  });
});
