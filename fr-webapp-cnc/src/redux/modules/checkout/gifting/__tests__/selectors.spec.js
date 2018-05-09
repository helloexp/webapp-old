import expect from 'expect';
import { setTexts } from 'i18n';
import japanese from 'i18n/strings-ja';
import * as selector from '../selectors';

// Mock i18n texts
setTexts(japanese);

describe('redux/modules/checkout/gifting/selectors', () => {
  const props = {};
  const state = {
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
      message: '',
      selectedGiftBox: {
        id: '05',
      },
      selectedMessageCard: {
        id: '01',
      },
      isGiftBagsLoaded: true,
      isGiftBagAmountsLoaded: true,
      isMessageCardsLoaded: true,
      isMessageCardAmountsLoaded: true,
      isGiftLoaded: false,
    },
    auth: {
      user: {
        accessToken: true,
        gdsSession: true,
      },
    },
    cart: {
      uq: {
        cartGift: {
          id: '05',
          amount: 150,
          message: '',
          messageCard: {
            id: '01',
            amount: 0,
          },
        },
      },
    },
  };

  it('should get selected giftbox from props', () => {
    expect(
      selector.getSelectedGiftBox(state)
    ).toMatch({ id: '05' });
  });

  it('should normalize all the awesome gift items', () => {
    const giftItems = selector.getGiftItems(state, props);

    expect(giftItems).toExist();
    expect(giftItems[0]).toExist();
    expect(giftItems[0].price).toBe('¥90');
    expect(giftItems[3].price).toBe('¥150');
    expect(giftItems[3].description).toBe('資材同梱');
    expect(giftItems[0].hasPacking).toBe(true);
  });

  it('should not recalculate gift items getter', () => {
    selector.getGiftItems(state, props);
    selector.getGiftItems(state, props);

    expect(
      selector.getGiftItems.recomputations()
    ).toBe(3);
  });

  it('should normalize all the awesome gift items', () => {
    const selectedGiftBox = selector.getSelectedGiftBoxData(state, props);
    const shouldBeSelected = {
      id: '05',
      hasPacking: true,
      title: 'ユニクロ箱　直接',
      image: 'https://im.testdm2.jp/images/jp/pc/img/material/giftbag_05_s_JP.jpg',
    };

    expect(selectedGiftBox).toMatch(shouldBeSelected);
  });

  it('should not recalculate gift items getter', () => {
    selector.getSelectedGiftBoxData(state, props);
    selector.getSelectedGiftBoxData(state, props);

    expect(
      selector.getSelectedGiftBoxData.recomputations()
    ).toBe(3);
  });

  it('should normalize all the message cards', () => {
    const messageCards = selector.getMessageCardItems(state, props);

    expect(messageCards).toExist();
    expect(messageCards[0]).toExist();
    expect(messageCards[1].price).toBe('無料');
    expect(messageCards[1].id).toBe('03');
  });

  it('should not recalculate message card items getter', () => {
    selector.getMessageCardItems(state, props);
    selector.getMessageCardItems(state, props);

    expect(
      selector.getMessageCardItems.recomputations()
    ).toBe(3);
  });
});
