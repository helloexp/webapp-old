import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import { init } from 'utils/routing';
import Gifting from '../index';

describe('Gifting', () => {
  let giftingWrapper;
  let giftDrawer;

  const defaultState = {
    app: {
      previousPathname: '/jp/checkout/payment',
    },
  };

  init({
    region: 'jp',
    router: {
      push: () => {},
    },
  });

  describe('Render gifting with Default state', () => {
    beforeEach(() => {
      giftingWrapper = testHelpers.mountWithAll(<Gifting />, defaultState);
      giftDrawer = giftingWrapper.find('Drawer');
    });
    it('Should render Gifting Component', () => {
      expect(giftingWrapper.length).to.equal(1);
    });
    it('Should render Container Component', () => {
      const Container = giftDrawer.find('Container');

      expect(Container.length).to.equal(6);
    });
    it('Should render GiftSelector with no giftbox', () => {
      const GiftSelector = giftDrawer.find('GiftSelector');

      expect(GiftSelector.length).to.equal(1);
      expect(GiftSelector.props().title).to.equal(i18n.gifting.noGiftBox);
    });
    it('Should not render MessageCards', () => {
      const GiftSelector = giftDrawer.find('MessageCards');

      expect(GiftSelector.length).to.equal(0);
    });

    it('Should render No gift Message', () => {
      const texts = giftDrawer.find('Text');

      expect(texts.length).to.equal(5);
      expect(texts.at(2).props().children).to.equal((i18n.gifting.noGiftMessage));
    });

    it('Cancel gifting ', () => {
      const buttons = giftDrawer.find('Button');

      expect(buttons.length).to.equal(3);
      buttons.at(1).simulate('click');
    });
  });

  describe('Gifting state with loaded gift cards', () => {
    const updatedState = {
      routing: {
        locationBeforeTransitions: {
          query: { brand: 'uq' },
        },
      },
      gifting: {
        giftBags: [
          {
            id: '01',
            brand: 'uq',
            hasPacking: true,
            title: 'ユニクロ　直接',
            image: 'https://im.testdm2.jp/images/jp/pc/img/material/giftbag_01_s_JP.jpg',
          },
          {
            id: '02',
            brand: 'uq',
            hasPacking: false,
            title: 'ユニクロ　資材同梱',
            image: 'https://im.testdm2.jp/images/jp/pc/img/material/giftbag_02_s_JP.jpg',
          },
          {
            id: '05',
            brand: 'uq',
            hasPacking: true,
            title: 'ユニクロ箱　直接',
            image: 'https://im.testdm2.jp/images/jp/pc/img/material/giftbag_05_s_JP.jpg',
          },
          {
            id: '06',
            brand: 'uq',
            hasPacking: false,
            title: 'ユニクロ箱　資材同梱',
            image: 'https://im.testdm2.jp/images/jp/pc/img/material/giftbag_06_s_JP.jpg',
          },
        ],
        giftBagAmounts: {
          '01': {
            amount: 90,
          },
          '02': {
            amount: 90,
          },
          '03': {
            amount: 90,
          },
          '04': {
            amount: 90,
          },
          '05': {
            amount: 150,
          },
          '06': {
            amount: 150,
          },
        },
        messageCards: [
          {
            id: '01',
            title: 'ユニクロ',
            image: 'https://im.testdm2.jp/images/jp/sp/img/material/giftcard_01_mb_JP.jpg',
          },
          {
            id: '03',
            title: 'ユニクロ（正方形）',
            image: 'https://im.testdm2.jp/images/jp/sp/img/material/giftcard_03_mb_JP.jpg',
          },
        ],
        messageAmounts: {
          '01': {
            amount: 0,
          },
          '02': {
            amount: 0,
          },
          '03': {
            amount: 0,
          },
        },
        isGiftBagsLoaded: true,
        isGiftBagAmountsLoaded: true,
        isMessageCardsLoaded: true,
        isMessageCardAmountsLoaded: true,
        isGiftLoaded: false,
      },
    };

    beforeEach(() => {
      giftingWrapper = testHelpers.mountWithAll(<Gifting />, updatedState);
      giftDrawer = giftingWrapper.find('Drawer');
    });

    it('Should render Gifting Component', () => {
      expect(giftingWrapper.length).to.equal(1);
    });

    it('Should render GiftSelector with default option', () => {
      const GiftSelector = giftDrawer.find('GiftSelector');

      expect(GiftSelector.length).to.equal(5);
    });

    it('Should not render MessageCards', () => {
      const GiftSelector = giftDrawer.find('MessageCards');

      expect(GiftSelector.length).to.equal(0);
    });
  });
});
