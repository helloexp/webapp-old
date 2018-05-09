import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import CompleteMySizeTest from '../index';

function mountItem() {
  return testHelpers.mountWithAll(<CompleteMySizeTest />);
}

describe('HowTo component', () => {
  it('should render HowTo', () => {
    const wrapper = mountItem();

    expect(wrapper.length).to.equal(1);
  });

  it('should have Heading info', () => {
    const wrapper = mountItem();
    const HeadingInfo = wrapper.find('HeadingInfo');

    expect(HeadingInfo.length).to.equal(1);
    expect(HeadingInfo.props().text).to.equal(i18n.mySize.headingComplete);
  });

  it('should have Text', () => {
    const wrapper = mountItem();
    const Text = wrapper.find('Text');

    expect(Text.length).to.equal(3);
    expect(Text.at(1).props().children).to.equal(i18n.mySize.completionMsg);
  });

  it('should have Button label', () => {
    const wrapper = mountItem();
    const button = wrapper.find('Button');

    expect(button.at(1).text()).to.equal(i18n.mySize.backToHome);
  });
});
