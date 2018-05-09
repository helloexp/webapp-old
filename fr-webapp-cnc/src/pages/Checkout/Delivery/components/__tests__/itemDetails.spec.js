import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import ItemDetails from '../ShippingPreference/ItemDetails';

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
  return testHelpers.mountWithAll(<ItemDetails />, store);
}
describe('src/pages/Checkout/Delivery/components/ShippingPreference/ItemDetails', () => {
  beforeEach(() => {
    wrapper = setup();
  });

  it('should render ItemDetails component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });
});
