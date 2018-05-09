import React from 'react';
import { expect } from 'chai';
import ConvenienceStoreTest from '../index';

const intitialStore = {
  delivery: {
    splitDetails: {},
    deliveryMethod: [{
      deliveryType: '15',
      splitNo: '1',
    }],
    shippingThreshold: [
      {
        brandCode: '10',
        countryCode: '392',
        deliveryType: '15',
        shippingFee: '450',
        thresholdPrice: '5000',
      },
      {
        brandCode: '10',
        countryCode: '392',
        deliveryType: '15',
        shippingFee: '250',
        thresholdPrice: '5000',
      },
    ],
    deliveryTypeApplied: '15',
    deliveryMethodList: {
      1: {
        C: {
          deliveryDetails: [
            {
              deliveryType: '15',
              limitDatetime: '20161121201245',
              plannedDateFrom: '20161124000000',
              plannedDateTo: '20161126000000',
              plannedTime: '0',
              spareDate: '0',
            },
            {
              deliveryType: '17',
              limitDatetime: '20161121201245',
              plannedDateFrom: '20161124000000',
              plannedDateTo: '20161126000000',
              plannedTime: '15',
              spareDate: '0',
            },
          ],
        },
      },
    },
    deliveryTypes: [
      '12',
      '17',
      '5',
      '11',
      '15',
    ],
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
    },
  },
};
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

function setup(props = {}, store = intitialStore) {
  return testHelpers.mountWithAll(<ConvenienceStoreTest />, store);
}

describe('ConvenienceStore component', () => {
  it('should render ConvenienceStore component', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should have BoxSelector Component', () => {
    const wrapper = setup();

    expect(wrapper.find('BoxSelector').length).to.equal(1);
  });

  it('should have BoxSelector with id pickupConvenience', () => {
    const wrapper = setup();
    const body = wrapper.find('BoxSelector');

    expect(body.props().id).to.equal('pickupConvenience');
  });

  it('BoxSelector should  have value CVS', () => {
    const wrapper = setup();
    const body = wrapper.find('BoxSelector');

    expect(body.props().value).to.equal('15');
  });

  it('BoxSelector should not be checked', () => {
    const wrapper = setup({}, cvsStore);
    const body = wrapper.find('input[type="radio"]');

    expect(body.props().checked).to.equal(false);
  });

  it('BoxSelector should be checked', () => {
    const wrapper = setup();
    const body = wrapper.find('input[type="radio"]');

    expect(body.props().checked).to.equal(true);
  });
});
