import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import i18n from 'i18n/strings-en';
import ItemDetailsView from '../ItemDetailsView';

const store = {
  cart: {
    giftCookie: {},
    uq: {},
  },
};

const defaultProps = {
  orderItemsDetail: { cancel_btn_view_flg: 'Y' },
  structuredOrderItems: [{}],
};

function mountItem(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<ItemDetailsView {...renderProps} />, store);
}

describe('src/pages/Account/OrderHistory/components/ItemDetailsView', () => {
  let wrapper;

  describe('ItemDetailsView - Default case', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render ItemDetailsView component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render ItemCard component', () => {
      const itemCard = wrapper.find('ItemCard');

      expect(itemCard.length).to.equal(1);
    });

    it('should render OrderSummary component', () => {
      const orderSummary = wrapper.find('OrderSummary');

      expect(orderSummary.length).to.equal(1);
    });

    it('should render cancel Button', () => {
      const cancelButton = wrapper.find('Button');

      expect(cancelButton.props().label).to.equal(i18n.orderHistory.cancelTheOrder);
    });
  });

  describe('ItemDetailsView - order cancel action', () => {
    const onOrderCancel = spy();

    beforeEach(() => {
      wrapper = mountItem({ onOrderCancel });
    });

    it('should trigger onOrderCancel callback on clicking cancelButton', () => {
      const cancelButton = wrapper.find('Button');

      cancelButton.simulate('click');
      expect(onOrderCancel.calledOnce).to.equal(true);
    });
  });
});
