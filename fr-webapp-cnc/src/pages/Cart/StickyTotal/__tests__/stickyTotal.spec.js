import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import StickyTotal from '../index';

let wrapper;
const defaultState = {
  cart: {
    uq: {
      loaded: false,
      minimumFreeShipping: 5000,
      totalAmount: 0,
      paymentAmount: 0,
      totalItems: 0,
      items: [
      ],
      inventoryDetails: {
      },
      shippingFeeWorkaround: true,
      orderSummary: {
      },
    },
    gu: {
      loaded: false,
      minimumFreeShipping: 5000,
      totalAmount: 0,
      paymentAmount: 0,
      totalItems: 0,
      items: [
      ],
      inventoryDetails: {
      },
      shippingFeeWorkaround: true,
    },
    defaultGiftBox: {
    },
    laterItems: [
    ],
    likeItems: [
    ],
    shipments: [
    ],
    cartModel: false,
    isCartLoading: false,
    catalogData: {
    },
    refreshingCart: false,
    selectedDeliveryType: 'none',
    checkoutBrand: 'uq',
    giftIdCookie: {
    },
    giftCookie: {
    },
    isShown: false,
  },
};

function setup(props = {}) {
  return testHelpers.mountWithAll(<StickyTotal {...props} />, defaultState);
}

describe('src/pages/Cart/StickyTotal', () => {
  beforeEach(() => {
    wrapper = setup();
  });
  it('should render StickyTotal component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });
  it('should render checkout button', () => {
    const button = wrapper.find('Button');

    expect(button.length).to.equal(1);
    expect(button.props().label).to.equal(i18n.cart.checkout);
  });
  it('should render shipping message', () => {
    const texts = wrapper.find('Text');

    expect(texts.length).to.equal(4);
    expect(texts.first().props().content).to.equal(i18n.cart.stickyTotalMessageLess);
  });
});
