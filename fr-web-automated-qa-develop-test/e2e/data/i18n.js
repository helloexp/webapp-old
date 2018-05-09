/*
 Test strings according to EN\JP\TW languages
 TODO
 *Need to update the test bed according to page modifications
 */

module.exports = {
  // TODO this is related to language and may be a good choice to be here
  // but I dunno at the moment if the strings are correct and within which language I should place them
  cartpage: {
    cart_title: 'UNIQLO｜ユニクロ公式サイト : Cart',
    login_title: 'UNIQLO｜ユニクロ公式サイト : Login',
    apply_coupon_title: 'UNIQLO｜ユニクロ公式サイト : Apply a coupon',
    coupon_code: 'HOLIDAY15'
  },

  en: {
    deliveryDateTimeSelector: '',
    login: 'Login',
    logout: 'Log out',
    contactUs: 'Contact Us',
    order_confirmation_message: 'Completion of your order',
    order_cancel_confirmation_message: 'Your order has been canceled.',
    order_number: 'Order number',
    order_confirmation_user_address: 'Information of a receiver\'s address',
    order_confirmation_user_title: 'Mr',
    online_order_history: '',
    order_confirmation_giftbox_title: 'Gift information',
    giftingOptionMessage: 'Good Day!',
    giftingOptionUniqloBox: 'Uniqlo Box',
    shipping_preference_title: 'Shipping preference summary',
    time_frame_title: 'Timeframe',
    order_summary_title: 'Order Summary',
    continue_shoppting_button: 'Continue shopping',
    cross_sell_like: 'You may also like',
    button_more_items: 'Show all',
    minibag_icon_text: 'EST TOTAL',
    minibag_header_text: '',
    minibag_order_summary_text: '',
    minibag_shopping_summary_text: '',
    review_order_gift_box: '',
    review_order_shipinfo_title: '',
    reviewOrderCod: '',
    reviewOrderPostPay: '',
    unit: '',
    validationCreditCard: {
      cardNumber: '',
      expirationDate: '',
      cvv: '',
      cardHolderName: ''
    },
    validationGiftCard: {
      giftCouponCode: '',
      giftCouponCvv: ''
    },
    inseam: {
      noInseam: '',
      haveInseam: '',
      doubleInseam: ''
    },
    priceDetails: {
      totalMerchandise: '',
      giftFee: '',
      correctionFee: '',
      coupon: '',
      postage: '',
      saleTax: '',
      fengShiAmount: '',
      giftCard: '',
      totalTaxIncluded: ''
    },
    orderCancelMessage: '',
    errors: {
      changeGiftAmount: ''
    },
    addressValidationErrors: {
      blankLastName: '',
      blankFirstName: '',
      blankLastNameKatakana: '',
      nonFullWidthLastNameKatakana: '',
      blankFirstNameKatakana: '',
      nonFullWidthFirstNameKatakana: '',
      blankPostalCode: '',
      nonNumericPostalCode: '',
      invalidLengthPostalCode: '',
      blankPerfecture: '',
      blankCity: '',
      blankStreetAddress: '',
      blankPhone: '',
      invalidLengthPhoneNo: ''
    },
    mySize: {
      attributes: {
        height: '',
        weight: '',
        head: '',
        neck: '',
        shoulder: '',
        dressLength: '',
        sleeve: '',
        sleeveBack: '',
        chest: '',
        bustTop: '',
        bustUnder: '',
        cupSize: '',
        waist: '',
        hip: '',
        inseam: '',
        footSize: ''
      },
      numberCountErrorMessage: '',
      submitMySizeForm: '',
      confirmMySizeForm: '',
      confirmationMessage: '',
    }
  },

  jp: {
    deliveryDateTimeSelector: 'お届け日時指定',
    currencySymbol: '¥',
    cartSizeErrorMessage: '再度ご注文内容をご確認ください。',
    cartLimitErrorMessage: '注文可能な個数を超えています。商品の数量を変更してください。',
    freeShippingAvailableMesage: '本注文は送料無料、店舗での交換・返品可能。',
    freeShippingNotAvailableMesage: '今なら！ユニクロ店舗受取りご利用で送料無料。',
    guShippingMessageonCart: 'はじめてご利用の方は送料無料※送料無料はログイン後に適用されます。',
    login: 'ログイン',
    logout: 'ログアウト',
    contactUs: 'お問い合わせ',
    orderConfirmationMessage: 'ご購入ありがとうございます。\nご注文を承りました。',
    orderConfirmationMessagePayInStore: 'までに店舗レジにてお支払いを完了してください',
    orderConfirmationUserAddress: '指定先住所のお届け先',
    order_cancel_confirmation_message: 'ご注文をキャンセルしました。',
    order_number: '注文番号',
    order_status_canceled: 'ご注文をキャンセルしました。',
    online_order_history: 'オンラインストア注文履歴一覧',
    order_confirmation_user_title: 'Mr',
    order_confirmation_giftbox_title: 'ギフト情報',
    giftingOptionMessage: 'がんばって！',
    giftingOptionUniqloBox: 'ユニクロ箱',
    giftingOptionUniqloBoxMaterial: 'ユニクロ箱',
    shipping_preference_title: '梱包方法',
    time_frame_title: 'Timeframe',
    order_summary_title: 'ご注文内容',
    continue_shoppting_button: 'お買い物を続ける',
    cross_sell_like: 'You may also like',
    button_more_items: 'すべてを見る',
    minibag_icon_text: 'EST TOTAL',
    minibag_header_text: 'あと2,010円分のご購入で送料無料。',
    minibag_order_summary_text: 'ご注文内容',
    minibag_shopping_summary_text: 'Shopping Bag summary',
    review_order_gift_box: '梱包方法',
    review_order_shipinfo_title: '梱包方法',
    reviewOrderCod: '代金引換',
    reviewOrderPostPay: '後払い',
    unit: '点',
    validationCreditCard: {
      cardNumber: 'クレジットカード会社とカード番号が一致しません。',
      expirationDate: '有効期限を選択してください。',
      cvv: 'セキュリティコードは3～4桁で入力してください。',
      cardHolderName: 'カード名義人を入力してください。',
      cardTile: 'クレジットカード'
    },
    validationGiftCard: {
      giftCardCode: 'カード番号は16桁で入力してください。',
      giftCardCvv: 'PIN番号は4桁で入力してください。'
    },

    giftCardValidationErrors: {
      invalidLengthGiftCardCode: 'カード番号は16桁で入力してください。',
      nonNumericGiftCardCode: '半角数字で入力してください。',
      noBalanceGiftCard: '残高がありません。',

      blankGiftCardCvv: 'PIN番号を入力してください。',
      invalidLengthGiftCardCvv: 'PIN番号は4桁で入力してください。',

      invalidGiftCardAmount: '半角数字で入力してください。',
      exceedLimitGiftCardAmount: 'ご利用可能額またはお支払い合計より少なく設定してください',
      giftCardAmountExceedCartAmount: 'ギフトカードの適用金額を変更してください',

      giftCardIsUnset: 'このギフトカードは正しく登録されていません。カード情報を削除のうえ、再度ご入力ください。',
    },

    creditCardValidationErrors: {
     creditCardAmountChanged: 'クレジットカードでのお支払金額が変わりました',
    },

    inseam: {
      noInseam: '無',
      haveInseam: '有',
      doubleInseam: 'ダブル',
      sewingMachine: 'ミシン'
    },
    priceDetails: {
      totalMerchandise: '商品合計',
      giftFee: 'ギフト料',
      correctionFee: '補正料',
      coupon: 'クーポン',
      postage: '送料',
      saleTax: '消費税',
      fengShiAmount: '奉仕額',
      giftCard: 'ギフトカード支払い',
      totalTaxIncluded: '合計（税込）'
    },
    orderCancelMessage: 'ご注文をキャンセルしました。',
    errors: {
      changeGiftAmount: 'あなたのギフトカードの金額を変更します',
      checkPaymentMethod: '再度お支払い方法をご確認ください。',
    },
    addressValidationErrors: {
      blankLastName: '姓を入力してください。',
      blankFirstName: '名を入力してください。',
      blankLastNameKatakana: 'セイを入力してください。',
      nonFullWidthLastNameKatakana: '全角カタカナで入力してください。',
      blankFirstNameKatakana: 'メイを入力してください。',
      nonFullWidthFirstNameKatakana: '全角カタカナで入力してください。',
      blankPostalCode: '郵便番号を入力してください。',
      nonNumericPostalCode: '郵便番号は7文字で入力してください。',
      invalidLengthPostalCode: '郵便番号は7文字で入力してください。',
      blankPerfecture: '都道府県を入力してください。',
      blankCity: '市区郡町村を入力してください。',
      blankStreetAddress: '番地を入力してください。',
      blankPhone: '電話番号を入力してください。',
      invalidLengthPhoneNo: '電話番号は9文字以上13文字以内で入力してください。'
    },
    ministopStore: 'ローソン・ミニストップ',
    shippingMethod: {
      standard: 'お届け日時を指定しない',
      nextday: 'お届け日時指定',
      bydate: 'お届け日時指定は',
      yupacket: 'ゆうパケット',
      nekoPosPacket: 'ネコポス',
    },
    paymentMethod: {
      ondelivery: '代金引換',
      creditCard: 'クレジットカード',
      giftcard: 'ギフトカード',
      deferred: '後払い（コンビニエンスストア/郵便局/銀行支払い）',
    },
    mySize: {
      attributes: {
        height: '身長',
        weight: '体重',
        head: '頭回り',
        neck: '首回り',
        shoulder: '肩幅',
        dressLength: '着丈',
        sleeve: '腕の長さ',
        sleeveBack: '裄丈',
        chest: 'バスト/チェスト',
        bustTop: 'バスト（トップ）',
        bustUnder: 'バスト（アンダー）',
        cupSize: 'カップサイズ',
        waist: 'ウェスト',
        hip: 'ヒップ',
        inseam: '脚の長さ',
        footSize: '足のサイズ'
      },
      numberCountErrorMessage: '全角数字（全角ピリオド',
      submitMySizeForm: '確認画面へ',
      confirmMySizeForm: '登録する',
      confirmationMessage: 'マイサイズの登録が完了しました。 ご自身での採寸が難しい場合には、お近くのユニクロ店舗で採寸することができます。 また、マイサイズはユニクロ店舗で採寸したサイズも反映します。（仮コピー）（仮コピー）',
    },
    cvsLawsonStore: {
      name: 'ローソン',
      postalCode: '107-0052',
      prefecture: '東京都新宿区新宿'
    },
  },

  tw: {
    order_confirmation_message: '',
    order_confirmation_user_address: '',
    order_confirmation_user_title: '',
    order_confirmation_giftbox_title: '',
    order_confirmation_giftbox_message: '',
    shipping_preference_title: '',
    time_frame_title: '',
    order_summary_title: '',
    continue_shoppting_button: '',
    cross_sell_like: '',
    button_more_items: '',
    minibag_icon_text: '',
    minibag_header_text: '',
    minibag_order_summary_text: '',
    minibag_shopping_summary_text: '',
    review_order_gift_box: '',
    review_order_shipinfo_title: '',
    reviewOrderCod: '',
    reviewOrderPostPay: '',
    unit: '',
    validationCreditCard: {
      cardNumber: '',
      expirationDate: '',
      cvv: '',
      cardHolderName: ''
    },
    inseam: {
      noInseam: '',
      haveInseam: '',
      doubleInseam: ''
    },
    priceDetails: {
      totalMerchandise: '',
      giftFee: '',
      correctionFee: '',
      coupon: '',
      postage: '',
      saleTax: '',
      fengShiAmount: '',
      giftCard: '',
      totalTaxIncluded: ''
    },
    orderCancelMessage: '',
    errors: {
      changeGiftAmount: ''
    },
    addressValidationErrors: {
      blankLastName: '',
      blankFirstName: '',
      blankLastNameKatakana: '',
      nonFullWidthLastNameKatakana: '',
      blankFirstNameKatakana: '',
      nonFullWidthFirstNameKatakana: '',
      blankPostalCode: '',
      nonNumericPostalCode: '',
      invalidLengthPostalCode: '',
      blankPerfecture: '',
      blankCity: '',
      blankStreetAddress: '',
      blankPhone: '',
      invalidLengthPhoneNo: ''
    },
    mySize: {
      attributes: {
        height: '',
        weight: '',
        head: '',
        neck: '',
        shoulder: '',
        dressLength: '',
        sleeve: '',
        sleeveBack: '',
        chest: '',
        bustTop: '',
        bustUnder: '',
        cupSize: '',
        waist: '',
        hip: '',
        inseam: '',
        footSize: ''
      },
      numberCountErrorMessage: '',
      submitMySizeForm: '',
      confirmMySizeForm: '',
      confirmationMessage: '',
    }
  },
};
