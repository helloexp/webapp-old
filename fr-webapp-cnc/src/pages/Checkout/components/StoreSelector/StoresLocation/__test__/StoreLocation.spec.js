import React from 'react';
import { expect } from 'chai';
import StoresLocation from '../index';

const store = {
  delivery: {
    deliveryMethodList: {
      1: {
        C: {},
      },
    },
  },
};

const defaultProps = {
  selectedStore: false,
  prefecture: '都道府県で検索',
};

function mountItem(props = {}, state = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<StoresLocation {...renderProps} />, { ...store, ...state });
}

describe('pages/Checkout/components/StoreSelector/StoresLocation', () => {
  let wrapper;

  describe('Store not selected', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render Stores Location', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render SearchByPrefecture', () => {
      const searchByPrefecture = wrapper.find('SearchByPrefecture');

      expect(searchByPrefecture.length).to.equal(1);
    });

    it('should render prefecture label ', () => {
      const searchByPrefecture = wrapper.find('SearchByPrefecture');

      expect(searchByPrefecture.find('Button').props().label).to.equal(defaultProps.prefecture);
    });

    it('should render Filters', () => {
      const filters = wrapper.find('Filters');

      expect(filters.length).to.equal(1);
    });

    it('should render ResultList', () => {
      const resultList = wrapper.find('ResultList');

      expect(resultList.length).to.equal(1);
    });
  });

  describe('Store is selected', () => {
    beforeEach(() => {
      const newProps = {
        selectedStore: {
          id: 10101397,
          name: 'ユニクロ 銀座店',
          prefecture: '関東',
          municipality: '中央区',
          city: '東京都',
          number: '銀座6-9-5',
          babies: 1,
          kids: 1,
          parking: 0,
          news: 1,
          xl: true,
          large: false,
        },
      };

      wrapper = mountItem(newProps);
    });

    it('should render Confirmation', () => {
      const confirmation = wrapper.find('Confirmation');

      expect(confirmation.length).to.equal(1);
    });
  });
});
