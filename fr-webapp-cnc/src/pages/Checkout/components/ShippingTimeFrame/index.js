import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Panel from 'components/Panel';
import classNames from 'classnames';
import { isShipping, isSplitDeliverySelected, getSplitCount } from 'redux/modules/checkout/delivery/selectors';
import TimeFrame from 'components/TimeFrame';
import Container from 'components/uniqlo-ui/core/Container';
import { setPreviousLocation as setPreviousLocationAction, saveAndContinue, reloadDeliveryMethodOptions } from 'redux/modules/checkout/delivery';
import { getCartPaymentType } from 'redux/modules/cart/selectors';
import { routes } from 'utils/urlPatterns';
import { redirect, getCurrentBrand, getUrlWithQueryData } from 'utils/routing';
import { getTimeFrameMessage, getShippingFrameMessage, getShippingCost, getLeadDateTime } from './selectors';
import SplitTimeFrame from './SplitTimeFrame';
import SplitProductImages from './SplitProductImages';
import styles from './styles.scss';

const { array, bool, object, string, func, number } = PropTypes;

@connect((state, props) => ({
  isShippingMethod: isShipping(state),
  timeFrameMessage: getTimeFrameMessage(state, props),
  shippingFrameMessage: getShippingFrameMessage(state, props),
  shippingCost: getShippingCost(state, props),
  deliveryLeadTime: getLeadDateTime(state, props),
  paymentType: getCartPaymentType(state, props),
  isSplitDeliveryApplied: isSplitDeliverySelected(state),
  brand: getCurrentBrand(state),
  splitCount: getSplitCount(state),
}), {
  setPreviousLocation: setPreviousLocationAction,
  setPreferenceSelectView: saveAndContinue,
  reloadDeliveryOptions: reloadDeliveryMethodOptions,
})
export default class ShippingTimeFrame extends PureComponent {
  static propTypes = {
    isShippingMethod: bool,
    cartItems: array,
    brand: string,
    timeFrameMessage: string,
    shippingFrameMessage: string,
    shippingCost: string,
    paymentType: string,
    lighterBoxShadow: bool,
    review: bool,
    reloadDeliveryOptions: func,
    setPreviousLocation: func,
    setPreferenceSelectView: func,
    deliveryLeadTime: string,
    isSplitDeliveryApplied: bool,
    fromCheckout: bool,
    splitCount: number,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  onEdit = () => {
    const { brand, review, setPreviousLocation, setPreferenceSelectView, reloadDeliveryOptions, paymentType } = this.props;
    const onTapRedirectUrl = getUrlWithQueryData(routes.delivery, { brand });

    if (review) {
      setPreviousLocation();
    }

    if (paymentType) {
      reloadDeliveryOptions();
    }

    setPreferenceSelectView(true);
    redirect(onTapRedirectUrl);
  }

  render() {
    const {
      isShippingMethod,
      timeFrameMessage,
      shippingFrameMessage,
      shippingCost,
      lighterBoxShadow,
      review,
      deliveryLeadTime,
      isSplitDeliveryApplied,
      splitCount,
    } = this.props;
    const { delivery, orderConfirmation } = this.context.i18n;
    let productImagesPanel = [];
    let timeFramePanel = [];

    if (isSplitDeliveryApplied) {
      for (let splitNo = 1; splitNo <= splitCount; splitNo++) {
        const isLastItem = splitNo === splitCount;

        timeFramePanel.push(<SplitTimeFrame splitNo={`${splitNo}`} isLastItem={isLastItem} key={splitNo} />);
        productImagesPanel.push(
          <SplitProductImages {...{ review, isSplitDeliveryApplied, isLastItem }} splitNo={`${splitNo}`} key={splitNo} />
        );
      }
    } else {
      timeFramePanel = isShippingMethod
        ? (<TimeFrame
          arrivalDate={shippingFrameMessage}
          containerStyle={classNames(styles.timeFrameContainer, styles.timeFrameWrap)}
          shippingPrice={shippingCost}
          timeFrameMessage={timeFrameMessage}
        />)
        : (<TimeFrame
          containerStyle={classNames(styles.timeFrameContainer, styles.timeFrameWrap)}
          hideEdit
          editLabelStyle={review ? 'noUnderline' : ''}
          arrivalDate={deliveryLeadTime}
        />);
      productImagesPanel = <SplitProductImages {...{ review, isSplitDeliveryApplied }} />;
    }

    return (
      <Container className={styles.mainContainer}>
        <Panel
          className={styles.panelStyle}
          editable={isShippingMethod}
          frame
          headerStyle={styles.headerStyle}
          lighterBoxShadow={lighterBoxShadow}
          onEdit={this.onEdit}
          title={isShippingMethod && orderConfirmation.shippingMethod}
        >
          {timeFramePanel}
        </Panel>
        <Panel title={delivery.deliveryItem} headerStyle={styles.headerStyle} frame className={styles.panelStyle} lighterBoxShadow={lighterBoxShadow}>
          {productImagesPanel}
        </Panel>
      </Container>
    );
  }
}
