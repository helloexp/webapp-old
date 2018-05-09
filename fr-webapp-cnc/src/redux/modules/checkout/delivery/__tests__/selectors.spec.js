import expect from 'expect';
import { setTexts } from 'i18n';
import japanese from 'i18n/strings-ja';
import * as selector from '../selectors';

// Mock i18n texts
setTexts(japanese, 'jp');

describe('redux/modules/checkout/delivery/selectors', () => {
  const props = {};
  const CVSState = {
    auth: {
      user: {
        accessToken: true,
        gdsSession: true,
      },
    },
    cart: {},
    delivery: {
      splitDetails: {},
      deliveryMethod: [{
        deliveryType: '15',
        splitNo: '1',
      }],
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
      deliveryTypeApplied: '15',
      deliveryMethodList: {
        1: {
          C: {
            deliveryDetails: [
              {
                deliveryType: '15',
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
          },
        },
      },
      deliveryTypes: [
        '12',
        '17',
        '5',
        '11',
        '15',
      ],
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
        sevenEleven: {
          addressNumber: '998',
          apt: 'ローソン店舗受取',
          firstName: '盛岡大通３丁目',
          lastName: 'ローソン',
          postalCode: '0200022',
          prefecture: '岩手県',
          street: '盛岡市大通３丁目２－８',
        },
        lawson: {
          addressNumber: '998',
          apt: 'ローソン店舗受取',
          firstName: '盛岡大通３丁目',
          lastName: 'ローソン',
          postalCode: '0200022',
          prefecture: '岩手県',
          street: '盛岡市大通３丁目２－８',
        },
        familyMart: {
          addressNumber: '998',
          apt: 'ローソン店舗受取',
          firstName: '盛岡大通３丁目',
          lastName: 'ローソン',
          postalCode: '0200022',
          prefecture: '岩手県',
          street: '盛岡市大通３丁目２－８',
        },
      },
    },
  };
  const UQState = {
    auth: {
      user: {
        accessToken: true,
        gdsSession: true,
      },
    },
    delivery: {
      splitDetails: {},
      deliveryMethod: [{
        deliveryType: '11',
        splitNo: '1',
      }],
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
      deliveryTypes: [
        '12',
        '17',
        '5',
        '11',
        '15',
      ],
      deliveryMethodList: {
        1: {
          C: {
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
          },
        },
      },
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
        sevenEleven: {
          addressNumber: '998',
          apt: 'ローソン店舗受取',
          firstName: '盛岡大通３丁目',
          lastName: 'ローソン',
          postalCode: '0200022',
          prefecture: '岩手県',
          street: '盛岡市大通３丁目２－８',
        },
        lawson: {
          addressNumber: '998',
          apt: 'ローソン店舗受取',
          firstName: '盛岡大通３丁目',
          lastName: 'ローソン',
          postalCode: '0200022',
          prefecture: '岩手県',
          street: '盛岡市大通３丁目２－８',
        },
        familyMart: {
          addressNumber: '998',
          apt: 'ローソン店舗受取',
          firstName: '盛岡大通３丁目',
          lastName: 'ローソン',
          postalCode: '0200022',
          prefecture: '岩手県',
          street: '盛岡市大通３丁目２－８',
        },
      },
    },
    cart: {
      orderSummary: '1700',
    },
  };
  const familyMartURL = 'http://as.chizumaru.com/famima/s/sphlist?acc=famima2&c4=1&key=岩手県盛岡市大通３丁目２－８&arg=ok_url=null/jp/checkout/payment?brand=uq$$ng_url=null/jp/checkout/delivery?brand=uq$$status=03'; // eslint-disable-line
  const lawsonURL = 'http://test.e-map.ne.jp/smt/jppost15test/?enc=UTF8&ad=岩手県盛岡市大通３丁目２－８&zip=0200022&corpid=f45037&p_s1=null/jp/checkout/payment';
  const sevenElevenURL = 'http://test.e-map.ne.jp/smt/711maptest/s.htm?addr=岩手県盛岡市大通３丁目２－８&p_s1=40017&p_s2=null/jp/checkout/payment?brand=uq&p_s3=null/jp/checkout/delivery?brand=uq&p_s4=012345'; // eslint-disable-line

  it('should get CVS as delivery type', () => {
    expect(
      selector.isDeliveryTypeCvs(CVSState)
    ).toMatch(true);
  });
  it('should get store addresses of familyMart, lawson, sevenEleven', () => {
    expect(
      selector.getCvsStoreAddresses(CVSState)
    ).toMatch({ familyMart: ['盛岡大通３丁目', '〒0200022', '岩手県盛岡市大通３丁目２－８'], lawson: ['盛岡大通３丁目', '〒0200022', '岩手県盛岡市大通３丁目２－８'], sevenEleven: ['盛岡大通３丁目', '〒0200022', '岩手県盛岡市大通３丁目２－８'] }); // eslint-disable-line
  });
  it('should get CVS URLs of familyMart, lawson, sevenEleven', () => {
    expect(
      selector.getCvsUrls(CVSState)
    ).toMatch({ familyMart: familyMartURL, lawson: lawsonURL, sevenEleven: sevenElevenURL });
  });
  it('should get CVS delivery date', () => {
    expect(
      selector.getCvsAddressDeliveryDescription(CVSState, props)
    ).toContain('2016/11/26(土)');
    expect(
      selector.getCvsAddressDeliveryDescription(CVSState, props)
    ).toContain('2016/11/24(木)');
  });
  it('should get delivery fee for CVS delivery type', () => {
    expect(
      selector.getCvsShippingFee(CVSState, props)
    ).toMatch('¥ 250');
  });
  it('should get UQ store as selected', () => {
    expect(
      selector.getIsStorePickupSelected(UQState)
    ).toMatch(true);
  });
  it('should get planned delivery date and time', () => {
    expect(
      selector.getStorePickupDeliveryDate(UQState, props)
    ).toContain('2016/11/24(木)');
    expect(
      selector.getStorePickupDeliveryDate(UQState, props)
    ).toContain('2016/11/26(土)');
  });
  it('should get delivery date and time', () => {
    expect(
      selector.getStorePickupDeliveryDescription(UQState, props)
    ).toContain('2016/11/24(木)');
  });
  it('should get deliveryTypeApplied and deliveryType as STORE_PICKUP', () => {
    expect(
      selector.getPickupStoreShippingFee(UQState, props)
    ).toMatch('¥ 450');
  });
  it('should get return CVS user', () => {
    expect(
      selector.getIfReturnCVSUser(CVSState)
    ).toMatch(true);
  });
  it('should get Available CVS Stores', () => {
    expect(
      selector.getAvailableCvsBrands(CVSState)
    ).toMatch({ familyMart: false, lawson: false, sevenEleven: true });
  });
  it('should have CVS PickUp Available', () => {
    expect(
      selector.getPossibleShippingMethods(CVSState)
    ).toMatch({ isCvs: true, isPickup: true, isShipping: true });
  });
});
