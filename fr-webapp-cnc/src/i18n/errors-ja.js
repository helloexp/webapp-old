import iff from 'utils/iff';

export default function errors() {
  const {
    currentPage: {
      pdp: isPDP,
      reviewOrder: isReviewOrderPage,
      coupons: isCouponsPage,
      delivery: isDeliveryPage,
      payment: isPaymentPage,
      orderCancel: isOrderCancelPage,
      checkout,
      creditCard: isCreditCardPage,
    },
    errorHandler: { customErrorKey },
  } = this;

  const shipToMessage = customErrorKey === 'saveShippingAddress'
    ? '商品金額がご指定の配送方法に必要な金額に達していません。再度ご注文内容をご確認ください。'
    : 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。';

  const more1001PostErrs = {
    verifyGiftCard: 'ギフトカード番号とPINの入力内容を再度ご確認ください。',
    coupon: 'クーポンコードの入力内容を再度ご確認ください。',
    applePayOrder: '注文情報を再度ご確認ください。',
  };

  const more1001PutErrs = {
    saveShippingAddress: '配送先情報を再度ご確認ください。',
    setBillingAddress: '請求先情報を再度ご確認ください。',
  };

  const more2430PostErrs = {
    placeOrder: 'ご登録頂いたギフトカードはオンラインサイトでは利用できません。',
    verifyGiftCard: 'このギフトカードはオンラインサイトでは利用できません。',
  };

  /**
   * LEGEND :)
   * ---------
   * D - DELETE
   * G - GET
   * P - POST
   * U - PUT (update)
   * DEFAULT - default option
   */

  return {
    '5xx': {
      G: customErrorKey === 'couponLoad' ? '現在、利用可能なクーポンはございません。' :
        '店舗が検索できませんでした。都道府県やフリーワードを再度指定のうえ、検索ボタンを押してください。' +
        '※一部のブラウザや位置情報取得を許可しなかった場合は「近隣店舗」を指定することはできません。',
      DEFAULT: iff(
        customErrorKey === 'registerUserAddress',
        '会員登録に失敗しました。',
        iff(
          isCouponsPage,
          '現在、利用可能なクーポンはございません。',
          'エラーが発生しました。',
        ),
      ),
    },
    CHECK_INPUT: {
      DEFAULT: 'あなたの入力を確認してください。',
    },
    APPLE_PAY_PAYMENT_SHEET: {
      DEFAULT: 'エラーが発生しました。',
    },
    0: {
      DEFAULT: 'エラーが発生しました。',
    },
    101: {
      DEFAULT: customErrorKey === 'applePayPIB' && '郵便番号を入力してください。',
    },
    118: {
      DEFAULT: customErrorKey === 'applePayPIB' && '郵便番号は正しく入力してください。',
    },
    401: {
      DEFAULT: customErrorKey === 'registerUserAddress' && '会員登録に失敗しました。',
    },
    409: {
      DEFAULT: customErrorKey === 'registerUserAddress' && '入力されたメールアドレスは既に登録されているためご使用になれません。別のメールアドレスを入力してください。',
    },
    422: {
      DEFAULT: iff(
        customErrorKey === 'uqAccPfError',
        'エラーが発生しました。',
        iff(
          customErrorKey === 'registerUserAddress',
          '会員登録に失敗しました。',
        ),
      ),
    },
    1001: {
      U: customErrorKey !== 'applePayPIB'
        && (more1001PutErrs[customErrorKey] || [
          '全角で入力してください。',
          '20字×9行以内でご入力ください(20字で改行してください)。',
          '10行目以降は、メッセージカードに印字されません。',
          '※丸囲み文字、ローマ数字などの機種依存文字は、文字化けの原因になりますので使用しないでください。',
        ].join('\n')),
      P: more1001PostErrs[customErrorKey] || 'エラーが発生しました。',
      DEFAULT: 'エラーが発生しました。',
      HALF_SIZE_COUPON: 'クーポンコードは半角で入力してください。',
    },
    2001: {
      G: (isPaymentPage || isReviewOrderPage) && customErrorKey === 'blueGateCreditCardError'
        ? '予期せぬエラーが発生しました。注文登録中の場合は注文状況をご確認ください。'
        : '',
      DEFAULT: ['applePayOrder', 'applePayPIB'].includes(customErrorKey) && 'エラーが発生しました。',
    },
    2002: {
      G: '現在ギフトカードをご利用頂くことができません。',
      // P: applePayOrder
      P: customErrorKey === 'applePayOrder' && 'エラーが発生しました。',
      U: customErrorKey === 'applePayPIB' ? 'エラーが発生しました。' : '',
    },
    2101: {
      P: !isPDP && 'カート内に商品がありません。',
      // U: applePayPIB
      DEFAULT: 'カート内に商品がありません。',
    },
    2102: {
      // P: applePayOrder
      P: '再度ご注文内容をご確認ください。',
    },
    2103: {
      // P: applePayOrder
      P: '再度ご注文内容をご確認ください。',
    },
    2104: {
      // P: applePayOrder
      P: '再度ご注文内容をご確認ください。',
    },
    2107: {
      G: !isPaymentPage ? '再度お支払い方法をご確認ください。' : '',
      U: customErrorKey === 'applyGiftCard' && '再度お支払い方法をご確認ください。',
      DEFAULT: !isPaymentPage ? '再度お支払い方法をご確認ください。' : '',
    },
    2108: {
      P: '再度ご注文内容をご確認ください。',
      D: '',
      U: '',
      G: !checkout && '再度お支払い方法をご確認ください。',
    },
    2110: {
      G: '再度ご注文内容をご確認ください。',
      P: customErrorKey === 'applePayOrder' && '再度ご注文内容をご確認ください。',
    },
    2112: {
      DEFAULT: '再度お支払い方法をご確認ください。',
    },
    2114: { U: 'ご指定の処理はできませんでした。再度ご確認ください。' },
    2115: { P: 'この商品は販売することができません。再度ご確認ください。' },
    2116: {
      G: isOrderCancelPage ? '注文をキャンセルできませんでした。' : 'ご注文を受け付けました。注文は正常に完了しておりますが、注文情報表示時にエラーが発生しました。'
              + '恐れ入りますが注文履歴画面あるいは注文完了メールをご確認ください。',
      D: '注文をキャンセルできませんでした。',
    },
    2123: { G: 'ご指定の店舗には配送することができません。' },
    2124: {
      // G: loadSplitDetails
      G: 'エラーが発生しました。',
      U: customErrorKey === 'applePayPIB' && 'エラーが発生しました。',
    },
    2201: {
      D: '',
      G: '',
      P: '再度ご注文内容をご確認ください。',
      // U: applePayPIB ■ P: applePayOrder
      DEFAULT: '再度ご注文内容をご確認ください。',
    },
    2202: {
      P: iff(
          customErrorKey === 'applePayOrder',
          '再度ご注文内容をご確認ください。',
          iff(
            customErrorKey === 'backToCart',
            '注文可能な個数を超えています。商品の数量を変更してください。',
            iff(
              isCouponsPage,
              'ご指定のクーポンはご利用いただけません。',
              '再度ご注文内容をご確認ください。'
            )
          )
        ),
      // U: applePayPIB
      U: ['backToCart', 'addToExistingCart', 'setCartItemCount'].includes(customErrorKey)
        ? '10万円を超える購入はできません。'
        : '再度ご注文内容をご確認ください。',
      DEFAULT: '再度ご注文内容をご確認ください。',
    },
    2203: {
      // P: applePayOrder
      P: '再度ご注文内容をご確認ください。',
      // U: applePayPIB
      U: customErrorKey === 'applePayPIB'
        ? '再度ご注文内容をご確認ください。'
        : '注文可能な金額を超えています。商品の数量を変更してください。',
    },
    2204: {
      // P: applePayOrder
      P: isPaymentPage ? '再度ご注文内容をご確認ください。' : 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。',
      U: isReviewOrderPage || customErrorKey === 'setDeliveryType'
          ? 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。'
          : '商品金額がご指定の配送方法の上限金額を超えています。再度ご注文内容をご確認ください。',
    },
    2205: {
      P: customErrorKey === 'applePayOrder' ? 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。' : '再度ご注文内容をご確認ください。',
      U: customErrorKey === 'setBillingAddress'
          ? '再度ご注文内容をご確認ください。'
          : shipToMessage,
    },
    2206: {
      // P: applePayOrder
      P: iff(
          customErrorKey === 'backToCart',
          '注文可能な個数を超えています。商品の数量を変更してください。',
          '再度ご注文内容をご確認ください。'
        ),
      // U: applePayPIB
      U: '注文可能な個数を超えています。商品の数量を変更してください。',
    },
    2208: {
      // P: applePayOrder
      P: '再度ご注文内容をご確認ください。',
      U: 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。',
    },
    2209: {
      P: 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。',
      D: '',
      G: '',
      DEFAULT: 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。',
    },
    2210: {
      P: customErrorKey === 'saveGiftMessage'
          ? 'ギフトオプションを選択いただいたため、ご指定の配送方法はご利用いただけなくなりました。再度配送方法を指定してください。'
          : 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。',
      U: isDeliveryPage
          ? 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。'
          : 'ギフトオプションを選択いただいたため、ご指定の配送方法はご利用いただけなくなりました。再度配送方法を指定してください。',
    },
    2211: {
      P: 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。',
      U: customErrorKey === 'setPaymentMethod'
          ? '再度お支払い方法をご確認ください。'
          : 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。',
    },
    2212: {
      P: 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。',
      U: customErrorKey === 'setPaymentMethod'
          ? '再度お支払い方法をご確認ください。'
          : 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。',
    },
    2213: {
      // P: applePayOrder
      P: '予約商品が含まれているため、配送日時をご指定いただくことができません。配送方法を再度選択してください。',
      U: 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。',
    },
    2214: {
      G: '',
      D: '',
      DEFAULT: '再度お支払い方法をご確認ください。',
    },
    2215: {
      G: 'ご登録頂いたギフトカードはご利用いただけません。',
      D: '',
      DEFAULT: '再度お支払い方法をご確認ください。',
    },
    2216: {
      P: 'ギフトオプションが無効です。再度ご確認ください、',
    },
    2217: {
      G: '',
      D: '',
      DEFAULT: 'この商品は販売することができません。再度ご確認ください。',
    },
    2218: {
      P: (isReviewOrderPage || customErrorKey === 'applePayOrder')
          ? 'お客様が選択された補正値はご指定いただけません。'
          : '選択された商品は、ご指定の補正方法をご利用になれません。',
      U: customErrorKey === 'applePayPIB'
        ? 'お客様が選択された補正値はご指定いただけません。'
        : 'お客様が選択されたすそ上げ方法では、補正値をご指定いただけません。',
    },
    2219: {
      P: (isReviewOrderPage || customErrorKey === 'applePayOrder')
          ? '補正必須商品です。補正値を設定して下さい。'
          : '補正情報が正しく設定されていません。ご確認のうえ、再度ご指定ください。',
      U: '補正必須商品です。補正値を設定して下さい。',
    },
    2220: {
      P: (isReviewOrderPage || customErrorKey === 'applePayOrder')
          ? '補正必須商品です。補正値を設定して下さい。'
          : '補正情報が正しく設定されていません。ご確認のうえ、再度ご指定ください。',
      U: '補正必須商品です。補正値を設定して下さい。',
    },
    2221: {
      G: '',
      D: '',
      DEFAULT: 'ご指定の補正値は補正可能な範囲を超えています。ご確認のうえ、再度ご指定ください。',
    },
    2222: {
      D: '',
      G: isPaymentPage ? 'ご登録頂いたギフトカードはご利用いただけません。' : '',
      DEFAULT: '残高がありません。',
    },
    2223: {
      G: 'ご登録頂いたギフトカードはご利用いただけません。',
      P: '正しいギフトカード番号・PIN番号を入力してください。',
    },
    2224: {
      G: 'ご登録頂いたギフトカードはご利用いただけません。',
      P: 'このギフトカードは無効です。',
    },
    2225: {
      G: 'ご登録頂いたギフトカードはご利用いただけません。',
      P: 'ギフトカードの有効期限が切れています。',
    },
    2226: {
      G: 'ご登録頂いたギフトカードはご利用いただけません。',
      P: 'このギフトカードは現在利用停止中です。',
    },
    2227: {
      G: isPaymentPage && customErrorKey !== 'blueGateCreditCardError'
          ? '現在ギフトカードはご使用いただけません。'
          : '現在ギフトカードをご利用頂くことができません。再度お支払い方法をご確認ください。',
      P: isReviewOrderPage
          ? '現在ギフトカードはご使用いただけません。'
          : '現在ギフトカードをご利用頂くことができません。再度お支払い方法をご確認ください。',
    },
    2228: { P: 'このブランドで発行されたギフトカードは使用できません。' },
    2229: { P: 'このギフトカードは既に利用しています。' },
    2230: { P: 'ご利用枚数が上限を超えています。' },
    2231: { D: '', G: '', DEFAULT: '注文可能な数量を超えています。商品の数量を変更してください。' },
    2232: {
      // P: applePayOrder
      P: '再度ご注文内容をご確認ください。',
    },
    2234: { D: '', G: '', DEFAULT: 'この商品は選択頂いた配送方法をご利用いただけません。' },
    2235: {
      G: customErrorKey === 'loadGiftCards' && 'ご利用額が支払額(税込み)を超えています。',
      U: 'ご利用額が支払額(税込み)を超えています。',
    },
    2236: {
      G: 'ギフトカード利用額が残高を超えています。',
      U: 'ギフトカード利用額が残高を超えています。',
    },
    2237: { P: '再度お支払い方法をご確認ください。' },
    2238: {
      // P: applePayOrder
      P: '再度ご注文内容をご確認ください。',
    },
    2239: {
      D: '',
      DEFAULT: iff(
        !(customErrorKey === 'loadGiftCards' && isPaymentPage),
        iff(
          (customErrorKey === 'applePayOrder' || customErrorKey === 'applePayPIB'),
          'ギフトカードがすでに選択されておりますが、ApplePayではご利用になれません。',
          '再度お支払い方法をご確認ください。',
          ),
        ),
    },
    2240: {
      // P: applePayOrder
      P: '注文内容が更新されました。再度お支払い方法をご確認ください。',
    },
    2241: {
      D: '',
      // P: applePayOrder
      DEFAULT: '再度お支払い方法をご確認ください。',
    },
    2242: {
      D: '',
      U: '',
      // P: applePayOrder
      DEFAULT: '支払い処理エラーが発生しました。再度お支払い情報を設定の上、ご注文ください。',
    },
    2243: {
      D: '',
      U: '',
      // P: applePayOrder
      DEFAULT: '現在クレジットカードはご使用いただけません。',
    },
    2244: {
      U: '',
      D: '',
      G: isCreditCardPage
        ? 'クレジットカード情報を登録することができませんでした。クレジットカード情報をご確認のうえ、再度ご登録をお願いします。'
        : '支払い処理エラーが発生しました。再度お支払い情報を設定の上、ご注文ください。',
      P: '支払い処理エラーが発生しました。再度お支払い情報を設定の上、ご注文ください。',
    },
    2245: {
      // P: applePayOrder
      DEFAULT: 'ご入力いただいたカード情報は、ご利用いただけません。クレジットカード情報をご確認のうえ、再度ご登録をお願いします。',
    },
    2246: {
      D: '',
      U: '',
      G: isCreditCardPage
        ? 'ご指定のクレジットカードは登録することができません。'
        : 'ご指定のクレジットカードは現在ご利用いただけません。再度お支払い方法をご確認ください。',
      // P: applePayOrder
      P: 'ご指定のクレジットカードは現在ご利用いただけません。再度お支払い方法をご確認ください。',
    },
    2247: {
      U: 'ご利用額を入力してください。',
    },
    2248: {
      U: '正しいご利用額を入力して下さい。',
    },
    2249: {
      U: 'ご利用額が支払額(税込み)に達しているため、新しいギフトカードは登録できません。',
    },
    2251: {
      P: '再度お支払い方法をご確認ください。',
    },
    2252: {
      P: 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。',
    },
    2253: {
      P: 'セキュリティコードを入力してください。',
    },
    2254: {
      // P: applePayOrder
      P: '再度お支払い方法をご確認ください。',
    },
    2255: {
      D: '',
      U: '',
      // P: applePayOrder
      DEFAULT: '再度お支払い方法をご確認ください。',
    },
    2256: {
      G: '注文をキャンセルできませんでした。',
      D: '注文をキャンセルできませんでした。',
    },
    2257: {
      G: '注文をキャンセルできませんでした。',
      D: '注文をキャンセルできませんでした。',
    },
    2259: {
      // P: applePayOrder
      P: '注文内容が更新されました。再度ご確認ください。',
      G: '注文をキャンセルできませんでした。',
      D: '注文をキャンセルできませんでした。',
    },
    2260: {
      G: '注文をキャンセルできませんでした。',
      D: '注文をキャンセルできませんでした。',
    },
    2262: { P: '再度お支払い方法をご確認ください。' },
    2263: {
      G: 'ご利用いただけないギフトカードがございます。再度お支払い方法をご確認ください。',
      P: '再度お支払い方法をご確認ください。',
    },
    2264: {
      G: 'ご利用いただけないギフトカードがございます。再度お支払い方法をご確認ください。',
      P: '再度お支払い方法をご確認ください。',
    },
    2265: {
      G: 'ご利用いただけないギフトカードがございます。再度お支払い方法をご確認ください。',
      P: 'ご登録頂いたギフトカードはご利用いただけません。',
    },
    2266: {
      G: '現行エラーメッセージを表示する。' +
        'ご利用のギフトカードの残高を戻すことが出来ませんでした。恐れ入りますが、ユニクロ・ジーユーオンラインお客様窓口までお問い合わせください。',
      U: '',
      D: isOrderCancelPage ? 'ご利用のギフトカードの残高を戻すことが出来ませんでした。恐れ入りますが、ユニクロ・' +
        'ジーユーオンラインお客様窓口までお問い合わせください。' : '注文をキャンセルできませんでした。',
      DEFAULT: 'ご利用のギフトカードの残高を戻すことが出来ませんでした。' +
        '恐れ入りますが、ユニクロ・ジーユーオンラインお客様窓口までお問い合わせください。',
    },
    2267: {
      G: '再度お支払い方法をご確認ください。',
      P: '現在クレジットカード情報を登録することができません。',
    },
    2268: { D: '', G: '', DEFAULT: 'この商品は選択頂いたお支払い方法をご利用いただけません。' },
    2269: { D: '', G: '', DEFAULT: 'この商品は選択頂いたお支払い方法をご利用いただけません。' },
    2270: { D: '', G: '', DEFAULT: 'この商品は選択頂いたお支払い方法をご利用いただけません。' },
    2271: { D: '', G: '', DEFAULT: 'この商品は選択頂いたお支払い方法をご利用いただけません。' },
    2272: {
      P: 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。',
      U: isDeliveryPage
          ? 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。'
          : '再度お支払い方法をご確認ください。',
    },
    2273: {
      D: '',
      G: '',
      DEFAULT: '再度お支払い方法をご確認ください。',
    },
    2274: {
      P: 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。',
      U: '再度お支払い方法をご確認ください。',
    },
    2275: {
      P: 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。',
      U: '再度お支払い方法をご確認ください。',
    },
    2276: {
      P: 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。',
      U: '再度お支払い方法をご確認ください。',
    },
    2277: {
      D: '',
      G: '',
      DEFAULT: '再度お支払い方法をご確認ください。',
    },
    2278: { P: '再度ご注文内容をご確認ください。' },
    2279: { P: '再度お支払い方法をご確認ください。' },
    2280: {
      G: '注文をキャンセルできませんでした。',
      D: '注文をキャンセルできませんでした。',
    },
    2281: { P: '再度お支払い方法をご確認ください。' },
    2282: {
      P: 'ギフトオプションを選択いただいたため、ご指定の配送方法はご利用いただけなくなりました。再度配送方法を指定してください。',
      U: 'ギフトオプションを選択いただいたため、ご指定の配送方法はご利用いただけなくなりました。再度配送方法を指定してください。',
    },
    2283: { U: 'ギフトバッグを選択してください。' },
    2284: { U: 'メッセージカードを選択してください。' },
    2285: { U: 'メッセージカードは選択できません。' },
    2286: {
      U: '',
      DEFAULT: '他のクーポンが適用されています。',
    },
    2287: {
      U: '',
      D: '',
      P: 'ご指定のクーポンはご利用いただけません。',
      DEFAULT: '入力されたクーポンIDは利用できません。',
    },
    2288: {
      G: 'ごこちらのクーポンは期限切れのため利用できません。',
      P: customErrorKey === 'applePayOrder' ? 'ご指定のクーポンはご利用いただけません。' : 'こちらのクーポンは期限切れのため利用できません。',
      U: '',
      DEFAULT: 'ご指定のクーポンはご利用いただけません。',
    },
    2289: {
      P: 'ご指定のクーポンは利用可能金額に達していません。',
    },
    2290: {
      U: '',
      D: '',
      // P: applePayOrder
      DEFAULT: customErrorKey === 'applePayOrder' ? 'ご指定のクーポンはご利用いただけません。' : 'こちらのクーポンは使用済みのため利用できません。',
    },
    2291: {
      G: '現在、メンテナンス中のため利用できません。',
      P: customErrorKey === 'applePayOrder' ? 'ご指定のクーポンはご利用いただけません。' : 'こちらのクーポンは利用可能な回数を超えています。',
      U: '',
      DEFAULT: 'ご指定のクーポンはご利用いただけません。',
    },
    2292: {
      // P: applePayOrder
      P: 'ご指定のクーポンは利用可能金額に達していません。',
    },
    2293: {
      // P: applePayOrder
      P: 'ご指定のクーポンは利用可能金額に達していません。',
    },
    2294: {
      // P: applePayOrder
      P: 'ご指定のクーポンは利用可能金額に達していません。',
    },
    2295: {
      P: customErrorKey === 'applePayOrder' ? 'ご指定のクーポンはご利用いただけません。' : '他のクーポンが適用されています。',
      U: '',
      // P: applePayOrder
      DEFAULT: 'ご指定のクーポンはご利用いただけません。',
    },
    2296: {
      U: '',
      D: '',
      // P: applePayOrder
      DEFAULT: customErrorKey === 'applePayOrder' ? '現在クーポンはご利用いただけません。' : '現在、メンテナンス中のため利用できません。',
    },
    2297: {
      U: '',
      D: '',
      // P: applePayOrder
      DEFAULT: customErrorKey === 'applePayOrder' ? 'ご指定のクーポンはご利用いただけません。' : 'こちらのクーポンはオンラインストアでは利用できません。',
    },
    2298: {
      U: 'ご指定の処理はできませんでした。再度ご確認ください。',
    },
    2300: {
      P: '再度ご注文内容をご確認ください。',
    },
    2301: {
      P: customErrorKey === 'backToCart' ? 'カート内に商品がありません。' : '再度ご注文内容をご確認ください。',
      // G: loadSplitDetails ■ U: applePayPIB ■ P: applePayOrder
      DEFAULT: '再度ご注文内容をご確認ください。',
    },
    2302: {
      G: isOrderCancelPage ? '注文をキャンセルできませんでした。' : 'ご注文を受け付けました。注文は正常に完了しておりますが、注文情報表示時にエラーが発生しました。' +
        '恐れ入りますが注文履歴画面あるいは注文完了メールをご確認ください。',
      D: isOrderCancelPage ? '注文をキャンセルできませんでした。' : 'ご注文を受け付けました。注文は正常に完了しておりますが、注文情報表示時にエラーが発生しました。',
      P: customErrorKey === 'backToCart' && '商品をカートへ追加できませんでした。',
    },
    2306: {
      U: '正しくログインできませんでした。再度ログインしてください。',
    },
    2307: {
      U: '正しくログインできませんでした。再度ログインしてください。',
    },
    2401: {
      G: 'このギフトカードは正しく登録されていません。カード情報を削除のうえ、再度ご入力ください。',
    },
    2402: {
      G: '再度ご注文内容をご確認ください。',
      P: iff(
          customErrorKey === 'backToCart',
          '商品をカートへ追加できませんでした。',
          iff(
            customErrorKey === 'applePayOrder',
            '再度ご注文内容をご確認ください。',
            iff(
              isCouponsPage,
              'ご指定のクーポンはご利用いただけません。',
              '再度ご注文内容をご確認ください。',
            )
          )
        ),
      // U: applePayPIB
      DEFAULT: '再度ご注文内容をご確認ください。',
    },
    2403: {
      G: isOrderCancelPage ? '注文をキャンセルできませんでした。' : 'ご注文を受け付けました。注文は正常に完了しておりますが、注文情報表示時にエラーが発生しました。' +
          '恐れ入りますが注文履歴画面あるいは注文完了メールをご確認ください。',
      D: '注文をキャンセルできませんでした。',
      P: customErrorKey === 'backToCart' && '商品をカートへ追加できませんでした。',
    },
    2406: {
      P: '再度ご注文内容をご確認ください。',
    },
    2407: {
      P: 'こちらのクーポンは他のブランド用です。',
      U: '',
      DEFAULT: 'ご指定のクーポンはご利用いただけません。',
    },
    2408: {
      U: '再度お支払い方法をご確認ください。',
    },
    2409: {
      P: '再度配送方法をご指定ください。',
      G: '',
      D: '',
      U: '再度配送方法をご指定ください。',
      DEFAULT: '再度配送方法をご指定ください。',
    },
    2410: {
      // P: applePayOrder
      P: '選択されたクーポンはご利用いただけません。',
      U: customErrorKey === 'applePayPIB' ? '現在クーポンはご利用いただけません。' : '',
      D: '',
      DEFAULT: '現在クーポンはご利用いただけません。',
    },
    2411: {
      U: '',
      D: '',
      DEFAULT: customErrorKey === 'applePayOrder' ? 'ご指定のクーポンはご利用いただけません。' : 'クーポン認証エラーのため選択されたクーポンはご利用いただけません。',
    },
    2414: {
      // P: applePayOrder
      P: 'ご指定のお届け方法が利用できなくなりました。再度ご注文内容をご確認ください。',
      D: '',
      G: '',
      U: customErrorKey === 'setDeliveryType'
         ? 'ご指定のお届け方法が利用できなくなりました。再度ご注文内容をご確認ください。'
         : 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。',
      DEFAULT: 'ご指定のお届け方法が利用できなくなりました。再度ご注文内容をご確認ください。',
    },
    2415: {
      P: 'ご指定のお届け方法が利用できなくなりました。再度ご注文内容をご確認ください。',
      D: '',
      G: '',
      DEFAULT: 'ご指定のお届け方法が利用できなくなりました。再度ご注文内容をご確認ください。',
    },
    2416: {
      P: '当日配送を選択された場合は、ギフトバックは選択できません。',
      U: isDeliveryPage && customErrorKey !== 'saveGiftMessage'
        ? '当日配送を選択された場合は、ギフトバックは選択できません。'
        : 'ギフトオプションを選択いただいたため、ご指定の配送方法はご利用いただけなくなりました。再度配送方法を指定してください。',
    },
    2417: {
      D: '',
      G: '',
      DEFAULT: 'この商品は選択頂いた配送方法では補正をご指定いただけません。',
    },
    2419: {
      P: '再度配送方法をご指定ください。',
      D: '',
      G: '',
      DEFAULT: '再度配送方法をご指定ください。',
    },
    2418: {
      // P: applePayOrder
      P: '再度配送方法をご指定ください。',
      U: '再度配送方法をご指定ください。',
    },
    2420: {
      U: '',
      D: '',
      P: customErrorKey === 'applePayOrder' ? 'ご指定の配送方法が利用できなくなりました。再度配送方法をご確認ください。' : '',
      DEFAULT: 'お届け予定日の制限時間を越えました。配送方法から再度選択してください。',
    },
    2421: {
      P: 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。',
      U: isPaymentPage
        ? '再度お支払い方法をご確認ください。'
        : 'ご指定の配送方法が利用できなくなりました。再度ご注文内容をご確認ください。',
    },
    2422: {
      P: '再度配送方法をご指定ください。',
      D: '',
      G: '',
      U: '再度配送方法をご指定ください。',
      DEFAULT: '再度配送方法をご指定ください。',
    },
    2423: {
      // U: applePayPIB
      U: 'ご指定の住所には配送することができません。ご確認のうえ、再度ご指定ください。',
    },
    2424: {
      U: '再度配送方法をご指定ください。',
    },
    2425: {
      U: '再度配送方法をご指定ください。',
    },
    2426: {
      D: '',
    },
    2427: {
      // P: applePayOrder
      P: 'ギフトオプションを選択いただいたため、ご指定の配送方法はご利用いただけなくなりました。再度配送方法を指定してください。',
      U: 'ギフトオプションを選択いただいたため、ご指定の配送方法はご利用いただけなくなりました。再度配送方法を指定してください。',
    },
    2428: {
      // P: applePayOrder
      P: 'ギフトオプションを選択いただいたため、ご指定の配送方法はご利用いただけなくなりました。再度配送方法を指定してください。',
      U: 'ギフトオプションを選択いただいたため、ご指定の配送方法はご利用いただけなくなりました。再度配送方法を指定してください。',
    },
    2429: {
      // P: applePayOrder
      P: 'ギフトオプションを選択いただいたため、ご指定の配送方法はご利用いただけなくなりました。再度配送方法を指定してください。',
      U: customErrorKey === 'setPaymentMethod'
          ? 'ギフトオプションを選択いただいたため、ご指定の配送方法はご利用いただけなくなりました。再度配送方法を指定してください。'
          : 'ご指定の決済方法では選択いただけない配送方法が指定されています。再度配送方法を指定してください。',
    },
    2430: {
      G: customErrorKey === 'loadGiftCards' && 'ご登録頂いたギフトカードはオンラインサイトでは利用できません。',
      P: more2430PostErrs[customErrorKey],
    },
    2431: {
      P: customErrorKey === 'placeOrder' && '代引きが選択されているため、領収書を選択することはできません。',
    },
    2432: {
      P: (customErrorKey === 'placeOrder' || customErrorKey === 'applePayOrder') &&
        'ギフトオプションが選択されているため、領収書を選択することはできません。',
    },
    2433: {
      G: '',
      D: '',
      DEFAULT: '店舗決済でのお届け予定日の制限時間を越えました。配送方法から再度選択してください。',
    },
    2434: {
      // G: loadGiftCards ■ P: verifyGiftCard & placeOrder ■ U: setPaymentMethod
      DEFAULT: 'NP後払いではギフトカードのご利用はできません。',
      D: '',
    },
    2435: {
      P: customErrorKey === 'placeOrder' && '後払いの場合は、領収書の発行はできません。',
    },
    2436: {
      P: customErrorKey === 'placeOrder' && 'NP後払いでは合計金額54,000円を超えるお支払いはできません。他の決済方法の選択をお願いいたします。',
      U: customErrorKey === 'setPaymentMethod' && 'NP後払いでは合計金額54,000円を超えるお支払いはできません。他の決済方法の選択をお願いいたします。',
    },
    2437: {
      G: '',
      D: '',
      DEFAULT: (customErrorKey === 'placeOrder' || customErrorKey === 'setPaymentMethod') &&
        '支払方法：後払いを使用する場合、会員登録情報またはお届け先の、氏名文字数は21文字、住所文字数は55文字以内で入力してください。',
    },
    2438: {
      G: '',
      D: '',
      DEFAULT: (customErrorKey === 'placeOrder' || customErrorKey === 'setPaymentMethod') &&
        '会員情報の中に NP後払いで利用できない文字 (全角/半角の疑問符 "?") が含まれています。' +
        'NP後払いを利用するには文字を修正してください。または、他の支払い方法を選択してください。',
    },
    2439: {
      P: customErrorKey === 'backToCart' && 'エラーが発生しました。',
    },
    2440: {
      // P: applePayOrder
      P: 'エラーが発生しました。',
    },
    2441: {
      // G: loadGiftCards ■ P: verifyGiftCard, placeOrder ■ U: applyGiftCard, setDeliveryType (?)
      G: (customErrorKey === 'loadGiftCards' && isPaymentPage) ? '' : '「個別に発送」ではギフトカードはご利用になれません。',
      DEFAULT: '「個別に発送」ではギフトカードはご利用になれません。',
      D: '',
    },
    2442: {
      // P: addACoupon, placeOrder ■ U: setDeliveryType (?)
      DEFAULT: '「個別に配送」ではクーポンのご利用はできません。',
      D: '',
      G: '',
    },
    2443: {
      // U: adding gifting option, setDeliveryType (?) ■ P: placeOrder
      DEFAULT: 'ギフトオプションを選択いただいたため、ご指定の配送方法はご利用いただけなくなりました。再度配送方法を指定してください。',
      G: '',
      D: '',
    },
    2444: {
      // U: setPaymentMethod, setDeliveryType (?) ■ P: placeOrder
      DEFAULT: '「個別に配送」ではご指定の支払い方法は利用できません。',
      G: '',
      D: '',
    },
    2445: {
      // P: placeOrder ■ U: setDeliveryType (?)
      DEFAULT: '「個別に配送」では、ご指定の配送方法はご利用いただけません。再度配送方法を指定してください。',
      G: '',
      D: '',
    },
    2446: {
      // G: loadSplitDetails ■ P: placeOrder ■ U: setDeliveryType (?)
      DEFAULT: '「個別に配送」を利用できない商品が含まれています。',
      D: '',
    },
    2447: {
      // P: placeOrder ■ U: setDeliveryType (?)
      DEFAULT: '「個別に配送」では、予約商品をご利用いただけません。',
      G: '',
      D: '',
    },
    2448: {
      // P: placeOrder ■ U: setDeliveryType (?)
      DEFAULT: '「個別に配送」はご利用いただけません。再度配送方法を指定してください。',
      G: '',
      D: '',
    },
    2449: {
      // P: placeOrder ■ U: setDeliveryType (?)
      DEFAULT: '「個別に配送」はご利用いただけません。再度配送方法を指定してください。',
      G: '',
      D: '',
    },
    2450: {
      // G: loadSplitDetails
      G: '注文可能な個数を超えています。商品の数量を変更してください。',
    },
    2451: {
      // P: placeOrder
      P: '再度お支払い方法をご確認ください。',
    },
    2456: {
      // P: placeOrder
      P: '「個別に配送」はご利用いただけません。再度配送方法を指定してください。',
      // U: setDeliveryType (?)
      U: 'エラーが発生しました。',
    },
    2457: {
      // P: applePayOrder
      P: 'エラーが発生しました。',
    },
    2458: {
      // P: applePayOrder
      P: 'エラーが発生しました。',
    },
    2459: {
      // P: applePayOrder
      P: 'クーポンをご利用頂く際は、ログインしてください。',
      U: 'クーポンをご利用頂く際は、ログインしてください。',
    },
    2460: {
      G: '',
      D: '',
      U: 'ApplePayは現在ご利用いただけません。',
      // P: applePayOrder
      DEFAULT: 'ApplePayは現在ご利用いただけません。',
    },
    3001: {
      G: '',
      D: '',
      // U: applePayPIB ■ P: applePayOrder
      DEFAULT: '再度ご注文内容をご確認ください。',
    },
    3002: {
      G: '',
      D: '',
      U: customErrorKey === 'applePayPIB'
        && 'ご希望の数量がご用意できない商品が(複数)ございます。対象商品の数量を変更の上、再度「購入手続きへ」ボタンを押してください',
      DEFAULT: '再度ご注文内容をご確認ください。',
      MANY: 'ご希望の数量がご用意できない商品が複数ございます。対象商品の数量を変更の上、再度「購入手続きへ」ボタンを押してください。',
      SINGLE: 'ご希望の数量がご用意できない商品がございます。対象商品の数量を変更の上、再度「購入手続きへ」ボタンを押してください。',
    },
    3003: {
      G: '',
      D: '',
      // U: applePayPIB ■ P: applePayOrder
      DEFAULT: '予約商品と通常商品を一緒に購入する事ができません。',
    },
    3004: {
      // P: applePayOrder
      P: '再度ご注文内容をご確認ください。',
      // U: applePayPIB
      U: '注文可能な個数を超えています。商品の数量を変更してください。',
    },
  };
}
