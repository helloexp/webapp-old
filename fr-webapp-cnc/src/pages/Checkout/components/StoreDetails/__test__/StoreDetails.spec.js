import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import StoreDetails from '../index';

const currentUQStorePayment = {
  id: 10101527,
  name: 'ユニクロ アトレ目黒店',
  lat: '35.63413374',
  long: '139.7158891',
  distance: '',
  weekDayOpen: '10:00:00',
  weekDayClose: '21:00:00',
  weekendOpen: '10:00:00',
  weekendClose: '21:00:00',
  holidayOpen: '',
  holidayClose: '',
  prefecture: '関東',
  municipality: '品川区',
  city: '東京都',
  number: '上大崎2-16-9',
  irregularOpenHours: '※12/31（土）のみ--10：00－18：00\n※1/1（日）のみ--店休日\n※1/2（月）のみ--10：00－19：00',
  closedDates: '2017/01/01',
  babies: 0,
  kids: 0,
  parking: 1,
  news: 1,
  xl: false,
};
const currentUQStorePickUp = {
  id: 980,
  familyName: 'ユニクロ',
  givenName: '銀座店',
  phoneticFamilyName: 'ユニクロ',
  phoneticGivenName: 'ギンザ',
  prefecture: '東京都',
  city: '中央区',
  address: '銀座６－９－５',
  roomNumber: 'ギンザコマツ東館　１Ｆ－１２Ｆ',
  zipCode: 1040061,
  phoneNumber: '000102383',
  mobilePhoneNumber: '010101397',
  isDefaultShippingAddress: false,
  updateTimestamp: 1483005045,
  cas: 'ad3794d1f3ece639332752d41ad4a13d',
};

function mountItemPay() {
  return testHelpers.mountWithAll(<StoreDetails currentStore={currentUQStorePayment} />);
}

function mountItemPickUp() {
  return testHelpers.mountWithAll(<StoreDetails currentStore={currentUQStorePickUp} />);
}

describe('LinkContainer component', () => {
  it('should render StoreDetails', () => {
    const wrapper = mountItemPay();

    expect(wrapper.length).to.equal(1);
  });
  it('should have div', () => {
    const wrapper = mountItemPickUp();
    const div = wrapper.find('div');

    expect(div.length).to.equal(7);
  });
  it('should have Heading', () => {
    const wrapper = mountItemPickUp();
    const heading = wrapper.find('Heading');

    expect(heading.length).to.equal(1);
  });
  it('should have Text', () => {
    const wrapper = mountItemPickUp();
    const text = wrapper.find('Text');

    expect(text.length).to.equal(4);
  });
  it('should have Text with name in pay at Uniqlo store', () => {
    const wrapper = mountItemPay();
    const text = wrapper.find('Text');

    expect(text.first().props().children).to.equal(`${currentUQStorePayment.name}`);
  });
  it('should have Text test', () => {
    const wrapper = mountItemPay();
    const text = wrapper.find('Text');

    expect(text.at(1).props().children[0]).to.equal(`${currentUQStorePayment.city}`);
  });

  it('should have Text test', () => {
    const wrapper = mountItemPickUp();
    const text = wrapper.find('Text');

    expect(text.at(1).props().children[0]).to.equal(`${currentUQStorePickUp.city}`);
  });
  it('should have Button', () => {
    const wrapper = mountItemPickUp();
    const button = wrapper.find('Button');

    expect(button.length).to.equal(2);
  });

  it('should have Button label', () => {
    const wrapper = mountItemPickUp();
    const button = wrapper.find('Button');

    expect(button.first().props().label).to.equal(i18n.deliveryStore.map);
  });
  it('should call callback when clicking on choose button ', () => {
    const onButtonClick = sinon.spy();
    const wrapper = testHelpers.shallowWithAll(<StoreDetails currentStore={currentUQStorePayment} onChoose={onButtonClick} />);
    const button = wrapper.find('Button');

    button.first().simulate('touchTap');
    expect(onButtonClick.called).to.equal(true);
  });

  it('should call callback when clicking on remove button ', () => {
    const onButtonClick = sinon.spy();
    const wrapper = testHelpers.shallowWithAll(<StoreDetails currentStore={currentUQStorePayment} onRemove={onButtonClick} />);
    const button = wrapper.find('Button');

    button.last().simulate('touchTap');
    expect(onButtonClick.called).to.equal(true);
  });
});
