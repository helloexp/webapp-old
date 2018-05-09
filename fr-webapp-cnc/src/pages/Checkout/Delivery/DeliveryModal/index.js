import React, { PropTypes, PureComponent } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Heading from 'components/uniqlo-ui/Heading';
import If from 'components/uniqlo-ui/If';
import Link from 'components/uniqlo-ui/Link';
import Drawer from 'components/Drawer';
import styles from './styles.scss';

const { bool, object, func } = PropTypes;

function getInfo(info) {
  return (info.map((text, index) => <div className={styles.toolTipTextElmnt} key={index}>{text}</div>));
}

const DrawerModal = ({ toggleModal }, context) => {
  const {
    config: {
      deliveryUrls,
    },
    i18n: {
      checkout: {
        deliveryDate,
        specifyDate,
        nextDayFaq,
        deliveryDateConditions,
        deliveryDateMessage,
        notSpecifiedDateMessage,
        specifiedDateMessage,
        standardDeliveryHeading,
        standardDeliveryMessage,
      },
      common: {
        uniqlo,
        gu,
      },
    },
  } = context;

  return (
    <Drawer onCancel={toggleModal} title={deliveryDate} variation="noFooter" headerClass={styles.extraMargin}>
      <div className={styles.descriptionContainer}>
        <Heading className={styles.contentHeading} headingText={uniqlo} type="h4" />
        <Heading className={styles.deliveryTitle} headingText={standardDeliveryHeading} type="h4" />
        <Text className="blockText">{standardDeliveryMessage}</Text>
        <div className={styles.listWrapper}>
          <Link className={styles.descriptionLink} to={deliveryUrls.uq.deliveryDateLink} target="_blank">
            {deliveryDateConditions}
          </Link>
          <Link className={styles.descriptionLink} to={deliveryUrls.uq.nextDayFaqLink} target="_blank">
            {nextDayFaq}
          </Link>
        </div>
        <Text className={styles.description}>{getInfo(specifyDate)}</Text>
      </div>
      <div className={styles.contentWrapper}>
        <Heading className={styles.contentHeading} headingText={gu} type="h4" />
        <Heading className={styles.deliveryTitle} headingText={standardDeliveryHeading} type="h4" />
        <Text className="blockText">{notSpecifiedDateMessage}</Text>
        <Text className="blockText">{specifiedDateMessage}</Text>
        <div className={styles.listWrapper}>
          <Link className={styles.descriptionLink} to={deliveryUrls.gu.deliveryDateLink} target="_blank">
            {deliveryDateConditions}
          </Link>
          <Link className={styles.descriptionLink} to={deliveryUrls.gu.nextDayFaqLink} target="_blank">
            {nextDayFaq}
          </Link>
        </div>
        <Text className={styles.description}>{getInfo(deliveryDateMessage)}</Text>
      </div>
    </Drawer>
  );
};

DrawerModal.propTypes = {
  toggleModal: func,
};

DrawerModal.contextTypes = {
  i18n: object,
  config: object,
};

export default class DeliveryModal extends PureComponent {

  static propTypes = {
    isDrawerVisible: bool,
    toggleModal: func,
  };

  render() {
    const { isDrawerVisible, toggleModal } = this.props;

    return (
      <If
        if={isDrawerVisible}
        then={DrawerModal}
        toggleModal={toggleModal}
      />
    );
  }
}
