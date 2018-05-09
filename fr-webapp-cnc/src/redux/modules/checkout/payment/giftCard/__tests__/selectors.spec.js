import expect from 'expect';
import constants from 'config/site/default';
import * as selector from '../selectors';

const { payment: method } = constants;

describe('redux/modules/checkout/giftCard/selectors', () => {
  const giftCard = {
    index: 0,
    requestNumber: '20161206051549024615',
    number: '9999-xxxx-xxxx-0001',
    balance: 8049637,
    payment: 500,
    expires: '20161231000000',
  };
  const state = {
    routing: {
      locationBeforeTransitions: {
        query: {
          brand: 'uq',
        },
      },
    },
    delivery: {
      deliveryMethod: {
        deliveryType: '',
      },
    },
    cart: {
      uq: {
        totalAmount: 1000,
      },
    },
    giftCard: {
      giftCards: [
        giftCard,
        {
          ...giftCard,
          index: 1,
          payment: 100,
        },
      ],
      giftCard,
    },
  };

  const editingValidGiftCardState = {
    ...state,
    giftCard: {
      ...state.giftCard,
      giftCard: {
        ...giftCard,
        index: undefined,
      },
    },
  };

  it('should get the balance due for applied giftcards', () => {
    expect(
      selector.getBalanceDue(state)
    ).toBe(400);
  });
  it('should return true for the applied giftcard', () => {
    expect(
      selector.isAppliedGiftCard(state, { giftCard })
    ).toBe(true);
  });
  it('should return the balance on the current giftcard', () => {
    expect(
      selector.getBalanceAmount(state, { giftCard })
    ).toBe(500);
  });
  it('should return true if there is additional payment requirement', () => {
    expect(
      selector.isAdditionalPaymentRequired(state)
    ).toBe(true);
  });
  it('should return true the current giftcard is being editing', () => {
    expect(
      selector.isEditingAppliedGiftCard(state, { giftCard })
    ).toBe(true);
  });
  it('should return true a valid giftcard is being editing but not applied', () => {
    expect(
      selector.isEditingValidGiftCard(editingValidGiftCardState)
    ).toBe(true);
  });
  it('should return false when input value is greater than total value', () => {
    const localState = {
      ...state,
      giftCard: {
        ...state.giftCard,
        giftCard: {
          ...giftCard,
          payment: 1500,
        },
      },
    };

    expect(
      selector.isValidGiftCardAmount(localState, { giftCard })
    ).toBe(false);
  });
  it('should return false when input value is zero', () => {
    const localState = {
      ...state,
      giftCard: {
        ...state.giftCard,
        giftCard: {
          ...giftCard,
          payment: 0,
        },
      },
    };

    expect(
      selector.isValidGiftCardAmount(localState, { giftCard })
    ).toBe(false);
  });
  it('should return false when input value is grather than available balance on giftcard', () => {
    const editing = {
      ...giftCard,
      balance: 500,
    };
    const localState = {
      ...state,
      giftCard: {
        ...state.giftCard,
        giftCards: [
          editing,
          {
            ...giftCard,
            index: 1,
            payment: 100,
          },
        ],
        giftCard: {
          ...giftCard,
          payment: 1500,
        },
      },
    };

    expect(
      selector.isValidGiftCardAmount(localState, { giftCard: editing })
    ).toBe(false);
  });
  it('should return false if is not a valid number', () => {
    const editing = {
      ...giftCard,
      balance: 1000,
    };
    const localState = {
      ...state,
      giftCard: {
        ...state.giftCard,
        giftCards: [
          editing,
          {
            ...giftCard,
            index: 1,
            payment: 100,
          },
        ],
        giftCard: {
          ...giftCard,
          payment: 'a5c0b0f',
        },
      },
    };

    expect(
      selector.isValidGiftCardAmount(localState, { giftCard: editing })
    ).toBe(false);
  });
  it('should return true for the last cart applied on props', () => {
    const editing = {
      ...giftCard,
      index: 2,
    };
    const localState = {
      ...state,
      giftCard: {
        ...state.giftCard,
        giftCards: [
          giftCard,
          {
            ...giftCard,
            index: 1,
            payment: 100,
          },
          editing,
        ],
      },
    };

    expect(
      selector.isLastAppliedCard(localState, { giftCard: editing })
    ).toBe(true);
  });
  it('should return false when is not the last cart applied on props', () => {
    const editing = {
      ...giftCard,
      index: 2,
    };
    const localState = {
      ...state,
      giftCard: {
        ...state.giftCard,
        giftCards: [
          giftCard,
          {
            ...giftCard,
            index: 1,
            payment: 100,
          },
          editing,
        ],
      },
    };

    expect(
      selector.isLastAppliedCard(localState, { giftCard })
    ).toBe(false);
  });
  it('should return true when giftcard number and pin are valid', () => {
    const localState = {
      ...state,
      giftCard: {
        ...state.giftCard,
        giftCard: {
          number: '9999100100000001',
          pin: '1234',
        },
      },
    };

    expect(
      selector.isValidNumberAndPin(localState)
    ).toBe(true);
  });
  it('should return false when giftcard pin is invalid', () => {
    const localState = {
      ...state,
      giftCard: {
        ...state.giftCard,
        giftCard: {
          number: '9999100100000001',
          pin: '12',
        },
      },
    };

    expect(
      selector.isValidNumberAndPin(localState)
    ).toBe(false);
  });
  it('should return false when giftcard number is invalid', () => {
    const localState = {
      ...state,
      giftCard: {
        ...state.giftCard,
        giftCard: {
          number: '999910010',
          pin: '1234',
        },
      },
    };

    expect(
      selector.isValidNumberAndPin(localState)
    ).toBe(false);
  });
  it('should return true when giftcard form props is selected', () => {
    const localState = {
      ...state,
      payment: {
        paymentMethod: method.giftCard,
      },
    };

    expect(
      selector.isGiftCardPaymentSelected(localState, { giftCard })
    ).toBe(true);
  });
  it('should return the index from applied giftcard', () => {
    expect(
      selector.getGiftCardIndex(state, { giftCard })
    ).toBe(0);
  });
  it('should return the index from not applied giftcard', () => {
    expect(
      selector.getGiftCardIndex(state, { giftCard: null })
    ).toBe(2);
  });
  it('should return true when billing address is not complete', () => {
    const localState = {
      ...state,
      cart: {
        billingAddress: { },
      },
      userInfo: {
        userDefaultDetails: { },
      },
      giftCard: {
        ...state.giftCard,
        giftCards: [],
      },
    };

    expect(
      selector.shouldShowBillingAddressForm(localState)
    ).toBe(true);
  });
  it('should return true when billing address is complete', () => {
    const localState = {
      ...state,
      giftCard: {
        ...state.giftCard,
        giftCards: [],
      },
      userInfo: {
        userDefaultDetails: { },
      },
      cart: {
        billingAddress: {
          lastName: 'lastName',
          firstName: 'firstName',
          postalCode: '112032',
          prefecture: 'prefecture',
          street: 'street',
          streetNumber: '123',
          phoneNumber: '123454323',
          email: 'test@email.com',
        },
      },
    };

    expect(
      selector.shouldShowBillingAddressForm(localState)
    ).toBe(false);
  });
  it('should return true if is last card and there is no balance due', () => {
    const giftCardFull = {
      ...giftCard,
      payment: 1000,
    };
    const localState = {
      ...state,
      giftCard: {
        ...state.giftCard,
        giftCards: [
          giftCardFull,
        ],
        giftCard: {},
        showContinueButton: true,
      },
    };

    expect(
      selector.shouldShowContinueButton(localState, { giftCard: giftCardFull })
    ).toBe(true);
  });
  it('should return false if there is balance due', () => {
    const giftCardFull = {
      ...giftCard,
      payment: 200,
    };
    const localState = {
      ...state,
      giftCard: {
        ...state.giftCard,
        giftCards: [
          giftCardFull,
        ],
        giftCard: {},
        showContinueButton: true,
      },
    };

    expect(
      selector.shouldShowContinueButton(localState, { giftCard: giftCardFull })
    ).toBe(false);
  });
});
