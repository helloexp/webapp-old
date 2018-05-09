import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import Button from 'components/uniqlo-ui/Button';
import CreditCardTest from '../index';

const creditInfo = {
  cardHolder: 'dsa',
  cardType: 'VISA/MASTER',
  custNo: '7013926523952',
  dbKey: '0101JP17070620495668303',
  expiry: '2024',
  maskedCardNo: '459150******0000',
  selected: false,
};

function mountItem() {
  return testHelpers.mountWithAll(<CreditCardTest creditCardInfo={creditInfo} error="dfd" />);
}

describe('CreditCard component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render CreditCard', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should have Heading Text', () => {
    const heading = wrapper.find('Heading');

    expect(heading.first().props().headingText).to.equal(i18n.creditCard.heading);
    expect(heading.first().props().type).to.equal('h2');
  });

  it('should have a Button redirecting to ', () => {
    const link = wrapper.find('Link');
    const buttons = wrapper.find(Button);

    expect(link.length).to.equal(2);
    expect(buttons.length).to.equal(4);
  });

  it('Should render SavedCreditCard as default view', () => {
    const SavedCreditCard = wrapper.find('SavedCreditCard');

    expect(SavedCreditCard.length).to.equal(1);
    SavedCreditCard.find(Button).last().simulate('click');

    const hideSavedCreditCard = wrapper.find('SavedCreditCard');

    expect(hideSavedCreditCard.length).to.equal(0);

    const FormDrawer = wrapper.find('FormDrawer');

    expect(FormDrawer.length).to.equal(1);
    expect(FormDrawer.find(Button).at(3).props().label).to.equal(i18n.creditCard.removeCardCancel);

    FormDrawer.find(Button).at(3).simulate('click');
    const hideFormDrawer = wrapper.find('FormDrawer');

    expect(hideFormDrawer.length).to.equal(0);
  });
});
