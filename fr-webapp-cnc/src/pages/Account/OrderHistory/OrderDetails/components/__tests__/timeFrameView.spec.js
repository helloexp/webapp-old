import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import TimeFrameView from '../TimeFrameView';

const defaultProps = {
  shipping: true,
};

function mountItem(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<TimeFrameView {...renderProps} />);
}

describe('src/pages/Account/OrderHistory/components/TimeFrameView', () => {
  let wrapper;

  describe('TimeFrameView - delivery type shipping', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render TimeFrameView component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should show TimeFrame heading', () => {
      const heading = wrapper.find('Heading');

      expect(heading.length).to.equal(1);
      expect(heading.props().headingText).to.equal(i18n.orderHistory.shippingMethod);
    });
  });

  describe('TimeFrameView - delivery type not shipping', () => {
    beforeEach(() => {
      wrapper = mountItem({ shipping: false });
    });

    it('should not show TimeFrameView if delivery type is not shipping', () => {
      expect(wrapper.html()).to.equal(null);
    });
  });
});
