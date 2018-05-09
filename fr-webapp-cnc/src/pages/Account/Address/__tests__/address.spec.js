import React from 'react';
import i18n from 'i18n/strings-en';
import { expect } from 'chai';
import Address from '../index.js';

const state = {
  userInfo: {
    userDefaultDetails: {
      gender: '01',
      birthday: '19841225',
      lastName: '小宮',
      firstName: '次雄',
      lastNameKatakana: 'コミヤ',
      firstNameKatakana: 'ツギオ',
      prefecture: '神奈川県',
      city: '横浜市中区寺久保',
      street: '4-4',
      apt: '',
      postalCode: '2310855',
      phoneNumber: '0313744669',
      cellPhoneNumber: '09036282360',
      isDefaultShippingAddress: true,
      updateTimestamp: 1499728840,
      streetNumber: '4-4',
    },
    userInfoAddressList: [
      {
        id: '002',
        lastName: 'サシカタカナカタカナカタ',
        firstName: 'カタカナ',
        lastNameKatakana: 'カタカナ',
        firstNameKatakana: 'カタカナ',
        prefecture: '岩手県',
        city: 'カタカナ',
        street: 'カタカナ',
        apt: 'カタカナ',
        postalCode: '1000001',
        phoneNumber: '1111111111',
        cellPhoneNumber: '1111111111111',
        isDefaultShippingAddress: false,
        updateTimestamp: 1497929782,
        streetNumber: 'カタカナ',
      },
    ],
  },
};

function mountItem(props = {}) {
  return testHelpers.mountWithAll(<Address {...props} />, state);
}

describe('src/pages/Account/Address', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render NoAddressList component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render addressList Heading component correctly', () => {
    const completionComponent = wrapper.find('Heading');

    expect(completionComponent.props().headingText).to.equal(i18n.account.addressList);
  });

  it('should show AddressPanel', () => {
    const addressPanel = wrapper.find('AddressPanel');

    expect(addressPanel.length).to.equal(2);
  });

  it('should show AddressGrid', () => {
    const addressGrid = wrapper.find('AddressGrid');

    expect(addressGrid.length).to.equal(2);
  });

  it('should show back to member button ', () => {
    const backToMember = wrapper.find('Button').last();

    expect(backToMember.props().label).to.equal(i18n.membership.backToMemberShip);
  });

  it('should show add new address button ', () => {
    const addNewAddressButton = wrapper.find('Button').at(5);

    expect(addNewAddressButton.length).to.equal(1);
    expect(addNewAddressButton.props().label).to.equal(i18n.account.newAddress);
  });

  it('should show set as default address confirmation MessageBox', () => {
    const setAsDefaultButton = wrapper.find('Button').at(2);

    setAsDefaultButton.simulate('click');
    const messageBox = wrapper.find('MessageBox');

    expect(messageBox.length).to.equal(1);
    expect(messageBox.props().message).to.equal(i18n.account.selectMessage);
  });

  it('should show set as default address confirmation MessageBox', () => {
    const deleteAddressButton = wrapper.find('Button').at(4);

    deleteAddressButton.simulate('click');
    const messageBox = wrapper.find('MessageBox');

    expect(messageBox.length).to.equal(1);
    expect(messageBox.props().message).to.equal(i18n.account.removeMessage);
  });

  describe('src/pages/Account/Address', () => {
    beforeEach(() => {
      const editAddressButton = wrapper.find('Button').at(1);

      editAddressButton.simulate('click');
    });

    it('should show TSLToolTip ', () => {
      const toolTip = wrapper.find('TSLToolTip');

      expect(toolTip.length).to.equal(1);
    });

    it('should show AddressForm', () => {
      const addressForm = wrapper.find('AddressForm');

      expect(addressForm.length).to.equal(1);
    });

    it('should show confirm address save button ', () => {
      const saveAddress = wrapper.find('Button').first();

      expect(saveAddress.props().label).to.equal(i18n.account.toConfirmationScreen);
    });
  });
});
