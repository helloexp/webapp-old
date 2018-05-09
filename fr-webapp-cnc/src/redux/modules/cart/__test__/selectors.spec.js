import expect from 'expect';
import * as selector from '../selectors';

describe('redux/modules/cart/selectors', () => {
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
      },
      gu: {
        cartNumber: null,
        token: null,

        gift: null,
        loaded: false,
        cartLoadError: null,
        minimumFreeShipping: 5000,
        totalAmount: 0,
        totalItems: 0,
        items: [],
        inventoryDetails: [],
      },
      coupon: null,
      defaultGiftBox: {},
      laterItems: [],
      likeItems: [],
      shipments: [],
      cartModel: false,
      isCartLoading: false,
      catalogData: {},
      refreshingCart: false,
    },
    routing: {
      locationBeforeTransitions: {
        query: {
          brand: 'uq',
        },
      },
    },
    productGender: {
      uq: {
        164409: 'MEN',
      },
    },
    gifting: {
      selectedGiftBox: null,
      selectedMessageCard: null,
    },
    auth: {
      user: {
        accessToken: true,
        gdsSession: true,
      },
    },
  };

  const props = {
    brand: 'uq',
  };

  const propsGU = {
    brand: 'gu',
  };

  it('should get brand from props', () => {
    expect(
      selector.getBrand(state, props)
    ).toBe('uq');
  });

  it('should get brand from props - manually changed to gu', () => {
    expect(
      selector.getBrand(state, propsGU)
    ).toBe('gu');
  });

  it('should get default brand', () => {
    expect(
      selector.getBrand(state)
    ).toBe('uq');
  });

  it('should get cart based on brand in props', () => {
    const expectedCart = {
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
    };

    expect(
      selector.getCart(state, props)
    ).toMatch(expectedCart);
  });

  it('should get cart based on brand in props - overriden to gu', () => {
    const expectedCart = {
      cartNumber: null,
      token: null,
      gift: null,
      loaded: false,
      cartLoadError: null,
      minimumFreeShipping: 5000,
      totalAmount: 0,
      totalItems: 0,
      items: [],
      inventoryDetails: [],
    };

    expect(
      selector.getCart(state, propsGU)
    ).toMatch(expectedCart);
  });

  it('should get cart items for brand uq', () => {
    const expectedItems = [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ];

    expect(
      selector.getCartItems(state, props)
    ).toEqual(expectedItems);
  });

  it('should show cart is not empty', () => {
    expect(
      selector.isCartEmpty(state, props)
    ).toBe(false);
  });

  it('should show cart is empty', () => {
    expect(
      selector.isCartEmpty(state, propsGU)
    ).toBe(true);
  });

  it('should show product gender', () => {
    expect(
      selector.getProductGender(state, props)
    ).toMatch({ 164409: 'MEN' });
  });

  it('should get no valid gifts', () => {
    expect(
      selector.getValidGifts(state, props)
    ).toEqual([]);
  });

  it('should get some valid gifts', () => {
    const stateOverride = {
      ...state,
      gifting: {
        selectedGiftBox: 'foo',
        selectedMessageCard: null,
      },
    };

    expect(
      selector.getValidGifts(stateOverride, props)
    ).toContain('foo');
  });

  it('should create structured product groups', () => {
    const prodSelector = selector.createStructuredProductsSelector('promoId');
    const result = prodSelector(state);

    expect(
      result.length
    ).toBeTruthy();
  });

  it('should create valid structured product groups', () => {
    const prodSelector = selector.createStructuredProductsSelector('promoId');
    const result = prodSelector(state);
    const item = { currentSkuId: 1, secondItem: false, id: 1, isMultiBuy: false };

    expect(
      Object.prototype.toString.call(result[0])
    ).toInclude('Array', 'Expected structured product items to be an array');

    expect(
      result[0].length
    ).toBeGreaterThan(0, 'Need at least one group in the array');

    expect(
      result[0][0]
    ).toInclude(item);
  });

  it('should say brand is Uniqlo', () => {
    expect(
      selector.isUniqlo(state, props)
    ).toBe(true);
  });

  it('should say brand is not Uniqlo', () => {
    expect(
      selector.isUniqlo(state, propsGU)
    ).toBe(false);
  });
});
