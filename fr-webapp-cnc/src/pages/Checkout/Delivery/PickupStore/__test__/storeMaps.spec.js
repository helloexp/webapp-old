import React from 'react';
import { expect } from 'chai';
import Drawer from 'components/Drawer';
import StoresMap from '../StoresMap';

const store = {
  delivery: {
    deliveryMethodList: {
      1: {
        C: {},
      },
    },
  },
};

function mountStoresMap() {
  return testHelpers.mountWithAll(<StoresMap />, store);
}

describe('pages/Checkout/Delivery/PickupStore/StoresMap', () => {
  it('should render Drawer component', () => {
    const wrapper = mountStoresMap();
    const drawerComponent = wrapper.find(Drawer);

    expect(drawerComponent).to.have.length(1);
  });
});
