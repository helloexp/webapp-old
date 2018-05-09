import React, { PropTypes } from 'react';
import classNames from 'classnames';
import If from 'components/uniqlo-ui/If';
import Panel from 'components/Panel';
import Heading from 'components/uniqlo-ui/Heading';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import GiftMessagePreview from './GiftMessagePreview';
import styles from './styles.scss';

const { bool, func, object, string } = PropTypes;

function MessageCard({ card, review, cardAmount }, { i18n }) {
  const { gifting } = i18n;
  // An extra double byte space is needed here to match spacing of heading and text in UI.
  const messageCardTitle = `${card.title}${'　'} ${cardAmount}`;

  return (
    <Container className={classNames('z0', styles.messageBlockContainer)}>
      <Heading className={styles.addressListHeading} headingText={gifting.messageCard} type="h4" />
      <Text className={styles.messageTopHead} >{messageCardTitle}</Text>
      <If
        if={card.message}
        then={GiftMessagePreview}
        message={card.message}
        review={review}
      />
    </Container>
  );
}

MessageCard.propTypes = {
  card: object,
  review: bool,
  cardAmount: string,
};

MessageCard.contextTypes = {
  i18n: object,
};

export default function GiftDetails(props, { i18n }) {
  const {
    confirm,
    editable,
    editDelivery,
    enabled,
    frame,
    giftBox,
    goToEditPage,
    title,
    noIcon,
    orderHistory,
    lighterBoxShadow,
    review,
    formattedMessageCardAmount,
    className,
  } = props;

  const { gifting } = i18n;

  const cls = classNames(className, styles.giftPanel, {
    [styles.giftPanelConfirmation]: confirm,
    [styles.giftOrderPanel]: orderHistory,
  });
  const giftIcon = !noIcon
    ? <span className={styles.icomoonGift} />
    : null;
  const giftingTitle = title ? <span className={styles.icomoonGiftWrap}>{giftIcon}{title}</span> : '';

  return (
    <Panel
      className={cls}
      editable={editable || editDelivery}
      enabled={enabled}
      frame={frame}
      lighterBoxShadow={lighterBoxShadow}
      onEdit={goToEditPage}
      spacingTitle
      title={giftingTitle}
      titleClass={styles.giftingTitle}
      analyticsOn="Button Click"
      analyticsLabel="Change Gift option"
      analyticsCategory="Checkout Funnel"
    >
      <Heading className={styles.addressListHeading} headingText={gifting.giftOrder} type="h4" />
      <div className={styles.messageTopHead} >{giftBox.title}</div>
      <div className={styles.messageTopHead} >{giftBox.description}</div>
      <If
        if={giftBox.card}
        then={MessageCard}
        card={giftBox.card}
        review={review}
        cardAmount={formattedMessageCardAmount}
      />
    </Panel>
  );
}

GiftDetails.propTypes = {
  lighterBoxShadow: bool,
  confirm: bool,
  editable: bool,
  editDelivery: bool,
  enabled: bool,
  frame: bool,
  giftBox: object,
  goToEditPage: func,
  noIcon: bool,
  title: string,
  orderHistory: bool,
  review: bool,
  formattedMessageCardAmount: string,
  className: string,
};

GiftDetails.contextTypes = {
  i18n: object,
};
