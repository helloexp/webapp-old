import React from 'react';
import { expect } from 'chai';
import ViewMySizeTest from '../index';

function mountItem() {
  return testHelpers.mountWithAll(<ViewMySizeTest />);
}

describe('ViewMySize component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render ViewMySize', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render all my size components', () => {
    const confirmDelete = wrapper.find('ConfirmDelete');
    const sizeList = wrapper.find('SizeList');
    const viewSize = wrapper.find('ViewSize');

    expect(confirmDelete.length).to.equal(1);
    expect(sizeList.length).to.equal(1);
    expect(viewSize.length).to.equal(1);
  });
});
