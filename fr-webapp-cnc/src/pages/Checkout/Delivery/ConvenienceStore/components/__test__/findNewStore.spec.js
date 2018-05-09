import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import FindNewStore from '../FindNewStore';

const userStore = {
  userInfo: {
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
      isDefaultShippingAddress: true,
      lastName: 'カタカナ',
      lastNameKatakana: 'カタカナ',
      phoneNumber: '23689081111',
      postalCode: '1600005',
      prefecture: '岩手県',
      street: 'カタカナ',
      streetNumber: 'カタカナ',
      updateTimestamp: 1479288989,
    },
  },
};

describe('FindNewStore component', () => {
  it('should render FindNewStore', () => {
    const wrapper = testHelpers.mountWithAll(<FindNewStore />, userStore);

    expect(wrapper.length).to.equal(1);
  });

  it('should display button label', () => {
    const wrapper = testHelpers.mountWithAll(<FindNewStore />, userStore);
    const body = wrapper.find('Button').props().label;

    expect(body).to.equal(i18n.delivery.findNewStore);
  });
});
