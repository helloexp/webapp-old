import expect from 'expect';
import { setTexts } from 'i18n';
import japanese from 'i18n/strings-ja';
import * as selector from '../selectors';
// Mock i18n texts
setTexts(japanese);
describe('redux/modules/checkout/delivery/store/selectors', () => {
  const props = {
    selectedStore: false,
  };
  const state = {
    auth: {
      user: {
        accessToken: true,
        gdsSession: true,
      },
    },
    delivery: {
      deliveryMethod: {
        deliveryType: '11',
      },
      shippingThreshold: [
        {
          brandCode: '10',
          countryCode: '392',
          deliveryType: '11',
          shippingFee: '450',
          thresholdPrice: '5000',
        },
        {
          brandCode: '10',
          countryCode: '392',
          deliveryType: '15',
          shippingFee: '250',
          thresholdPrice: '5000',
        },
      ],
      deliveryTypeApplied: '11',
      deliveryMethodList: {
        deliveryDetails: [
          {
            deliveryType: '11',
            limitDatetime: '20161121201245',
            plannedDateFrom: '20161124000000',
            plannedDateTo: '20161126000000',
            plannedTime: '0',
            spareDate: '0',
          },
          {
            deliveryType: '17',
            limitDatetime: '20161121201245',
            plannedDateFrom: '20161124000000',
            plannedDateTo: '20161126000000',
            plannedTime: '15',
            spareDate: '0',
          },
        ],
        deliveryRequestedDateTimes: [
          {
            date: '20161126',
            timeSlots: [
              '00',
              '03',
              '04',
              '05',
              '06',
            ],
          },
          {
            date: '20161127',
            timeSlots: [
              '00',
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
            ],
          },
        ],
        deliveryTypes: [
          '12',
          '17',
          '5',
          '11',
          '15',
        ],
      },
    },
    deliveryStore: {
      stateCode: '0',
      states: {
        1: {
          en: 'Hokkaidō',
          name: '北海道',
          iso: 'JP-01',
          google_value: '1',
        },
        2: {
          en: 'Aomori',
          name: '青森県',
          iso: 'JP-02',
          google_value: '2',
        },
        3: {
          en: 'Akita',
          name: '秋田県',
          iso: 'JP-05',
          google_value: '5',
        },
      },
      stores: ['1', '2'],
    },
    order: {
      orderSummary: '1700',
    },
    routing: {
      locationBeforeTransitions: {
        query: {
          brand: 'uq',
        },
      },
    },
    userInfo: {
      userDefaultDetails: {
        apt: 'カタカナ',
        birthday: '19941125',
        cas: 'e1fc286a8a5c383d6797579f30f175d1',
        cellPhoneNumber: '2368908965',
        city: 'カタカナ',
        email: 'abc@mail.com',
        firstName: 'カタカナ',
        firstNameKatakana: 'カタカナ',
        gender: '02',
        isDefaultShippingAddress: false,
        lastName: 'カタカナ',
        lastNameKatakana: 'カタカナ',
        phoneNumber: '23689081111',
        postalCode: '1600005',
        prefecture: '岩手県',
        street: 'カタカナ',
        streetNumber: 'カタカナ',
        updateTimestamp: 1479288989,
      },
      userInfoAddressList: [{
        apt: 'カタカナ',
        cas: 'fff3c853c3ce1e4f6d759eb5b3e89fff',
        cellPhoneNumber: '23689089766',
        city: 'カタカナ',
        firstName: 'カタカナ',
        firstNameKatakana: 'カタカナ',
        id: '002',
        isDefaultShippingAddress: true,
        lastName: 'カタカナ',
        lastNameKatakana: 'カタカナ',
        phoneNumber: '4566666777776',
        postalCode: '1600005',
        prefecture: '岩手県',
        street: 'カタカナ',
        streetNumber: 'カタカナ',
        updateTimestamp: 1478689937,
      }],
      cvsAddress: {
        addressNumber: '998',
        apt: 'ローソン店舗受取',
        firstName: '盛岡大通３丁目',
        lastName: 'ローソン',
        postalCode: '0200022',
        prefecture: '岩手県',
        street: '盛岡市大通３丁目２－８',
      },
    },
    cart: {
      orderSummary: '1700',
    },
  };

  it('should get state codes', () => {
    expect(
      selector.getStateCodes(state)
    ).toMatch(['1', '2', '3']);
  });
  it('should get store', () => {
    expect(
      selector.getStoreMarkers(state, props)
    ).toMatch(['1', '2']);
  });
  it('should get prefecture availability', () => {
    expect(
      selector.getPrefectureAvaliable(state)
    ).toMatch(false);
  });
  it('should get prefecture', () => {
    expect(
      selector.getPrefecture(state)
    ).toMatch('都道府県で検索');
  });
});
