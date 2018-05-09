import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-ja';
import CheckBoxWithToolTip from '../index';

function mountItem() {
  return testHelpers.mountWithAll(<CheckBoxWithToolTip />);
}

describe('CheckBoxWithToolTip component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render CheckBoxWithToolTip component', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render CheckBox component', () => {
    const checkBox = wrapper.find('CheckBox');

    expect(checkBox.length).to.equal(1);
    expect(checkBox.props().label).to.equal(i18n.checkout.useBilling);
  });

  it('should render Button component', () => {
    const button = wrapper.find('Button');

    expect(button.length).to.equal(1);
  });
});
