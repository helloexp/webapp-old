import React from 'react';
import { expect } from 'chai';
import MembershipInfo from '../../MembershipInfo';

function mountItem() {
  return testHelpers.mountWithAll(<MembershipInfo />);
}

describe('src/pages/Account/MembershipInfo/MembershipInfo', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render MembershipInfo', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render MemberInfoView component', () => {
    const memberInfoView = wrapper.find('MemberInfoView');

    expect(memberInfoView.length).to.equal(1);
  });
});
