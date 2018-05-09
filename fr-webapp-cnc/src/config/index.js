// TODO maybe this won't be ok because of babel .. ?
const utils = require('utils/formatDate');

const environment = {
  development: {
    isProduction: false,
  },
  production: {
    isProduction: true,
  },
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  brand: 'uq',
  region: 'jp',
  app: {
    title: 'UNIQLO｜ユニクロ公式サイト',
    description: `ユニクロの企業情報、公式オンラインストア（通販サイト）。
      あらゆる人が良いカジュアルを着られるようにする新しい日本の企業、株式会社ユニクロ(UNIQLO CO., LTD.)
      についての情報が満載。オンラインストアでは、税抜5,000円以上で送料無料。大きいサイズ、小さいサイズ、
      大型店・オンライン限定アイテムなど大人からベビーまでユニクロ最大の品揃え。`,
    head: {
      titleTemplate: 'UNIQLO・GU　｜　ユニクロ・ジーユー公式サイト : %s',
      meta: [
        { name: 'description', content: 'ユニクロの企業情報、公式オンラインストア（通販サイト）' },
        { charset: 'utf-8' },
        { property: 'og:site_name', content: 'UNIQLO' },
        { property: 'og:image', content: '' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:title', content: 'UNIQLO' },
        { property: 'og:description', content: 'ユニクロの企業情報、公式オンラインストア（通販サイト' },
        { property: 'og:card', content: 'summary' },
        { property: 'og:site', content: '@fastretailing' },
        { property: 'og:creator', content: '@fastretailing' },
        { property: 'og:image:width', content: '200' },
        { property: 'og:image:height', content: '200' },
      ],
    },
    localStorageKeys: {
      authStorage: 'uniqloToken',
      orderPlacedFlag: 'orderPlacedFlag',
      applePayFlag: 'applePayFlag',
    },
    sessionStorageKeys: {
      dontCareNextDayDelvFlag: 'dontCareNextDayDelv',
      checkoutStatus: 'checkoutStatus',
    },
    cookies: {
      accountPlatformCookie: 'OP.LGN',
      domain: 'uniqlo.com',
      // UQ cookie names
      cartTokenUqCookie: 'tvu',
      cartNumberUqCookie: 'mcnu',
      // The path where GDS will create the cart cookies
      cartPath: '/jp',
      // GU cookie names
      cartTokenGuCookie: 'tvg',
      cartNumberGuCookie: 'mcng',
      // CMR = Cart Merger Revival
      cartCMRCookie: 'cmr',
      // Cookie to disable Analytics when loaded from Line App
      disableAnalytics: 'fromLine',
      // cart items count(NOI = number of items) and cart total(SBT = shopping bag total) cookies
      cartNumberCookie: {
        uq: 'NOIU',
        gu: 'NOIG',
      },
      cartTotalCookie: {
        uq: 'SBTU',
        gu: 'SBTG',
      },
      eHPreservedError: 'eHError',
      // Affiliate cookies
      affiliateCookies: {
        // New CA cookies
        ca: {
          siteId: 'CA_TID',
          timeEntered: 'CA_TIME_ENTERED',
        },
        // LinkShare cookies
        ls: {
          siteId: 'LS_TID',
          timeEntered: 'LS_TIME_ENTERED',
        },
      },
      // 7 days in milliseconds
      cartExpires: utils.WEEK,
      orderCookie: 'uniqlo-order',
      orderReceiptStatus: 'order-receipt',
      gdsCookie: 'JSESSIONID',
      dispSiteCookie: 'DISPSITE',
      // The path where GDS will create the cookie
      gdsCookiePath: '/jp/',
      redirectCookie: 'uniqlo-redirect',
      // In minutes
      redirectCookieExpires: 10,
      // checkout button flow constants
      checkoutKey: 'cof',
      checkoutPath: '/jp',
      checkoutExpires: utils.WEEK,
      // Selected store coupon Ids for coupon barcode pages
      couponIds: 'couponIds',
      // Redirect cookie CVS address editing.
      cvsRedirectKey: 'delivery',
      cvsRedirectCookie: 'orderReview',
      cvsRedirectCookieExpires: utils.DAY,
      cvsRedirectCookiePath: '/jp/',
      loginSupportCookie: 'app-login-support',
      // loginSupportCookie Expiry in days
      loginSupportCookieExpires: 7,
      recentlyViewed: 'VIEWED_ITEM',
      // cookie key for order hash key (order details page)
      orderKey: 'order-hash',
      resetCheckoutSession: 'resetCheckoutSession',
      // Apple Pay
      applePayCookie: 'apple_pay_user_status',
      conciergeStoreId: 'concierge_store',
      // In minutes
      applePayCookieExpires: 5,
    },
    wishlistKeys: {
      uq: {
        products: 'uq_jp_acpf_wishlist',
        styles: 'uq_jp_acpf_sb_wishlist',
      },
      gu: {
        products: 'gu_jp_acpf_wishlist',
      },
    },

    sensitive: {
      timeToForceLogin: 25 * utils.MINUTE,
      pages: [
        /\/checkout/,
        /\/account/,
      ],
    },
  },
  // Error codes returned by API calls for statusCode 200
  errorCodes2xx: [
    '2215',
    '2222',
    '2223',
    '2224',
    '2226',
    '2225',
    '2227',
    '2002',
    '2401',
    '2236',
    '2202',
    '2434',
  ],
  commentsUrl: [
    'demo.uniqlo.com',
    'ariake3.uniqlo.com',
    'test3.uniqlo.com',
  ],
}, environment);
