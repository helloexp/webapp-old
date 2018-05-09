import React, { PropTypes } from 'react';
import InfoToolTip from 'components/InfoToolTip';
import Text from 'components/uniqlo-ui/Text';
import styles from './styles.scss';

const TimeoutInfo = (props, context) => {
  const { cart } = context.i18n;

  return (
    <div className={styles.timeoutInfo}>
      <Text className={styles.timeoutInfoText}>{cart.timeoutInfo}</Text>
      <InfoToolTip>
        {cart.timeoutInfoDetails.map((text, index) => <div key={index}>{text}</div>)}
      </InfoToolTip>
    </div>
  );
};

const { object } = PropTypes;

TimeoutInfo.propTypes = {
  props: object,
};

TimeoutInfo.contextTypes = {
  i18n: object,
};

export default TimeoutInfo;
