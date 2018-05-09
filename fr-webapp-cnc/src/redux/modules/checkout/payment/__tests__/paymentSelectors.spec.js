import expect from 'expect';
import constants from 'config/site/default';
import * as selector from '../selectors';

const { STORE_PICKUP } = constants.deliveryTypes;

describe('redux/modules/checkout/delivery/selectors', () => {
  const trueState = {
    giftCard: { giftCards: [] },
    cart: {
      billingAddress: {},
    },
    delivery: {
      deliveryMethod: [{
        deliveryType: STORE_PICKUP,
        splitNo: '1',
      }],
    },
  };

  const falseState = {
    giftCard: { giftCards: [] },
    cart: {
      billingAddress: {
        lastName: 'dummy',
        firstName: 'dummy',
        postalCode: 'dummy',
        phoneNumber: 'dummy',
        email: 'dummy',
      },
    },
    delivery: {
      deliveryMethod: [],
    },
  };

  it('should return true if the billing address need to be saved', () => {
    expect(selector.shouldShowBillingAddressFormForNewUserStoresSelection(trueState)).toBe(true);
  });

  it('should return false if the billing address is complete', () => {
    expect(selector.shouldShowBillingAddressFormForNewUserStoresSelection(falseState)).toBe(false);
  });
});
