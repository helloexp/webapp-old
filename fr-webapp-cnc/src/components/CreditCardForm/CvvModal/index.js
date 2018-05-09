import React, { PropTypes } from 'react';
import Image from 'components/uniqlo-ui/Image';
import Text from 'components/uniqlo-ui/Text';
import Drawer from 'components/Drawer';
import styles from './styles.scss';

const card = require('../images/card.png');

const { object, func } = PropTypes;

const CvvModal = ({ onCancel }, context) => {
  const { i18n: { payment } } = context;

  return (
    <Drawer onCancel={onCancel} title={payment.cvvTitle} variation="noFooter">
      <Text className={styles.paragraph}>{payment.cvvWhatIsIt}</Text>
      <Image className={styles.cardImage} source={card} />
      <Text className={styles.list}>
        { payment.cvvBullets.map((text, idx) =>
          <div key={idx} className={styles.listItem}>{text}</div>)
        }
      </Text>
    </Drawer>
  );
};

CvvModal.propTypes = {
  onCancel: func,
};

CvvModal.contextTypes = {
  i18n: object,
};

export default CvvModal;
