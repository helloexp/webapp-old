import React from 'react';
import { expect } from 'chai';
import Japanese from 'i18n/strings-ja';
import CustomerServiceButton from '../index';

const store = {
  routing: {
    locationBeforeTransitions: {
      query: {
        brand: 'uq',
      },
    },
  },
};

function mountItem(props = {}) {
  return testHelpers.mountWithAll(<CustomerServiceButton {...props} />, store);
}

describe('components/CustomerServiceButton', () => {
  it('should render correctly', () => {
    const wrapper = mountItem();

    expect(wrapper.length).to.equal(1);
  });

  it('should render the correct label', () => {
    const wrapper = mountItem();
    const text = wrapper.find('Heading').first().props();

    expect(text.headingText).to.equal(Japanese.customerService.needHelp);
  });
});
