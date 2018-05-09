import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import DateTimeSelector from '../DateTimeSelector';

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
    updatedDeliveryMethodList: {
      1: {
        C: {
          deliveryRequestedDateTimes: [
            {
              date: '00',
              timeSlots: [
                '00',
                '01',
                '08',
              ],
            },
          ],
          deliveryTypes: [
            '5',
            '11',
          ],
          deliveryDetails: [
            {
              deliveryType: '5',
              spareDate: '2',
              plannedTime: '18',
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
  return testHelpers.mountWithAll(
    <DateTimeSelector />, store);
}
describe('src/pages/Checkout/Delivery/components/DateTimeSelector', () => {
  beforeEach(() => {
    wrapper = setup();
  });

  it('should render DateTimeSelector component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should have Button', () => {
    expect(wrapper.find('Button').length).to.equal(3);
  });

  it('should have correct Button label', () => {
    expect(wrapper.find('Button').at(1).props().label).to.equal('キャンセル');
  });

  it('should have correct Button label', () => {
    expect(wrapper.find('Button').at(2).props().label).to.equal('確定する');
  });

  it('should have correct analyticsLabel', () => {
    expect(wrapper.find('Button').at(2).props().analyticsLabel).to.equal('UPDATE SHIPPING DATETTIME');
  });

  it('should have Text', () => {
    expect(wrapper.find('Text').length).to.equal(3);
  });

  it('should have correct Text', () => {
    expect(wrapper.find('Text').at(1).props().children).to.equal('キャンセル');
  });

  it('should have correct Text', () => {
    expect(wrapper.find('Text').at(2).props().children).to.equal('確定する');
  });

  it('should have correct Text', () => {
    expect(wrapper.find('Text').at(2).props().children).to.equal('確定する');
  });
});
