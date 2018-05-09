import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import CheckBoxWithToolTip from '../CheckBoxWithToolTip';

let wrapper;
const store = {
  i18n,
  delivery: {
    setOption: {
      shouldSetBillingAddress: true,
    },
  },
};

function setup() {
  return testHelpers.mountWithAll(<CheckBoxWithToolTip />, store);
}
describe('src/pages/Checkout/Delivery/components/CheckBoxWithToolTip', () => {
  beforeEach(() => {
    wrapper = setup();
  });

  it('should render CheckBoxWithToolTip component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should have button', () => {
    expect(wrapper.find('Button').length).to.equal(1);
  });

  it('should have button classname', () => {
    const props = wrapper.find('Button').props();

    expect(props.className).to.equal('small default showOverflow');
  });
});
