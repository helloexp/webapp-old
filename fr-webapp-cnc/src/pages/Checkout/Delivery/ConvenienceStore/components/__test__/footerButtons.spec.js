import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import FooterButtons from '../FooterButtons';

describe('FooterButtons component', () => {
  const cvsStore = {
    auth: {
      user: {
        accessToken: true,
        gdsSession: true,
      },
    },
    cart: {},
    delivery: {
      deliveryMethod: {
        deliveryType: '15',
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
      deliveryTypeApplied: '15',
      deliveryMethodList: {
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
        deliveryTypes: [
          '12',
          '17',
          '5',
          '11',
          '15',
        ],
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
  };

  it('should render FooterButtons', () => {
    const wrapper = testHelpers.mountWithAll(<FooterButtons />, cvsStore);

    expect(wrapper.length).to.equal(1);
  });

  it('should render CVS default url for sevenEleven', () => {
    const cvsUrls = 'http://test.e-map.ne.jp/smt/711maptest/s.htm?addr=岩手県盛岡市大通３丁目２－８&p_s1=40017&p_s2=null/jp/checkout/payment?brand=uq&p_s3=null/jp/checkout/delivery?brand=uq&p_s4=012345'; //eslint-disable-line
    const wrapper = testHelpers.mountWithAll(<FooterButtons cvsBrand={'sevenEleven'} />, cvsStore);
    const link = wrapper.find('Link').first().props().to;

    expect(link).to.equal(cvsUrls);
  });

  it('should render CVS default url for familyMart', () => {
    const cvsUrls = 'http://as.chizumaru.com/famima/s/sphlist?acc=famima2&c4=1&key=岩手県盛岡市大通３丁目２－８&arg=ok_url=null/jp/checkout/payment?brand=uq$$ng_url=null/jp/checkout/delivery?brand=uq$$status=03'; //eslint-disable-line
    const wrapper = testHelpers.mountWithAll(<FooterButtons cvsBrand={'familyMart'} />, cvsStore);
    const link = wrapper.find('Link').first().props().to;

    expect(link).to.equal(cvsUrls);
  });

  it('should render select and remove buttons', () => {
    const wrapper = testHelpers.mountWithAll(<FooterButtons />, cvsStore);
    const buttons = wrapper.find('Button');

    expect(buttons.length).to.equal(2);
  });

  it('should render select button', () => {
    const wrapper = testHelpers.mountWithAll(<FooterButtons />, cvsStore);
    const selectButton = wrapper.find('Button').first().props().label;

    expect(selectButton).to.equal(i18n.delivery.selectCvs);
  });

  it('should call on remove button click', () => {
    const onButtonClick = sinon.spy();
    const wrapper = testHelpers.mountWithAll(<FooterButtons removeCvsAddress={onButtonClick} />, cvsStore);

    wrapper.find('Button').last().simulate('click');
    expect(onButtonClick.called).to.equal(true);
  });
});
