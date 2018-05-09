import React from 'react';
import { expect } from 'chai';
import { init } from 'utils/routing';
import i18n from 'i18n/strings-en';
import ConfirmMySizeTest from '../index';

const state = {
  mySize: {
    selected: { size_id: 's' },
  },
};

const state2 = {
  mySize: {
    selected: null,
  },
};

init({
  region: 'jp',
  router: {
    push: () => {},
  },
});

function mountItem() {
  return testHelpers.mountWithAll(<ConfirmMySizeTest error="error" />, state);
}

describe('ConfirmMySize component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render ConfirmMySizeTest', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should have Heading info', () => {
    const HeadingInfo = wrapper.find('HeadingInfo');

    expect(HeadingInfo.length).to.equal(4);
    expect(HeadingInfo.at(0).props().text).to.equal(i18n.mySize.headingConfirm);
  });

  it('should have Button label', () => {
    const button = wrapper.find('Button');

    expect(button.length).to.equal(2);
    expect(button.first().props().children).to.equal(i18n.mySize.registrationButton);
  });
});
describe('ConfirmMySize component', () => {
  it('should have SizeInner ', () => {
    const wrappers = testHelpers.mountWithAll(<ConfirmMySizeTest error="error" />, state2);
    const SizeInner = wrappers.find('SizeInner');

    expect(SizeInner.length).to.equal(1);
  });
});
