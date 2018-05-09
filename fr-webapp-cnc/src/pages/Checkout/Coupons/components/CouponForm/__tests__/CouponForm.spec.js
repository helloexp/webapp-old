import React from 'react';
import { expect } from 'chai';
import Input from 'components/Atoms/Input';
import Button from 'components/uniqlo-ui/Button';
import Japanese from 'i18n/strings-ja';
import CouponForm from '../index';

function mountItem(props = {}) {
  return testHelpers.mountWithAll(<CouponForm {...props} />);
}

describe('src/pages/Checkout/Coupons/components/CouponForm', () => {
  it('should render CouponForm component', () => {
    const wrapper = mountItem();

    expect(wrapper.length).to.equal(1);
  });

  it('should render a text input', () => {
    const wrapper = mountItem();
    const props = wrapper.find(Input).props();

    expect(props.value).to.equal(undefined);
    expect(props.label).to.equal(Japanese.coupons.code);
  });

  it('should set the value to input field', () => {
    const wrapper = mountItem({ code: '123', addedCoupon: { couponId: '123' } });
    const props = wrapper.find(Input).props();

    expect(props.value).to.equal('123');
    expect(props.label).to.equal(Japanese.coupons.code);
  });

  it('should render a button to add a new code', () => {
    const wrapper = mountItem({ code: '123', addedCoupon: { couponId: '123' } });
    const props = wrapper.find(Button).props();

    expect(props.label).to.equal(Japanese.coupons.apply);
    expect(props.disabled).to.equal(false);
  });

  it('should call the onAdd function when clicking the button', () => {
    const onAdd = sinon.spy();
    const wrapper = mountItem({ onAdd, code: '123', addedCoupon: { couponId: '123' } });

    wrapper.find(Button).simulate('click');
    expect(onAdd.withArgs('123').calledOnce).to.equal(true);
  });
});
