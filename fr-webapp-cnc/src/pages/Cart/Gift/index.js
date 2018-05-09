import React, { PropTypes } from 'react';
import CheckBox from 'components/Atoms/CheckBox';
import InfoToolTip from 'components/InfoToolTip';
import Text from 'components/uniqlo-ui/Text';
import If from 'components/uniqlo-ui/If';
import Image from 'components/uniqlo-ui/Image';
import styles from './styles.scss';

const Gift = ({ selected, gift, onChange, brand }, context) => {
  const { cart, gifting } = context.i18n;
  const title = gift.title ? `${gift.title.trim()} |` : '';
  const price = gift.amount || '';

  return (
    <div className={styles.giftSelector}>
      <CheckBox
        checked={selected}
        className={styles.checkbox}
        id={`GiftCheckBox${brand}`}
        label={cart.containsGift}
        onChange={onChange}

        analyticsOn="Gift Checkbox Toggle"
        analyticsCategory="Checkout Funnel"
        analyticsLabel={selected ? 'Giftoptout' : 'Giftopton'}
      />
      <InfoToolTip>
        <Text className={styles.heading}>{cart.giftInfo}</Text>
        <div className={styles.textImgWrap}>
          <div className={styles.textWrap}>
            <div className={styles.titlePriceWrap}>
              <span className={styles.title}>{title}</span>
              <span className={styles.price}>{price}</span>
            </div>
            {gifting.wrapDeliver}
          </div>
          <If
            if={gift.image}
            then={Image}
            className={styles.toolTipImg}
            source={gift.image}
          />
        </div>
        <Text className={styles.applePayMessage}>
          {gifting.applePayTooltipMessage}
        </Text>
      </InfoToolTip>
    </div>
  );
};

const { bool, string, func, object } = PropTypes;

Gift.propTypes = {
  selected: bool,
  brand: string,
  gift: object,
  onChange: func,
};

Gift.contextTypes = {
  i18n: object,
  config: object,
};

export default Gift;
