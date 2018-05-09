import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import CVSBody from '../CVSBody';

const userStore = {
  delivery: {
    deliveryMethodList: {
      1: {
        C: {},
      },
    },
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
const customUserStore = {
  delivery: {
    deliveryMethodList: {
      1: {
        C: {},
      },
    },
  },
  userInfo: {
    cvsAddress: {
      sevenEleven: {},
      lawson: {},
      familyMart: {},
    },
  },
};

function mountCVSBody(props = {}, store) {
  return testHelpers.mountWithAll(<CVSBody {...props} />, store);
}

describe('CVSBody Components', () => {
  it('Should Render CVSBody', () => {
    const wrapper = mountCVSBody({}, userStore);

    expect(wrapper.length).to.equal(1);
  });

  it('should render default header text', () => {
    const wrapper = mountCVSBody({}, customUserStore);
    const header = wrapper.find('Heading').last().props();

    expect(header.headingText).to.equal(i18n.checkout.convenienceTitle);
  });

  it('should render cvs store header text', () => {
    const wrapper = mountCVSBody({}, userStore);
    const header = wrapper.find('Heading').last().props();

    expect(header.headingText).to.equal(i18n.checkout.convenienceTitle);
  });
});
