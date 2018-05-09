import React from 'react';
import { expect } from 'chai';
import RadioSelector from 'components/Selector';
import i18n from 'i18n/strings-en';
import DeliveryPreference from '../DeliveryPreference';

let wrapper;
const store = {
  i18n,
  delivery: {
    isShippingGroupDeliveryAvailable: true,
  },
};

function setup() {
  return testHelpers.mountWithAll(<DeliveryPreference />, store);
}
describe('src/pages/Checkout/Delivery/components/DeliveryPreference', () => {
  beforeEach(() => {
    wrapper = setup();
  });

  it('should render DeliveryPreference component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should have Panel', () => {
    expect(wrapper.find('Panel').length).to.equal(1);
  });

  it('should have Panel title', () => {
    expect(wrapper.find('Panel').props().title).to.equal('梱包方法の指定');
  });

  it('should have RadioSelectors', () => {
    expect(wrapper.find(RadioSelector).length).to.equal(2);
  });

  it('should have RadioSelector label and value', () => {
    expect(wrapper.find(RadioSelector).at(0).props().label).to.equal('まとめて発送');
    expect(wrapper.find(RadioSelector).at(0).props().value).to.equal('C');
  });

  it('should have RadioSelector label and value', () => {
    expect(wrapper.find(RadioSelector).at(1).props().label).to.equal('準備でき次第個別に発送');
    expect(wrapper.find(RadioSelector).at(1).props().value).to.equal('S');
  });
});
