import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import OrderHistory from '../index';

const state = {
  orderHistory: {
    orderCount: 10,
    orderHistoryList: [
      {
        orderNumber: '011801051716-33745',
        hashKey: '056c26f847876a3717a063094a5ad195d0bbb36598a6026fedac2139336402db',
      },
      {
        orderNumber: '011801051716-33746',
        hashKey: '717a195d0bbb365056c26f847876a398a6026fedac21063094a5ad39336402db',
      },
      {
        orderNumber: '011801051716-33747',
        hashKey: '3717a06309bb36598a6026fed056c26f847876a4a5ad195d0bac2139336402db',
      },
      {
        orderNumber: '011801051716-33748',
        hashKey: '5d0bbb3659056c26f847876a3717a063094a5ad198a6026fedac2139336402db',
      },
      {
        orderNumber: '011801051716-33749',
        hashKey: 'bbb36598a6026f056c26f847876a3717a063094a5ad195d0edac2139336402db',
      },
    ],
  },
};

function mountItem(store = {}) {
  return testHelpers.mountWithAll(<OrderHistory />, { ...state, ...store });
}

describe('src/pages/Account/OrderHistory', () => {
  let wrapper;

  describe('OrderHistory - non empty order list', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render OrderHistory component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render order history list Heading component', () => {
      const orderListHeading = wrapper.find('Heading').first();

      expect(orderListHeading.props().headingText).to.equal(i18n.orderHistory.orderHistoryList);
    });

    it('should render OrderHistoryInfo component', () => {
      const orderHistoryInfo = wrapper.find('OrderHistoryInfo').first();

      expect(orderHistoryInfo.length).to.equal(1);
    });

    it('should render order count Heading component', () => {
      const orderCount = wrapper.find('Heading').at(2);

      expect(orderCount.props().headingText).to.equal(`10${i18n.orderHistory.during}5${i18n.orderHistory.perPage}`);
    });

    it('should render OrderTileWithFooter component', () => {
      const orderTileWithFooter = wrapper.find('OrderHistoryInfo');

      expect(orderTileWithFooter.length).to.equal(1);
    });

    it('should render view more Button component', () => {
      const viewMore = wrapper.find('Button').at(10);

      expect(viewMore.props().label).to.equal(i18n.orderHistory.loadMore);
    });

    it('should render go back Button component', () => {
      const goBack = wrapper.find('Button').at(11);

      expect(goBack.props().label).to.equal(i18n.orderHistory.backToMemberInfo);
    });
  });

  describe('OrderHistory - empty order list', () => {
    beforeEach(() => {
      wrapper = mountItem({
        orderHistory: { orderHistoryList: [] },
      });
    });

    it('should render no order description Text component', () => {
      const noOrderText = wrapper.find('Text').at(0);

      expect(noOrderText.props().children).to.equal(i18n.orderHistory.noOrderDescription);
    });
  });
});
