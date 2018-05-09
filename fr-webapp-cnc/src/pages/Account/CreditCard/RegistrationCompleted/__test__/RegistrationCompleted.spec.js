import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import RegistrationCompletedTest from '../index';

function mountItem() {
  return testHelpers.mountWithAll(<RegistrationCompletedTest />);
}

describe('RegistrationCompleted component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render RegistrationCompleted', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should have Heading Text', () => {
    const heading = wrapper.find('Heading');

    expect(heading.first().props().headingText).to.equal(i18n.creditCard.registrationHeading);
    expect(heading.first().props().type).to.equal('h2');
  });

  it('should have Text components', () => {
    const Text = wrapper.find('Text');

    expect(Text.length).to.equal(3);
    expect(Text.first().props().children).to.equal(i18n.creditCard.registrationCompleted);
  });

  it('should have Button', () => {
    const button = wrapper.find('Button');

    expect(button.length).to.equal(1);
  });

  it('should have Button label', () => {
    const button = wrapper.find('Button');

    expect(button.first().props().label).to.equal(i18n.creditCard.backToCards);
  });
});
