import React from 'react';
import { expect } from 'chai';
import StoreAddressDetails from '../StoreAddressDetails';

const userStore = ['盛岡大通３丁目', '0200022', '盛岡市大通３丁目２－８'];

describe('StoreAddressDetails component', () => {
  it('should render StoreAddressDetails', () => {
    const wrapper = testHelpers.shallowWithAll(<StoreAddressDetails />);

    expect(wrapper.length).to.equal(1);
  });

  it('should render store address', () => {
    const wrapper = testHelpers.mountWithAll(<StoreAddressDetails storeAddress={userStore} />);
    const address = wrapper.find('Text');

    expect(address.length).to.equal(3);
  });

  it('should render first name', () => {
    const wrapper = testHelpers.mountWithAll(<StoreAddressDetails storeAddress={userStore} />);
    const postalcode = wrapper.find('Text').get(0);

    expect(postalcode.props.children).to.equal('盛岡大通３丁目');
  });

  it('should render postal code', () => {
    const wrapper = testHelpers.mountWithAll(<StoreAddressDetails storeAddress={userStore} />);
    const postalcode = wrapper.find('Text').get(1);

    expect(postalcode.props.children).to.equal('0200022');
  });

  it('should render street', () => {
    const wrapper = testHelpers.mountWithAll(<StoreAddressDetails storeAddress={userStore} />);
    const postalcode = wrapper.find('Text').get(2);

    expect(postalcode.props.children).to.equal('盛岡市大通３丁目２－８');
  });
});
