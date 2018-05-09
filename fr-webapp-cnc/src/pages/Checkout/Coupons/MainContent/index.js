import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { viewLimit as limitConfig } from 'config/site/default';
import {
  addACoupon as addACouponSelector,
  removeACoupon as removeACouponSelector,
  setCode as setCodeSelector,
  initCouponCode as initCouponCodeAction,
  setCouponSuccessAs,
} from 'redux/modules/membership/coupons';
import { isApplyCouponButtonDisabled, getAddedCouponOfCurrentBrand, getOnlineCouponList, getEnteredCouponCode } from 'redux/modules/membership/selectors';
import ErrorHandler from 'containers/ErrorHandler';
import { popAPIErrorMessage } from 'redux/modules/errorHandler';
import If from 'components/uniqlo-ui/If';
import MessageBox from 'components/MessageBox';
import Helmet from 'react-helmet';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import Html from 'components/uniqlo-ui/Html';
import Link from 'components/uniqlo-ui/Link';
import InfoToolTip from 'components/InfoToolTip';
import CouponList from 'pages/Membership/CouponList';
import CouponForm from '../components/CouponForm';
import styles from './styles.scss';

const { array, bool, func, object, string } = PropTypes;

@connect(
  (state, props) => ({
    code: getEnteredCouponCode(state),
    list: getOnlineCouponList(state),
    myCouponValid: state.coupons.myCouponValid,
    addedCoupon: getAddedCouponOfCurrentBrand(state, props),
    isApplyButtonDisabled: isApplyCouponButtonDisabled(state, props),
  }), {
    addACoupon: addACouponSelector,
    removeACoupon: removeACouponSelector,
    setCode: setCodeSelector,
    initCouponCode: initCouponCodeAction,
    popErrorMessage: popAPIErrorMessage,
    setCouponSuccessAs,
  })
@ErrorHandler(['coupon'])
export default class MainContent extends PureComponent {
  static propTypes = {
    // From redux state
    code: string,
    list: array,
    myCouponValid: bool,

    // For redux actions
    addACoupon: func,
    initCouponCode: func,
    removeACoupon: func,
    setCode: func,
    popErrorMessage: func,
    setCouponSuccessAs: func,

    // From parent props
    onShowDetails: func,

    // From selector
    addedCoupon: object,
    isApplyButtonDisabled: bool,

    // From ErrorHandler HOC
    error: string,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  state = {
    couponListCount: limitConfig.couponList,
  };

  onSelectCoupon = coupon => this.props.addACoupon(coupon);

  onAddOrRemoveCoupon = (code) => {
    const { addedCoupon, addACoupon, removeACoupon } = this.props;
    const coupon = code ? { code } : null;
    const cartCoupon = addedCoupon && addedCoupon.couponId ? { code: addedCoupon.couponId } : null;

    if (coupon) {
      if (code === (cartCoupon && cartCoupon.code)) {
        this.props.setCouponSuccessAs(true);
      } else {
        addACoupon(coupon, true);
      }
    } else if (cartCoupon) {
      removeACoupon(cartCoupon);
    }
  };

  onViewMoreCoupons = () => {
    const { couponListCount } = this.state;

    if (couponListCount < this.props.list.length) {
      this.setState({
        couponListCount: couponListCount + 5,
      });
    }
  };

  onClosePopup = () => {
    this.props.popErrorMessage('coupon', true);
    this.props.initCouponCode();
  }

  render() {
    const {
      myCouponValid,
      list,
      code,
      setCode,
      removeACoupon,
      addedCoupon,
      onShowDetails,
      isApplyButtonDisabled,
      error,
    } = this.props;
    const { common, coupons: i18n } = this.context.i18n;
    const { ABOUT_COUPONS } = this.context.config;
    const availabilityText = list.length > 0
      ? i18n.textCouponAvailable
      : i18n.textCouponNotAvailable;

    return (
      <div>
        <Helmet title={i18n.applyCoupon} />
        <div className={styles.headIconWrap}>
          <Heading className={styles.header} headingText={i18n.available} type="h3" />
          <InfoToolTip className={styles.toolTipForContainer} position="bottom">
            <Html html={i18n.couponInformation} />
            <Link className={styles.link} to={ABOUT_COUPONS} target="_blank">
              {i18n.couponInformationLink}
            </Link>
          </InfoToolTip>
        </div>
        <Text className={styles.message}>{availabilityText}</Text>
        <CouponList
          addedCoupon={addedCoupon}
          className={styles.coupons}
          count={this.state.couponListCount}
          items={list}
          onAdd={this.onSelectCoupon}
          onRemove={removeACoupon}
          onViewMore={this.onViewMoreCoupons}
          showDetails={onShowDetails}
        />
        <Container className={styles.couponForm}>
          <Heading
            className={classNames(styles.header, styles.couponFormHeader)}
            headingText={i18n.yourCode}
            type="h3"
          />
          <CouponForm
            code={code}
            onAdd={this.onAddOrRemoveCoupon}
            onChange={setCode}
            valid={myCouponValid}
            isButtonDisabled={isApplyButtonDisabled}
          />
        </Container>
        <If
          if={!myCouponValid && error}
          then={MessageBox}
          onAction={this.onClosePopup}
          onClose={this.onClosePopup}
          rejectLabel={common.ok}
          rejectProps={{
            analyticsOn: 'Button Click',
            analyticsCategory: 'Checkout Funnel',
            analyticsLabel: 'Coupon Error',
          }}
          title={error}
          variation="releaseAlert"
          couponPopup
        />
      </div>
    );
  }
}
