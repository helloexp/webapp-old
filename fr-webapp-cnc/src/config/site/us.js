import { brandName } from 'config/site/default';

const logo = require('images/jp-logo.png');

export default {
  CURRENCY_SYMBOL: '$',
  ABOUT_TLS_URL: 'https://faq.uniqlo.com/articles/FAQ/100004148',
  account: {
    scanDeChanceBaseUrl: 'https://{%hostname}/jp/scandechance/sp/',
    memberRegistry: 'https://{%hostname}/jp/member/registry',
    memberInfo: 'https://{%hostname}/jp/account',
  },
  ANALYTICS: {
    code: 'UA-76355147-1',
    appName: 'Ariake',
  },
  goToTop: {
    text: 'Top',
    top: 350,
    duration: 500,
  },
  brand: {
    logo,
    name: 'Uniqlo',
  },
  countryCode: '392',
  cart: {
    maxItemCounter: 10,
  },
  tickerDuration: 4000,

  // Default location to Ginza
  // For picking up at Uniqlo store
  location: {
    lat: 35.67013523,
    long: 139.7635113,
  },
  PDP: {
    alterationTypes: {
      2: {
        alterationLabel: 'W仕上げ補正',
      },
      3: {
        alterationLabel: '袖丈補正',
      },
      4: {
        alterationLabel: '股下補正',
      },
      5: {
        alterationLabel: '股下補正',
      },
      6: {
        alterationLabel: '股下補正',
      },
      7: {
        alterationLabel: '裄丈補正',
      },
      9: {
        alterationLabel: '着丈補正',
      },
      A: {
        alterationLabel: '着丈補正',
      },
      B: {
        alterationLabel: '袖丈補正',
      },
      C: {
        alterationLabel: '股下補正',
      },
      D: {
        alterationLabel: '袖丈補正',
      },
      E: {
        alterationLabel: 'チェーンステッチ補正',
      },
      F: {
        alterationLabel: 'カットオフ補正',
      },
      default: {
        alterationLabel: '補正',
      },
    },
    inseamTypes: {
      0: {
        name: 'Non',
        lengthLabel: 'レングス',
      },
      1: {
        name: 'Single',
        lengthLabel: 'レングス／桁丈',
      },
      2: {
        name: 'Double',
        lengthLabel: 'レングス／桁丈',
      },
      3: {
        name: 'Suit',
        lengthLabel: '着丈',
      },
      4: {
        name: 'WarmEasy',
        lengthLabel: 'レングス／桁丈',
      },
      5: {
        name: 'BlindStitch',
        lengthLabel: 'レングス／桁丈',
      },
      6: {
        name: 'SingleStitch',
        lengthLabel: 'レングス／桁丈',
      },
      7: {
        name: 'BlindStitch / Double',
        lengthLabel: 'レングス／桁丈',
      },
      8: {
        name: 'BlindStitch / SingleStitch',
        lengthLabel: 'レングス／桁丈',
      },
      9: {
        name: 'BlindStitch / SingleStitch / Double',
        lengthLabel: 'レングス／桁丈',
      },
      A: {
        name: 'Shirt',
        lengthLabel: '着丈',
      },
      B: {
        name: 'チェーンスティッチ',
        lengthLabel: 'レングス／桁丈',
      },
      C: {
        name: 'スカート',
        lengthLabel: 'スカート丈',
      },
      D: {
        name: 'ワンピース',
        lengthLabel: '着丈',
      },
      E: {
        name: '既成ジャケット',
        lengthLabel: '袖丈',
      },
      F: {
        name: 'Kids',
        lengthLabel: 'レングス／桁丈',
      },
      G: {
        name: 'コート',
        lengthLabel: '袖丈',
      },
      H: {
        name: 'カットオフ',
        lengthLabel: 'レングス／桁丈',
      },
      I: {
        name: 'たたき/カットオフ',
        lengthLabel: 'レングス／桁丈',
      },
      J: {
        name: 'たたき/チェーンステッチ/カットオフ',
        lengthLabel: 'レングス／桁丈',
      },
      K: {
        name: 'たたき/まつり/カットオフ',
        lengthLabel: 'レングス／桁丈',
      },
      L: {
        name: 'たたき/まつり/ダブル/カットオフ',
        lengthLabel: 'レングス／桁丈',
      },
    },
  },
  search: {
    sortOptions: {
      latest: 'salesStart desc',
      cheap: 'price asc',
      descending: 'price desc',
      score: 'score desc',
    },
    // dummy url for now - need the vistual search url here
    visualSearchLink: '/jp/',
    historyKeys: 100,
    panelTabs: ['WOMEN', 'MEN', 'BOYS', 'GIRLS', 'BABY'],
  },
  customer: {
    guide: {
      uq: 'https://faq.uniqlo.com/',
      gu: 'https://faq.gu-global.com/pkb_Home_GU?l=ja&c=category_gu%3AGU_C1',
    },
    paymentInstruction: 'https://faq.uniqlo.com/articles/FAQ/100004235',
  },
  stock: {
    inventoryTypeEC: [4, 7],
    inventoryTypeStock: [1],
  },
  UQ_GIFT_CARD_URL: 'https://www.giftcard.ne.jp/gift/carduser/CardUserLoginPage/open.do?key=29ed3645f52e8a5a',
  uniqueShippingStatus: {
    deliveryCompany: '配送会社',
    deliverySlipNumber: '配送伝票番号',
    70: {
      companyText: '日本郵便',
      companyLink: 'http://www.post.japanpost.jp/',
      slipNumberLink: 'http://tracking.post.japanpost.jp/services/sp/srv/search/direct?reqCodeNo*=',
    },
    60: {
      companyText: 'ヤマト運輸',
      companyLink: 'http://www.kuronekoyamato.co.jp/',
      slipNumberLink: 'http://jizen.kuronekoyamato.co.jp/jizen/servlet/crjz.b.NQ0010?id=',
    },
    50: {
      companyText: '佐川急便',
      companyLink: 'http://www.sagawa-exp.co.jp/',
    },
  },
  uniqueUQStoreStatus: {
    delieryStoreName: '受取り店舗名',
    deliveryStoreLink: 'https://map.uniqlo.com/jp/ja/detail/',
  },
  uniqueSEJStatus: {
    delieryStoreName: '受取り店舗名',
    deliverySlipNumber: 'コンビニ受取り引換票(払込票)番号',
  },
  uniqueLawsonStatus: {
    delieryStoreName: '受取り店舗名',
    pickupNumberOrPassword: 'お問い合わせ番号 / 認証番号',
  },
  uniqueFMStatus: {
    delieryStoreName: '受取り店舗名',
    pickupNumberOrPassword: '店頭受取番号 / 認証番号',
  },
  tickerData: [
    {
      timer: 4000,
      content: {
        [brandName.uq]: [],
        [brandName.gu]: [
          {
            type: 'critical',
            designType: 'gray',
            url: 'http://www.uniqlo.com/jp/store/feature_mb/gu/guide/begginer/index.html',
            src: 'https://im.uniqlo.com/jp/spa/gu/ticker_gu_170213.jpg',
          },
        ],
      },
    },
  ],
  footer: {
    links: {
      [brandName.uq]: {
        uniqloTop: 'http://{%hostname}/jp/',
        wishlist: 'http://{%hostname}/jp/wishlist',
        cart: 'http://{%hostname}/jp/cart',
        search: 'http://{%hostname}/jp/store/search?customer_search=true',
        storeLocator: 'https://{%hostname}/jp/ja/',
        onlineStore: 'http://{%hostname}/jp/sp/',
        userGuide: 'https://faq.uniqlo.com/',
        uniqloApp: 'http://{%hostname}/jp/app/sp/',
        memberInfo: 'https://{%hostname}/jp/account',
      },
      [brandName.gu]: {
        uniqloTop: 'http://{%hostname}/jp/sp/',
        wishlist: 'http://{%hostname}/jp/gu/likelist/',
        cart: 'http://{%hostname}/jp/cart?brand=gu',
        search: 'http://{%hostname}/jp/store/search?qbrand=20',
        storeLocator: 'https://gu.mapion.co.jp/b/gu_s/',
        onlineStore: 'http://{%hostname}/jp/',
        userGuide: 'https://faq.gu-global.com/pkb_Home_GU?l=ja&c=category_gu%3AGU_C1',
        uniqloApp: 'http://{%hostname}/jp/app/sp/',
        memberInfo: 'https://{%hostname}/jp/account?brand=gu',
      },
    },
  },
  purchaseHistory: {
    [brandName.uq]: 'https://{%hostname}/jp/order/history',
    [brandName.gu]: 'https://{%hostname}/jp/gu/order/history',
  },
  reviewUser: {
    [brandName.uq]: 'https://{%hostname}/jp/review/user/uq/sp/',
    [brandName.gu]: 'https://{%hostname}/jp/review/user/gu/sp/',
  },
  deliveryMethodDetailsLink: 'https://faq.uniqlo.com/articles/FAQ/100004118',
  GUAPP_USER_URL: 'https://d1pbsrgr056fxf.cloudfront.net/ja/faq/',
  LIKE_LIST_URL: 'http://{%hostname}/jp/gu/likelist/',
  GU_LINK_TO_TOP_PAGE: 'http://{%hostname}/',
  UQ_LINK_TO_TOP_PAGE: 'https://{%hostname}/us/en/',
  LINK_TO_CVS_GUIDE: {
    uq: 'https://faq.uniqlo.com/articles/FAQ/100001557/',
    gu: 'https://faq.gu-global.com/articles/FAQ/100005399/',
  },
  LINK_TO_EDIT_MEMBER: 'https://{%hostname}/jp/member/edit',
  STYLE_LIST_URL: 'http://{%hostname}/jp/stylingbook/sp/style/{%id}',
  ABOUT_COUPONS: 'https://faq.uniqlo.com/articles/FAQ/100001728',
  mySize: {
    aboutNude: 'http://uniqlo.knospear.jp/support/nudesize/nude_00.html',
    topSizes: 'http://{%hostname}/jp/store/support/nudesize/nude_00.html#/page/02',
    womenSizes: 'http://{%hostname}/jp/store/support/nudesize/nude_00.html#/page/02/06',
    bottomSizes: 'http://{%hostname}/jp/store/support/nudesize/nude_00.html#/page/03',
  },
};
