import { expect } from 'chai';
import config from 'config';
import getSiteConfig from 'config/site';
import * as utils from '../utils';

const siteConfig = getSiteConfig(config.region);

describe('pages/Checkout/Payment/CashDelivery/utils', () => {
  const state = {
    cart: {
      uq: {
        cartNumber: null,
        token: null,
        gift: null,
        loaded: false,
        cartLoadError: null,
        minimumFreeShipping: 5000,
        totalAmount: 0,
        totalItems: 0,
        items: [
          {
            id: 1,
          },
          {
            id: 2,
          },
        ],
        inventoryDetails: [],
        paymentType: '1',
      },
      giftCardFlag: '0',
    },
    routing: {
      locationBeforeTransitions: {
        query: {
          brand: 'uq',
        },
      },
    },
    payment: {
      paymentMethod: siteConfig.payment.cashOnDelivery,
      billingAddress: {},
    },
    giftCard: {
      giftCards: [],
    },
  };

  const props = {
    brand: 'uq',
    giftCardFlag: siteConfig.gds.positive,
    giftCards: [],
  };

  it('should check if credit card payment method is selected', () => {
    expect(
      utils.isSelected(state, props)
    ).to.be.equal(true);

    expect(
      utils.isSelected({
        ...state,
        payment: {
          ...state.payment,
          paymentMethod: siteConfig.payment.giftCard,
        },
      }, props)
    ).to.be.equal(false);
  });
});
