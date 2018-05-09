import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import RemoveCompletedTest from '../index';

function mountItem() {
  return testHelpers.mountWithAll(<RemoveCompletedTest />);
}

describe('RemoveCompleted component', () => {
  it('should render RemoveCompleted', () => {
    const wrapper = mountItem();

    expect(wrapper.length).to.equal(1);
  });

  it('should have Heading Text', () => {
    const wrapper = mountItem();
    const heading = wrapper.find('Heading');

    expect(heading.first().props().headingText).to.equal(i18n.creditCard.removeHeading);
  });

  it('should have Heading Text', () => {
    const wrapper = mountItem();
    const heading = wrapper.find('Heading');

    expect(heading.first().props().headingText).to.equal(i18n.creditCard.removeHeading);
    expect(heading.first().props().type).to.equal('h2');
  });

  it('should have Text component with heading', () => {
    const wrapper = mountItem();
    const Text = wrapper.find('Text');

    expect(Text.first().props().headingText).to.equal(i18n.creditCard.Text);
  });

  it('should have Button label', () => {
    const wrapper = mountItem();
    const button = wrapper.find('Button');

    expect(button.first().props().label).to.equal(i18n.creditCard.backToCards);
  });
});
