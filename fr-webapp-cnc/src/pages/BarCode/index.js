import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { membersApi } from 'config/api';
import { routes } from 'utils/urlPatterns';
import * as couponActions from 'redux/modules/membership/coupons';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Image from 'components/uniqlo-ui/Image';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import If from 'components/uniqlo-ui/If';
import MessageBox from 'components/MessageBox';
import { redirect } from 'utils/routing';
import ConfirmationPopup from './components/ConfirmationPopup';
import BarcodeTile from './components/BarcodeTile';
import styles from './styles.scss';

const { object, array, string, func, bool } = PropTypes;

@asyncConnect([{
  promise: couponActions.initCouponBarcode,
}])
@connect(
  state => ({
    ...state.coupons,
    ...state.auth.user,
  }),
  {
    validateAndConsumeAStoreCoupon: couponActions.validateAndConsumeAStoreCoupon,
    selectACouponToUse: couponActions.selectACouponToUse,
    showFooterMessage: couponActions.showFooterMessage,
    showConfirmationPopup: couponActions.showConfirmationPopup,
    removeSelectedStoreCoupons: couponActions.removeSelectedStoreCoupons,
  }
)

export default class BarCode extends Component {

  static propTypes = {
    selectedStoreCouponDetails: array,
    accessToken: string,
    validateAndConsumeAStoreCoupon: func,
    selectACouponToUse: func,
    isFooterVisible: bool,
    isConfirmationPopupVisible: bool,
    showFooterMessage: func,
    showConfirmationPopup: func,
    removeSelectedStoreCoupons: func,
  };

  static contextTypes = {
    i18n: object,
    router: object,
  };

  state = {
    isUseCoupon: false,
  };

  componentWillUnmount() {
    this.props.removeSelectedStoreCoupons();
  }

  onFooterAction = (action) => {
    const { validateAndConsumeAStoreCoupon, showFooterMessage } = this.props;

    if (action === 'yes') {
      validateAndConsumeAStoreCoupon();
    } else {
      showFooterMessage(false);
    }
  }

  onGoBack = () => {
    redirect(routes.membershipCoupon);
  }

  showUseCouponButton = () => {
    this.setState({
      isUseCoupon: !this.state.isUseCoupon,
    });
  }

  render() {
    const { membership } = this.context.i18n;
    const {
      accessToken,
      selectedStoreCouponDetails,
      selectACouponToUse,
      showConfirmationPopup,
      isFooterVisible,
      isConfirmationPopupVisible,
     } = this.props;

    let memberBarcodeApi;
    let barcodeQueryParams;

    if (accessToken) {
      memberBarcodeApi = `${membersApi.base}/${membersApi.barcode}`;
      barcodeQueryParams = `accessToken=${accessToken}&scale=4&height=9`;
    }

    const useCouponLabel = this.state.isUseCoupon ? membership.cancel : membership.useStoreCoupon;
    const barcodeList = selectedStoreCouponDetails.map((coupon, index) =>
      <BarcodeTile
        coupon={coupon}
        isUseCoupon={this.state.isUseCoupon}
        selectACoupon={selectACouponToUse}
        index={index}
        key={index}
      />
    );

    return (
      <div>
        <Container className={styles.barCodeOuterContainer}>
          <Container className={styles.headingContainer}>
            <Heading
              className={styles.pageHeading}
              headingText={membership.couponUse}
              type="h2"
            />
          </Container>
          <Container className={`z3 ${styles.storeCouponContainer}`}>
            <Text className="error">{membership.memberBarCodeMessage}</Text>
            <Text className={`tapableItemHeading blockText ${styles.headingText}`}>
              {membership.memberBarCode}
            </Text>
            <Image
              className={styles.barcodeImage}
              source={`${memberBarcodeApi}?${barcodeQueryParams}`}
            />
            <Container className={styles.barcodeContainer}>
              <Text className={`tapableItemHeading blockText ${styles.headingText}`}>
                {membership.couponBarCode}
              </Text>
              {barcodeList}
            <If
              if={!selectedStoreCouponDetails.length}
              then={Text}
              className={styles.noStoreCoupons}
              content={membership.noStoreCoupons}
            />
            </Container>
            <Button
              className={`default medium boldWithBorder ${styles.backToCouponListBtn}`}
              label={membership.backToCouponList}
              onTouchTap={this.onGoBack}
            />
            <If
              if={selectedStoreCouponDetails.length}
              then={Text}
              className={styles.useCouponText}
              content={useCouponLabel}
              onPress={this.showUseCouponButton}
            />
          </Container>
          <If
            if={isConfirmationPopupVisible}
            message={membership.confirmExchangeMessage}
            closePopup={showConfirmationPopup}
            then={ConfirmationPopup}
          />
          <If
            if={isFooterVisible}
            confirmLabel={membership.confirmUse}
            message={membership.useCouponConfirmation}
            onAction={this.onFooterAction}
            rejectLabel={membership.cancel}
            stickyBox
            variation="confirm"
            then={MessageBox}
          />
        </Container>
      </div>
    );
  }
}
