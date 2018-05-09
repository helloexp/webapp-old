import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import StoresMap from '../StoresMap';

const store = {
  deliveryStore: {
    states: {},
    showStates: true,
  },
  paymentStore: {},
};

function mountItem(props = {}, currentStore = {}) {
  return testHelpers.mountWithAll(<StoresMap {...props} />, { ...store, ...currentStore });
}

describe('src/pages/Checkout/Payment/StorePayment/StoresMap', () => {
  let wrapper;

  describe('showStates is set to true', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render StoresMap component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render Drawer component', () => {
      const drawer = wrapper.find('Drawer');

      expect(drawer.length).to.equal(1);
      expect(drawer.props().title).to.equal(i18n.deliveryStore.selectStore);
    });

    it('should render StoresStates component', () => {
      const storeStates = wrapper.find('StoresStates');

      expect(storeStates.length).to.equal(1);
    });
  });

  describe('showStates is set to false', () => {
    beforeEach(() => {
      wrapper = mountItem({}, {
        deliveryStore: {
          stores: [],
          stateCodes: {},
          states: {},
          showStates: false,
        },
      });
    });

    it('should render StoresLocation component', () => {
      const storeLocation = wrapper.find('StoresLocation');

      expect(storeLocation.length).to.equal(1);
    });
  });
});
