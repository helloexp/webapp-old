import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-ja';
import CurrentStoreAddress from '../CurrentStoreAddress';

const store = {
  address: {
    currentPickupStore: {
      uq: {
        familyName: 'ラーメッシュ アスウィン',
      },
      gu: null,
    },
  },
  delivery: {
    deliveryTypeApplied: '5',
    deliveryMethodList: {
      1: {
        C: {},
      },
    },
  },
  deliveryStore: {
    pickupStoreData: {
      closed_flg: 0,
    },
  },
};

function mountCurrentStoreAddress(props = {}) {
  return testHelpers.mountWithAll(<CurrentStoreAddress {...props} />, store);
}

describe('pages/Checkout/Delivery/PickupStore/components/CurrentStoreAddress', () => {
  it('should render CurrentStoreAddress component', () => {
    const wrapper = mountCurrentStoreAddress();

    expect(wrapper.length).to.equal(1);
  });

  it('should have Heading component', () => {
    const wrapper = mountCurrentStoreAddress();
    const heading = wrapper.find('Heading');

    expect(heading).to.be.visible; // eslint-disable-line
  });

  it('should have Heading text', () => {
    const wrapper = mountCurrentStoreAddress();
    const heading = wrapper.find('Heading');

    expect(heading.props().headingText).to.equal(i18n.deliveryStore.previousDeliveries);
  });

  it('should have Text component', () => {
    const wrapper = mountCurrentStoreAddress();
    const text = wrapper.find('Text');

    expect(text).to.be.visible; // eslint-disable-line
  });

  it('should have 3 buttons', () => {
    const wrapper = mountCurrentStoreAddress();
    const button = wrapper.find('Button');

    expect(button.length).to.equal(3);
  });

  it('should have button label', () => {
    const wrapper = mountCurrentStoreAddress();
    const button = wrapper.find('Button');

    expect(button.first().props().label).to.equal(i18n.deliveryStore.map);
  });

  it('should have confirm button label', () => {
    const wrapper = mountCurrentStoreAddress();
    const confirmButton = wrapper.find('Button');

    expect(confirmButton.last().props().label).to.equal(i18n.deliveryStore.confirm);
  });
});
