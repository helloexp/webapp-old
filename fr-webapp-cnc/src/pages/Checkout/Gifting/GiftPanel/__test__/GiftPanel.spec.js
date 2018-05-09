import React from 'react';
import { expect } from 'chai';
import GiftLink from '../GiftLink';
import GiftPanelTest from '../index';

const state = {
  mySize: {
    sections: { about: 'code' },
  },
};
const review = true;

function mountItem() {
  return testHelpers.mountWithAll(<GiftPanelTest review={review} />);
}

describe('GiftPanel component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render GiftPanel', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should have GiftDetails', () => {
    const wrappers = testHelpers.mountWithAll(<GiftPanelTest />, state);
    const giftLink = wrappers.find(GiftLink);

    expect(giftLink.length).to.equal(1);
  });
});
