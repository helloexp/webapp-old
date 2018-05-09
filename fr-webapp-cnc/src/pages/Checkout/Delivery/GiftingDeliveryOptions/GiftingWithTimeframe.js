import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Text from 'components/uniqlo-ui/Text';
import Button from 'components/uniqlo-ui/Button';
import Container from 'components/uniqlo-ui/core/Container';
import GiftPanel from 'pages/Checkout/Gifting/GiftPanel';
import Panel from 'components/Panel';
import If from 'components/uniqlo-ui/If';
import { connect } from 'react-redux';
import {
  isReturnedUser,
  isSplitDeliverySelected as checkIfSplitDeliverySelected,
  isSplitDeliveryAvailable as checkIfSplitDeliveryAvailable,
  checkIfAllDeliveryMethodsValid,
} from 'redux/modules/checkout/delivery/selectors';
import ShippingPreferenceWrapper from '../components/ShippingPreference';
import DeliveryPreference from '../components/DeliveryPreference';
import styles from './styles.scss';

function GiftingWithTimeframe(props, context) {
  const {
    isApplyButtonVisible,
    isReturnUser,
    saveAndgoToReviewOrder,
    showPayment,
    toggleModal,
    onToggleDateTimeModal,
    isPreferenceSelected,
    onToggleNextDateModal,
    timeFrameVisible,
    isSplitDeliverySelected,
    isSplitDeliveryAvailable,
  } = props;
  const { checkout } = context.i18n;
  const confirmButtonClasses = classNames('secondary medium bold', {
    [styles.topSpacing]: !isSplitDeliverySelected && timeFrameVisible,
    [styles.largeTopSpacing]: isSplitDeliverySelected,
  });

  return (
    <Container className={styles.wrapper}>
      <If
        if={!isSplitDeliverySelected}
        then={GiftPanel}
        className={styles.giftPanel}
        messageVisible
        editDelivery
        frame
      />
      <If
        if={isSplitDeliveryAvailable && timeFrameVisible}
        then={DeliveryPreference}
        frame
      />
      <Panel className={classNames(styles.shippingPreferenceWrap, styles.preferenceContainer)} frame>
        <If if={timeFrameVisible}>
          <div className={styles.timeFrameContainer}>
            <Text className={styles.textModifier}>{ checkout.timeFrame }</Text>
            <Button
              className={classNames('default', styles.infoIcon)}
              onTouchTap={toggleModal}
            />
          </div>
          <ShippingPreferenceWrapper onToggleDateTimeModal={onToggleDateTimeModal} onToggleNextDateModal={onToggleNextDateModal} />
        </If>
        <If
          className={confirmButtonClasses}
          if={isApplyButtonVisible}
          disabled={!isPreferenceSelected}
          label={checkout.continuePayment}
          onTouchTap={saveAndgoToReviewOrder}
          then={Button}
          analyticsOn="Button Click"
          analyticsLabel="UPDATE SHIPPING METHOD"
          analyticsCategory="Checkout Funnel"
          preventMultipleClicks
        />
        <If
          className={confirmButtonClasses}
          if={isReturnUser && !isApplyButtonVisible}
          label={checkout.continuePayment}
          onTouchTap={showPayment}
          disabled={!isPreferenceSelected}
          then={Button}
          analyticsOn="Button Click"
          analyticsLabel="UPDATE SHIPPING METHOD"
          analyticsCategory="Checkout Funnel"
          preventMultipleClicks
        />
      </Panel>
    </Container>
  );
}

const { bool, func, object } = PropTypes;

GiftingWithTimeframe.propTypes = {
  isApplyButtonVisible: bool,
  isReturnUser: bool,
  isPreferenceSelected: bool,
  timeFrameVisible: bool,
  isSplitDeliverySelected: bool,
  isSplitDeliveryAvailable: bool,
  saveAndgoToReviewOrder: func,
  showPayment: func,
  toggleModal: func,
  onToggleDateTimeModal: func,
  onToggleNextDateModal: func,
};

GiftingWithTimeframe.contextTypes = {
  i18n: object,
};

export default connect(state => ({
  isReturnUser: isReturnedUser(state),
  isPreferenceSelected: checkIfAllDeliveryMethodsValid(state),
  isSplitDeliverySelected: checkIfSplitDeliverySelected(state),
  isSplitDeliveryAvailable: checkIfSplitDeliveryAvailable(state),
}))(GiftingWithTimeframe);
