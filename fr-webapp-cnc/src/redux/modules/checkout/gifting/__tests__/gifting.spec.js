import constants from 'config/site/default';
import expect from 'expect';
import {
  SAVE_GIFTINGS_SUCCESS,
  FETCH_GIFTBAGS_SUCCESS,
  SELECT_GIFT_CARD,
} from '../constants';
import gifting from '../reducer';

describe('redux/modules/checkout/gifting', () => {
  const initialState = {
    giftBags: [],
    giftBagAmounts: {},
    messageCards: [],
    messageAmounts: {},
    message: null,
    selectedGiftBox: null,
    selectedMessageCard: null,
    isGiftBagsLoaded: false,
    isGiftBagAmountsLoaded: false,
    isMessageCardsLoaded: false,
    isMessageCardAmountsLoaded: false,
  };

  it('should save gifting value', () => {
    expect(
      gifting({
        message: 'dhgghfghfghfg',
        selectedGiftBox: {
          id: 2,
          title: 'Gift box',
          price: '¥ 150',
          description: 'Pack my items into my gift box',
          image: '/images/gift-box.png',
        },
        selectedMessageCard: {
          id: 1,
          title: 'Hologram message card',
          price: 'Free',
          image: '/images/hologram-card.png',
        },
      }, {
        type: SAVE_GIFTINGS_SUCCESS,
        result: { status: 'Gifting saved successfully' },
      })
    ).toMatch({
      message: 'dhgghfghfghfg',
      selectedGiftBox: {
        description: 'Pack my items into my gift box',
        id: 2,
        image: '/images/gift-box.png',
        price: '¥ 150',
        title: 'Gift box',
      },
      selectedMessageCard: {
        id: 1,
        image: '/images/hologram-card.png',
        price: 'Free',
        title: 'Hologram message card',
      },
      status: 'Gifting saved successfully',
    });
  });

  it('should fetch gifting value', () => {
    expect(
      gifting(undefined, {
        type: FETCH_GIFTBAGS_SUCCESS,
        result: {},
      })
    ).toMatch({
      giftBagAmounts: {},
      giftBags: [],
      isGiftBagAmountsLoaded: false,
      isGiftBagsLoaded: true,
      isMessageCardAmountsLoaded: false,
      isMessageCardsLoaded: false,
      message: null,
      messageAmounts: {},
      messageCards: [],
      selectedGiftBox: null,
      selectedMessageCard: null,
    });
  });

  it('should set giftcard selected', () => {
    const messageCards = [
      {
        id: '01',
        title: 'ユニクロ',
        image: `${constants.gifting.pathPrefix}01${constants.gifting.pathSuffix}`,
      },
      {
        id: '02',
        title: 'ジーユー',
        image: `${constants.gifting.pathPrefix}02${constants.gifting.pathSuffix}`,
      },
      {
        id: '03',
        title: 'ユニクロ（正方形）',
        image: `${constants.gifting.pathPrefix}03${constants.gifting.pathSuffix}`,
      },
    ];

    expect(
      gifting({ ...initialState, messageCards }, {
        type: SELECT_GIFT_CARD,
        messageCardId: '01',
      })
    ).toMatch({
      giftBagAmounts: {},
      giftBags: [],
      isGiftBagAmountsLoaded: false,
      isGiftBagsLoaded: false,
      isMessageCardAmountsLoaded: false,
      isMessageCardsLoaded: false,
      message: '',
      messageAmounts: {},
      messageCards: [
        {
          id: '01',
          title: 'ユニクロ',
          image: `${constants.gifting.pathPrefix}01${constants.gifting.pathSuffix}`,
        },
        {
          id: '02',
          title: 'ジーユー',
          image: `${constants.gifting.pathPrefix}02${constants.gifting.pathSuffix}`,
        },
        {
          id: '03',
          title: 'ユニクロ（正方形）',
          image: `${constants.gifting.pathPrefix}03${constants.gifting.pathSuffix}`,
        },
      ],
      selectedGiftBox: null,
      selectedMessageCard: {
        id: '01',
      },
    });
  });
});
