import expect from 'expect';
import { LocalStorage } from 'helpers/WebStorage';
import {
  isApplePaySessionAvailable,
  applePayVersion,
  canMakePayments,
  getRequiredShippingContactFields,
  getPaymentRequestObj,
  createShippingMethodObject,
  getErrorsForInvalidFields,
  checkIfApplePayGuestUserInConfirmPage,
  getGuestUserOrderDeliveryString,
} from '../applePay';

const dateOptions = [
  {
    delv_dt: '20171208',
    delv_time_list: [
      '00',
    ],
  },
];

const dateOptions2 = [
  {
    delv_time_list: [
      '00',
    ],
  },
];

const dateOptions3 = [
  {
    delv_time_list: [
      '06',
    ],
  },
];

const dateOptions4 = [
  {
    delv_dt: '20171208',
    delv_time_list: [
      '06',
    ],
  },
];

const dateOptions5 = [
  {
    delv_dt: '20171208',
    delv_time_list: [
      0,
    ],
  },
];

describe('applePay', () => {
  it('isApplePaySessionAvailable', () => {
    expect(isApplePaySessionAvailable).toBe(true);
  });

  it('canMakePayments', () => {
    expect(canMakePayments).toBe(true);
  });

  it('applePayVersion for version 3', () => {
    expect(applePayVersion).toBe(3);
  });

  it('getRequiredShippingContactFields', () => {
    expect(getRequiredShippingContactFields()).toEqual(['postalAddress', 'name', 'phone', 'email']);
  });

  it('getPaymentRequestObj', () => {
    const PaymentReqObj = {
      countryCode: 'JP',
      currencyCode: 'JPY',
      lineItems: [
        {
          amount: '15079',
          label: '商品合計',
        },
        {
          amount: '150',
          label: 'ギフト料',
        },
        {
          amount: '0',
          label: '送料',
        },
        {
          amount: '1218',
          label: '消費税',
        },
        {
          amount: '-2',
          label: '奉仕額',
        },
      ],
      merchantCapabilities: [
        'supports3DS',
      ],
      requiredShippingContactFields: [
        'postalAddress',
        'name',
        'phone',
        'email',
      ],
      supportedNetworks: [
        'amex',
        'jcb',
        'masterCard',
      ],
      total: {
        amount: '16449',
        label: 'ユニクロ',
      },
    };

    expect(getPaymentRequestObj({
      totalMerchandise: 15079,
      giftFee: 150,
      shippingCost: 0,
      additionalCharges: {
        consumptionTax: 1218,
        serviceAmount: 2,
      },
      paymentsAmt: 16449,
    })).toEqual(PaymentReqObj);
  });

  it('createShippingMethodObject without selected time', () => {
    expect(createShippingMethodObject(dateOptions, 450)).toEqual(
      [
        {
          amount: '450',
          detail: '',
          identifier: '20171208 00',
          label: '2017/12/08 指定なし',
        },
      ]
    );
  });

  it('createShippingMethodObject without delv_dt and selected time', () => {
    expect(createShippingMethodObject(dateOptions2, 450)).toEqual(
      [
        {
          amount: '450',
          detail: '',
          identifier: '00 00',
          label: '日時指定なし',
        },
      ]
    );
  });

  it('createShippingMethodObject without delv_dt', () => {
    expect(createShippingMethodObject(dateOptions3, 450)).toEqual(
      [
        {
          amount: '450',
          detail: '',
          identifier: '00 06',
          label: '指定なし 18:00～20:00',
        },
      ]
    );
  });

  it('createShippingMethodObject', () => {
    expect(createShippingMethodObject(dateOptions4, 450)).toEqual(
      [
        {
          amount: '450',
          detail: '',
          identifier: '20171208 06',
          label: '2017/12/08 18:00～20:00',
        },
      ]
    );
  });

  it('createShippingMethodObject with selected time as 0', () => {
    expect(createShippingMethodObject(dateOptions5, 450)).toEqual(
      [
        {
          amount: '450',
          detail: '',
          identifier: '20171208 00',
          label: '2017/12/08 0',
        },
      ]
    );
  });

  it('getErrorsForInvalidFields', () => {
    // all clean
    expect(getErrorsForInvalidFields({
      administrativeArea: 'administrativeArea',
      postalCode: 3232323,
      givenName: 'givenName',
      familyName: 'familyName',
      phoneticFamilyName: 'フリガナ',
      locality: 'locality',
      country: 'Japan',
      addressLines: [
        'addr1',
        'addr2',
      ],
    })).toEqual([{ message: '無効な都道府県', contactField: 'administrativeArea' }]);

    // special case of version2- addresslines
    expect(getErrorsForInvalidFields({
      administrativeArea: 'administrativeArea',
      postalCode: 3232323,
      givenName: 'givenName',
      familyName: 'familyName',
      phoneticFamilyName: 'フリガナ',
      locality: 'locality',
      country: 'Japan',
    }, false)).toEqual([{ message: '番地を入力してください。', contactField: 'addressLines' }]);

    // failing things
    expect(getErrorsForInvalidFields({
      administrativeArea: '',
      postalCode: 323,
      givenName: '',
      familyName: '',
      locality: 'locality',
      country: 'Japan',
      phoneNumber: 3333,
      addressLines: [
        'addr1',
        'addr2',
      ],
    })).toEqual([
      {
        contactField: 'administrativeArea',
        message: '都道府県を入力してください。',
      },
      {
        contactField: 'postalCode',
        message: '郵便番号は半角7桁で入力してください',
      },
      {
        contactField: 'name',
        message: '名を入力してください。',
      },
      {
        contactField: 'phoneNumber',
        message: '電話番号はハイフンなしの半角数字13桁以内で入力してください',
      },
    ]);
  });

  it('checkIfApplePayGuestUserInConfirmPage', () => {
    LocalStorage.setItem('applePayFlag', true);
    expect(checkIfApplePayGuestUserInConfirmPage('checkout/order/confirm')).toBe(true);
    LocalStorage.removeItem('applePayFlag');
  });

  it('getGuestUserOrderDeliveryString when timeFrame is not selected', () => {
    expect(getGuestUserOrderDeliveryString('20181010 00')).toBe('2018/10/10(水) にお届け予定');
  });

  it('getGuestUserOrderDeliveryString when both timeFrame and date are selected', () => {
    expect(getGuestUserOrderDeliveryString('20181010 06')).toBe('2018/10/10(水) 18:00～20:00 にお届け予定');
  });

  it('getGuestUserOrderDeliveryString when date is not selected', () => {
    expect(getGuestUserOrderDeliveryString('00 06')).toBe('18:00～20:00 にお届け予定');
  });

  it('getGuestUserOrderDeliveryString when nothing is selected (no user selection)', () => {
    expect(getGuestUserOrderDeliveryString()).toBe('');
  });
});
