import expect from 'expect';
import applePayReducer, {
  createShippingMethod,
  createShippingContact,
  removeApplePayCookie,
  setApplePayCookie,
  setLoginCookieInvalid,
} from '../applePay';

describe('redux/modules/applePay', () => {
  const initialState = {
    showApplePayLoginPopup: false,
    isLoginCookieInvalid: false,
    deliveryOptions: [],
    shippingMethod: {},
    shippingContact: {},
  };
  const shippingContact = {
    administrativeArea: 'administrativeArea',
    postalCode: 3232323,
    givenName: 'givenName',
    familyName: 'familyName',
    locality: 'locality',
    country: 'Japan',
    addressLines: [
      'addr1',
      'addr2',
    ],
  };
  const shippingMethod = {
    amount: 450,
    detail: 'お届け日は 2017/12/08 (金) で指定されています。',
    identifier: '20171208 00',
    label: '2017/12/08 指定なし',
  };

  it('create shipping contact', () => {
    expect(
      applePayReducer(initialState, createShippingContact(shippingContact))
    ).toMatch({ ...initialState, shippingContact });
  });

  it('create shipping method', () => {
    expect(
      applePayReducer(initialState, createShippingMethod(shippingMethod))
    ).toMatch({ ...initialState, shippingMethod });
  });

  it('remove GA cookie', () => {
    const remvGAcookie = removeApplePayCookie();

    expect(
      applePayReducer(initialState, remvGAcookie)
    ).toMatch(initialState);

    expect(remvGAcookie.cookie.remove).toBe(true);
  });

  it('set GA cookie', () => {
    const setCookie = setApplePayCookie('uq', 'm');

    expect(
      applePayReducer(initialState, setCookie)
    ).toMatch(initialState);

    expect(setCookie.cookie.value).toBe('m');
  });

  it('set login cookie invalid', () => {
    expect(setLoginCookieInvalid().type).toBe('applePay/RESET_COOKIE_TIMER');
  });
});
