import React from 'react';
import { expect } from 'chai';
import Coupons from '../index';

const store = {
  coupons: {
    list: [{
      id: '3017494170574',
      internalId: '3017494170574-16',
      title: 'TestPos012',
      code: 'TestPos012',
      validFrom: 1467309600,
      validTo: 1577890799,
    }],
  },
};

function mountItem(props = {}) {
  return testHelpers.mountWithAll(<Coupons {...props} />, store);
}

describe('src/pages/Checkout/Coupons/index.js', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render Coupons component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render Drawer component', () => {
    const drawer = wrapper.find('Drawer');

    expect(drawer.length).to.equal(1);
  });

  it('should render MainContent component', () => {
    const mainContent = wrapper.find('MainContent');

    expect(mainContent.length).to.equal(1);
  });
});
