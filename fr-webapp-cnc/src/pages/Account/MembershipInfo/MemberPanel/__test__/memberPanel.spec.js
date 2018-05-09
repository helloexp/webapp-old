import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import MemberPanel from '../../MemberPanel';

const defaultProps = {
  defaultAddress: {
    email: 'craig@uniqlo.co.jp',
    gender: '01',
    birthday: '19770404',
    lastName: 'カタカナ',
    firstName: 'カタカナ',
    lastNameKatakana: 'カタカナ',
    firstNameKatakana: 'カタカナ',
    prefecture: '富山県',
    city: 'カタカナ',
    street: 'カタカナ',
    apt: 'カタカナ',
    postalCode: '1076231',
    phoneNumber: '9999999999999',
    cellPhoneNumber: '',
    isDefaultShippingAddress: true,
    updateTimestamp: 1499843653,
    cas: '691be10588201366eb14368fc1c91e9d',
    streetNumber: 'カタカナ',
  },
};

function mountItem(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<MemberPanel {...renderProps} />);
}

describe('src/pages/Account/MembershipInfo/MemberPanel', () => {
  let wrapper;
  const editAddress = sinon.spy();

  beforeEach(() => {
    wrapper = mountItem({ editAddress });
  });

  it('should render MemberPanel', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render Panel Component', () => {
    const panel = wrapper.find('Panel');

    expect(panel.length).to.equal(1);
  });

  it('should render edit address Label', () => {
    const label = wrapper.find('Label');

    expect(label.length).to.equal(1);
    expect(label.props().text).to.equal(i18n.membershipInfo.edit);
  });

  it('should trigger callback on clicking edit address Label', () => {
    const label = wrapper.find('Label');

    label.simulate('click');
    expect(editAddress.called).to.equal(true);
  });

  it('should render default address labels and values', () => {
    const label = wrapper.find('Heading');
    const values = wrapper.find('Text');

    expect(label.length).to.equal(13);
    expect(values.length).to.equal(12);
  });
});
