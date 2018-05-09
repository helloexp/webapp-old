import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import StoresStates from '../index';

describe('pages/Checkout/components/StoreSelector/StoresStates', () => {
  it('should render Stores States', () => {
    const wrapper = testHelpers.shallowWithAll(<StoresStates />);

    expect(wrapper.length).to.equal(1);
  });

  it('should have button', () => {
    const wrapper = testHelpers.mountWithAll(<StoresStates />);
    const button = wrapper.find('Button');

    expect(button).to.visible; // eslint-disable-line
  });

  it('should have button label', () => {
    const wrapper = testHelpers.mountWithAll(<StoresStates />);
    const stateListButtons = wrapper.find('Button');

    expect(stateListButtons.last().props().label).to.equal(i18n.address.prefectureList[46]);
  });
});
