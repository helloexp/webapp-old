import { getTranslation } from 'i18n';
import constants from 'config/site/default';

export function mapAmountToGiftBag(giftBagAmounts) {
  return giftBagAmounts.reduce((giftBag, giftBagAmount) => {
    giftBag[giftBagAmount.cd_dtl_id] = { amount: parseFloat(giftBagAmount.cd_dtl_nm) };

    return giftBag;
  }, {});
}

export function mapAmountToMessage(messages) {
  return messages.reduce((message, messageAmount) => {
    message[messageAmount.cd_dtl_id] = { amount: parseFloat(messageAmount.cd_dtl_nm) };

    return message;
  }, {});
}

export function mapGiftBag(rawGiftBag) {
  const i18n = getTranslation();
  const withPackingExtraText = i18n.gifting.withPackingExtraText;
  const withoutPackingExtraText = i18n.gifting.withoutPackingExtraText;
  const hasPacking = rawGiftBag.cd_dtl_id_4 === '1';
  let title = rawGiftBag.cd_dtl_nm;

  // @Todo Remove this replace logic once GDS API returns title as required format
  if (title) {
    title = title && title.replace(hasPacking ? withPackingExtraText : withoutPackingExtraText, '');
  }

  return {
    id: rawGiftBag.cd_dtl_id,
    brand: rawGiftBag.cd_dtl_id_3 === '10' ? 'uq' : 'gu',
    hasPacking,
    title,
    image: `${constants.gifting.pathPrefix}${rawGiftBag.cd_dtl_id}${constants.gifting.pathSuffix}`,
  };
}

export function mapGiftBags(rawGiftBags) {
  if (!rawGiftBags || !rawGiftBags.codedtl_list) {
    return [];
  }

  return rawGiftBags.codedtl_list.filter(rawGiftBag =>
    rawGiftBag.cd_dtl_nm_2 === '1' && (rawGiftBag.cd_dtl_id_3 === '10' || rawGiftBag.cd_dtl_id_3 === '20')
  ).map(rawGiftBag => mapGiftBag(rawGiftBag));
}

export function mapGiftCardMessage(rawGiftBag, brand) {
  return {
    id: rawGiftBag.cd_dtl_id,
    title: rawGiftBag.cd_dtl_nm,
    image: `${constants.gifting.messagePathPrefix}${rawGiftBag.cd_dtl_id}${constants.gifting.messagePathSuffix}`,
    brand,
  };
}

export function mapGiftCardMessages(rawCardMessages, brand) {
  if (!rawCardMessages || !rawCardMessages.codedtl_list) {
    return [];
  }

  return rawCardMessages.codedtl_list.filter(rawCardMessage =>
    rawCardMessage.cd_dtl_nm_2 === '1' && ((brand === 'uq' && rawCardMessage.cd_dtl_id_3 === '10')
      || (brand === 'gu' && rawCardMessage.cd_dtl_id_3 === '20'))

  ).map(rawCardMessage => mapGiftCardMessage(rawCardMessage, brand));
}

export function mapGift(rawGift) {
  return {
    id: rawGift.gift_bag_id,
    name: rawGift.gift_bag_name,
    amount: rawGift.gift_bag_amt,
    messageCard: {
      id: rawGift.message_card_id,
      name: rawGift.message_card_name,
      amount: rawGift.message_card_amt,
    },
    message: rawGift.message,
  };
}
