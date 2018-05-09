import React, { PropTypes } from 'react';
import { getCurrentHost } from 'utils/routing';
import Text from 'components/uniqlo-ui/Text';
import If from 'components/uniqlo-ui/If';
import getSiteConfig from 'config/site';
import styles from './styles.scss';

const { string, object, bool, number } = PropTypes;

export function AddMoreMessage({ cart, promoNm, multipleSku, count, amount, isXYPattern }) {
  const messageClass = multipleSku ? styles.topMessage : styles.bottomMessage;
  const appliedMessage = isXYPattern ? cart.kingPromoMessage : cart.applied;

  return (
    <div>
      <Text className={styles.promoMessage}>{promoNm}</Text>
      <Text className={messageClass}>{appliedMessage}</Text>
      <If
        if={multipleSku && !isXYPattern}
        then={Text}
        className={styles.bottomMessage}
        content={`${cart.amountAfterDiscount}${count}${cart.itWillBe}${amount}${cart.yen} + ${cart.consumptionTax}`}
      />
    </div>
  );
}

AddMoreMessage.propTypes = {
  cart: object,
  count: string,
  amount: number,
  multipleSku: bool,
  promoNm: string,
  isXYPatternMessage: bool,
  isXYPattern: bool,
};

export function NotQualifiedMessage({ i18n, promoNm, promotionId, isXYPatternMessage, isXYPattern }) {
  const { UQ_LINK_TO_TOP_PAGE } = getSiteConfig();
  const goToMultiBuyStore = `${UQ_LINK_TO_TOP_PAGE.replace('{%hostname}', getCurrentHost(true))}store/set/${promotionId}`;
  const linkText = isXYPattern ? i18n.kingPromoLinkText : i18n.goToMultiBuy;

  return (
    <div>
      <Text className={styles.promoMessage}>{promoNm}</Text>
      <If
        if={!isXYPatternMessage}
        then={Text}
        className={styles.notQualified}
        content={i18n.notQualified}
      />
      {
        /**
         * "goToMultiBuyStore" is a path to external page.
         * Anchor tag (<a />  ) is used here since
         * Link component has some issue with routing to external page
        **/
      }
      <a className={styles.addMoreLink} href={goToMultiBuyStore} >{linkText}</a>
    </div>
  );
}

NotQualifiedMessage.propTypes = {
  i18n: object,
  promoNm: string,
  promotionId: string,
  isXYPatternMessage: bool,
  isXYPattern: bool,
};
