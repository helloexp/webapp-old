import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import TimeoutInfo from '../index';

let wrapper;

function setup() {
  return testHelpers.mountWithAll(<TimeoutInfo />, i18n);
}
describe('src/pages/Cart/TimeoutInfo', () => {
  beforeEach(() => {
    wrapper = setup();
  });
  it('should render TimeoutInfo component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render InfoToolTip', () => {
    const tooltip = wrapper.find('InfoToolTip');

    expect(tooltip.length).to.equal(1);
  });
});
