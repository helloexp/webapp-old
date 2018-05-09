import React from 'react';
import { expect } from 'chai';
import BoxSelector from 'components/BoxSelector';
import { deliveryTypes } from 'config/site/default';
import { getFreeShippingMessage } from 'utils/deliveryUtils';
import Japanese from 'i18n/strings-ja';
import UnilqloStore from '../index';

const store = {
  totalAmount: 0,
  userInfo: {
    userDefaultDetails: {
      email: 'craig@uniqlo.store',
    },
  },
  delivery: {
    splitDetails: {},
    deliveryMethod: {
      deliveryType: deliveryTypes.STORE_PICKUP,
    },
    shippingThreshold: [
      {
        brandCode: '10',
        countryCode: '392',
        deliveryType: '11',
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
    deliveryTypeApplied: '',
    deliveryMethodList: {
      deliveryDetails: [
        {
          deliveryType: deliveryTypes.STORE_PICKUP,
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
      deliveryRequestedDateTimes: [
        {
          date: '20161126',
          timeSlots: [
            '00',
            '03',
            '04',
            '05',
            '06',
          ],
        },
        {
          date: '20161127',
          timeSlots: [
            '00',
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
          ],
        },
      ],
      deliveryTypes: [
        '12',
        '17',
        '5',
        '11',
        '15',
      ],
    },
  },
};

function mountUnilqloStore() {
  return testHelpers.mountWithAll(<UnilqloStore />, store);
}

describe('pages/Checkout/Delivery/PickupStore', () => {
  it('should render BoxSelector with correct params', () => {
    const wrapper = mountUnilqloStore();
    const BoxSelectorProps = wrapper.find(BoxSelector).props();

    expect(BoxSelectorProps.price).to.equal('¥ 450');
    expect(BoxSelectorProps.description).to.equal(getFreeShippingMessage(store.totalAmount, Japanese.checkout.freeShippingMessage));
  });

  it('should render Button with class', () => {
    const wrapper = mountUnilqloStore();
    const buttonComponent = wrapper.find('.boldWithBorder');

    expect(buttonComponent).to.be.visible; // eslint-disable-line
  });
});
