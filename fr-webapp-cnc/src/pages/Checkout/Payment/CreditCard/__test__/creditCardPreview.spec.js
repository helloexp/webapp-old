import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-ja';
import CreditCardPreview from '../CreditCardPreview';

const defaultProps = {
  creditCard: {
    dbKey: '0101JP17090718391268990',
    cardType: 'VISA/MASTER',
    maskedCardNo: '448450******0001',
    expiry: '0925',
    cardHolder: 'user',
    selected: false,
  },
};

function mountItem(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<CreditCardPreview {...renderProps} />);
}

describe('src/pages/Checkout/Payment/CreditCard/CreditCardPreview', () => {
  let wrapper;
  const onSelect = sinon.spy();
  const onDelete = sinon.spy();

  beforeEach(() => {
    wrapper = mountItem({ selectCard: onSelect, confirmDelete: onDelete });
  });

  it('should render CreditCardPreview component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render CreditCardTile component', () => {
    const ccTile = wrapper.find('CreditCardTile');

    expect(ccTile.length).to.equal(1);
  });

  it('should render select credit card Button', () => {
    const selectButton = wrapper.find('Button').first();

    expect(selectButton.props().children[1]).to.equal(i18n.payment.choice);
  });

  it('should trigger callback on clicking select creditcard Button', () => {
    const selectButton = wrapper.find('Button').first();

    selectButton.simulate('click');
    expect(onSelect.called).to.equal(true);
  });

  it('should trigger callback on clicking delete creditcard Button', () => {
    const deleteButton = wrapper.find('Button').last();

    deleteButton.simulate('click');
    expect(onDelete.called).to.equal(true);
  });
});
