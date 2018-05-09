import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import RadioSelector from 'components/Selector';
import ShippingPreferenceWrapper from '../ShippingPreference';

let wrapper;
const store = {
  i18n,
  delivery: {
    shippingThreshold: [{ deliveryType: '5' }],
    deliveryMethod: [{ deliveryType: '', splitNo: '1' }],
    deliveryMethodList: {
      1: {
        C: {
          deliveryRequestedDateTimes: [
            {
              date: '00',
              timeSlots: [
                '00',
              ],
            },
          ],
          deliveryTypes: ['5'],
          deliveryDetails: [
            {
              deliveryType: '5',
              splitDiv: 'C',
              splitNo: '1',
            },
          ],
        },
      },
    },
    nextDateOptions: { 1: { C: false } },
    deliveryTypes: ['5'],
    splitCount: 1,
    deliveryStandard: { 1: {} },
    deliveryPreference: 'C',
    sameDayDeliveryCharges: [
      {
        deliveryType: '01',
        shippingFee: '300',
        countryCode: 'Default',
        brandCode: '10',
      },
    ],
  },
};

function setup() {
  return testHelpers.mountWithAll(<ShippingPreferenceWrapper splitCount={1} />, store);
}

function setupSplit() {
  const splitStore = { ...store, delivery: { deliveryPreference: 'S' } };

  return testHelpers.mountWithAll(<ShippingPreferenceWrapper />, splitStore);
}

describe('src/pages/Checkout/Delivery/components/ShippingPreference', () => {
  beforeEach(() => {
    wrapper = setup();
  });

  it('should render ShippingPreferenceWrapper component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should have RadioSelectors', () => {
    expect(wrapper.find(RadioSelector).length).to.equal(3);
  });

  it('should have ShippingPreference', () => {
    expect(wrapper.find('ShippingPreference').length).to.equal(1);
  });

  it('should not have ShippingPreference for splitDelivery', () => {
    const splitWrapper = setupSplit();

    expect(splitWrapper.find('ShippingPreference').length).to.equal(0);
  });

  it('should have RadioSelector label and value', () => {
    expect(wrapper.find(RadioSelector).at(0).props().label).to.equal('翌日配送');
    expect(wrapper.find(RadioSelector).at(0).props().value).to.equal('byNextDate');
  });

  it('should have RadioSelector label and value', () => {
    expect(wrapper.find(RadioSelector).at(1).props().label).to.equal('お届け日時指定');
    expect(wrapper.find(RadioSelector).at(1).props().value).to.equal('bydate');
  });

  it('should have RadioSelector label and value', () => {
    expect(wrapper.find(RadioSelector).at(2).props().label).to.equal('お届け日時を指定しない');
    expect(wrapper.find(RadioSelector).at(2).props().value).to.equal('standard');
  });
});
