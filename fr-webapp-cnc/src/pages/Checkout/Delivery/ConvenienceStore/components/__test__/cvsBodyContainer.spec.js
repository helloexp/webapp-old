import React from 'react';
import { expect } from 'chai';
import ConvenienceStore from '../CVSBodyContainer';

const customDeliveryStore = {
  delivery: {
    deliveryMethod: {
      deliveryType: '11',
    },
    isEditDeliveryOption: false,
  },
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
      lawson: {
        addressNumber: '998',
        apt: 'ローソン店舗受取',
        firstName: '盛岡大通３丁目',
        lastName: 'ローソン',
        postalCode: '0200022',
        prefecture: '岩手県',
        street: '盛岡市大通３丁目２－８',
      },
      familyMart: {
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
const customCVSStore = {
  userInfo: {
    cvsAddress: {
      sevenEleven: {},
      lawson: {},
      familyMart: {},
    },
  },
};

function mountItem(props = {}, store) {
  return testHelpers.mountWithAll(<ConvenienceStore {...props} />, store);
}

describe('CVS convenience store', () => {
  it('should render ConvenienceStore', () => {
    const wrapper = mountItem(undefined, customDeliveryStore);

    expect(wrapper.length).to.equal(1);
  });

  it('should not render  CvsBody', () => {
    const wrapper = mountItem(undefined, customCVSStore);
    const body = wrapper.find('CVSBody');

    expect(body.length).to.equal(0);
  });

  it('should render CvsBody', () => {
    const wrapper = mountItem(undefined, customDeliveryStore);
    const body = wrapper.find('CVSBodyContainer');

    expect(body.length).to.equal(1);
  });
});
