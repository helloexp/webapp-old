import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import i18n from 'i18n/strings-en';
import Confirmation from '../Confirmation';

const fields = {
  address: 'お届け先',
  name: 'お名前',
  katakanaName: 'カタカナ',
  postalCode: '郵便番号※',
  prefecture: '都道府県※',
  street: 'Street*',
  streetNumber: '番地',
  apt: 'Apt. Street, Building',
  phoneNumber: '電話番号※',
  cellPhoneNumber: '携帯電話番号',
  email: 'メールアドレス',
  birthday: '生年月日',
  gender: {
    name: '性別',
  },
  newsLetter: {
    name: 'メールマガジン登録',
    general: 'General',
    men: 'Men',
    women: 'Women',
    kids: 'Kids',
    baby: 'Baby',
    extendedSize: 'Extended size',
    smallSize: 'Small size',
    onlineOrLimitedStore: 'Online store or limited stores editions',
    subscribeAll: 'すべて受信する',
  },
};

describe('pages/Account/Confirmation', () => {
  const setup = props => (

    testHelpers.mountWithAll(<Confirmation {...props} />, {
      i18n: {
        account: {
          register: '登録する',
          backToEntry: '入力画面へ戻る',
        },
        address: {
          address: 'お届け先',
          name: 'お名前',
          lastName: '姓※',
          firstName: '名※',
          katakanaName: 'カタカナ',
          lastNameKatakana: 'セイ',
          firstNameKatakana: 'メイ',
          postalCode: '郵便番号※',
          find: '郵便番号検索',
          prefecture: '都道府県※',
          city: 'シティ',
          street: '市区郡町村',
          streetNumber: '番地',
          apt: 'アパート・マンション名・部屋番号',
          phoneNumber: '電話番号※',
          cellPhoneNumber: '携帯電話番号',
          email: 'メールアドレス',
          birthday: '生年月日',
          gender: {
            name: '性別',
          },
          newsLetter: {
            name: 'メールマガジン登録',
            general: 'ユニクロメールマガジン',
            men: 'ユニクロMENメールマガジン',
            women: 'ユニクロWOMENメールマガジン',
            kids: 'ユニクロKIDSメールマガジン',
            baby: 'ユニクロBABYメールマガジン',
            extendedSize: 'ユニクロ大きいサイズメールマガジン',
            smallSize: 'ユニクロ小さいサイズメールマガジン',
            onlineOrLimitedStore: 'ユニクロオンラインストア・一部店舗取扱い商品メールマガジン',
            subscribeAll: 'すべてを受信する',
          },
        },
        common: {
          update: '更新する',
        },
      },
    })
  );

  it('should render the confirmation view correctly', () => {
    const component = setup({
      addressData: {},
      address: fields,
      isNewAddressReg: false,
    });

    expect(component.length).to.equal(1);
  });

  it('should show confirm address button', () => {
    const wrapper = setup({
      addressData: {},
      address: fields,
      isNewAddressReg: false,
    });
    const confirmAddressButton = wrapper.find('Button').first();

    expect(confirmAddressButton.props().label).to.equal(i18n.common.update);
  });

  it('should trigger confirmAddress callback on clicking confirmAddressButton', () => {
    const confirmAddress = spy();
    const wrapper = setup({
      addressData: {},
      address: fields,
      isNewAddressReg: false,
      confirmAddress,
    });
    const confirmAddressButton = wrapper.find('Button').first();

    confirmAddressButton.simulate('click');
    expect(confirmAddress.calledOnce).to.equal(true);
  });

  it('should show cancel button', () => {
    const wrapper = setup({
      addressData: {},
      address: fields,
      isNewAddressReg: false,
    });
    const cancelButton = wrapper.find('Button').last();

    expect(cancelButton.props().label).to.equal(i18n.account.backToEntry);
  });

  it('should trigger backToNewAddressEntry callback on clicking cancel', () => {
    const backToNewAddressEntry = spy();
    const wrapper = setup({
      addressData: {},
      address: fields,
      isNewAddressReg: true,
      backToNewAddressEntry,
    });
    const cancelButton = wrapper.find('Button').last();

    cancelButton.simulate('click');
    expect(backToNewAddressEntry.calledOnce).to.equal(true);
  });

  it('should trigger backToEntry callback on clicking cancel', () => {
    const backToEntry = spy();
    const wrapper = setup({
      addressData: {},
      address: fields,
      isNewAddressReg: false,
      backToEntry,
    });
    const cancelButton = wrapper.find('Button').last();

    cancelButton.simulate('click');
    expect(backToEntry.calledOnce).to.equal(true);
  });
});
