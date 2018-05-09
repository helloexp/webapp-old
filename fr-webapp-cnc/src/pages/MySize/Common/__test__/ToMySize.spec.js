import React from 'react';
import { expect } from 'chai';
import Drawer from 'components/Drawer';
import i18n from 'i18n/strings-en';
import ToMySizeTest from '../ToMySize';

const state = {
  mySize: {
    sections: { toMySize: true },
    selected: { size_title: 's' },
  },
};

function mountItem() {
  return testHelpers.mountWithAll(<ToMySizeTest />, state);
}

describe('ToMySize component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render ToMySize', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should have Drawer', () => {
    const wrappers = testHelpers.mountWithAll(<ToMySizeTest />, state);
    const drawer = wrappers.find(Drawer);

    expect(drawer.length).to.equal(1);
    expect(drawer.props().title).to.equal(i18n.mySize.addNewUser);
  });

  it('should have Text', () => {
    const wrappers = testHelpers.mountWithAll(<ToMySizeTest />, state);
    const Text = wrappers.find('Text');

    expect(Text.length).to.equal(2);
    expect(Text.at(0).props().children).to.equal(i18n.mySize.nameInMyList);
    expect(Text.at(1).props().children).to.equal(i18n.mySize.sizeExample);
  });
});
