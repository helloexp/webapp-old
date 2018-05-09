import React from 'react';
import { setTexts } from 'i18n';
import { expect } from 'chai';
import Drawer from 'components/Drawer';
import japanese from 'i18n/strings-ja';
import CVSMenuOptionsTest from '../CVSMenuOptions';

// Mock i18n texts
setTexts(japanese);

const cvsStore = {
  userInfo: {
    cvsAddress: {
      sevenEleven: {
        addressNumber: '998',
        apt: 'ローソン店舗受取',
        firstName: '盛岡大通３丁目',
        lastName: 'ローソン',
        postalCode: '0200022',
        prefecture: '岩手県',
        street: '盛岡市大通３丁目２－８',
      },
    },
  },
};

function setup(props = {}) {
  return testHelpers.mountWithAll(<CVSMenuOptionsTest {...props} />, cvsStore);
}

describe('CVSMenuOptions component', () => {
  it('should render CVSMenuOptions', () => {
    const wrapper = setup({ brand: 'gu' });

    expect(wrapper.length).to.equal(1);
  });

  it('should render Drawer', () => {
    const wrapper = setup({ brand: 'gu' });
    const body = wrapper.find(Drawer);

    expect(body.length).to.equal(1);
  });

  it('should have Text', () => {
    const wrapper = setup({ brand: 'gu' });
    const body = wrapper.find('Text');

    expect(body.length).to.equal(1);
  });
});
