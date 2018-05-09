import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { routes } from 'utils/urlPatterns';
import ErrorHandler from 'containers/ErrorHandler';
import If from 'components/uniqlo-ui/If';
import { clearCouponForm, getDetails, initCouponPage, setCouponSuccessAs } from 'redux/modules/membership/coupons';
import { getBrand } from 'redux/modules/cart/selectors';
import Drawer from 'components/Drawer';
import CouponDetails from 'pages/Membership/CouponDetails';
import ErrorMessage from 'components/ErrorMessage';
import { redirect, getUrlWithQueryData } from 'utils/routing';
import MainContent from './MainContent';

const { object, func, bool, string } = PropTypes;

@asyncConnect([{
  promise: initCouponPage,
}])
@connect(
  (state, props) => ({
    brand: getBrand(state, props),
    couponDetails: state.coupons.couponDetails,
    isredirectToPage: state.coupons.isredirectToPage,
    location: state.routing.locationBeforeTransitions,
  }),
  {
    clearCouponForm,
    getDetails,
    setCouponSuccessAs,
  })
@ErrorHandler(['couponLoad', 'coupon', 'getCartCouponInfo'])
export default class Coupons extends PureComponent {
  static propTypes = {
    // From selectors
    brand: string,

    // From ErrorHandler HOC
    error: string,

    // From redux state
    couponDetails: object,
    location: object,
    isredirectToPage: bool,

    // Actions from redux
    getDetails: func,
    setCouponSuccessAs: func,
    clearCouponForm: func,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  state = {
    showCouponDetails: false,
    redirect: false,
  };

  componentWillMount() {
    const { location, brand } = this.props;
    const { config: { pages: { PAYMENT, REVIEW_ORDER } } } = this.context;
    let previousLocation = routes.cart;

    if (location.query) {
      switch (location.query.from) {
        case REVIEW_ORDER:
          previousLocation = routes.reviewOrder;
          break;
        case PAYMENT:
          previousLocation = routes.payment;
          break;
        default:
          previousLocation = routes.cart;
      }
    }

    this.redirectionLink = getUrlWithQueryData(previousLocation, { brand });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isredirectToPage) {
      this.setState({ redirect: false });
      redirect(this.redirectionLink);
      this.props.setCouponSuccessAs(false);
    }
  }

  onCancel = () => {
    if (this.state.showCouponDetails) {
      this.setState({
        showCouponDetails: false,
      });
    } else {
      redirect(this.redirectionLink);
    }
  };

  openCouponDetailsModal = (couponCode) => {
    this.props.getDetails(couponCode);
    this.setState({
      showCouponDetails: true,
    });
  };

  render() {
    const { coupons: i18n } = this.context.i18n;
    const { error } = this.props;
    const drawerTitle = this.state.showCouponDetails
      ? i18n.couponDetails
      : i18n.applyCoupon;

    return (
      <Drawer
        noNavBar
        onCancel={this.onCancel}
        title={drawerTitle}
        variation="noFooter"
        noMargin
        cancelBtnProps={{
          analyticsOn: 'Button Click',
          analyticsCategory: 'Checkout Funnel',
          analyticsLabel: 'Close Coupon Window',
        }}
      >
        <If
          if={!this.state.showCouponDetails && error}
          then={ErrorMessage}
          isCustomError
          message={error}
          rootClassName="couponPageErr"
          analyticsOn="Button Click"
          analyticsCategory="Checkout Funnel"
          analyticsLabel="Coupon Error"
        />
        <If
          if={this.state.showCouponDetails}
          then={CouponDetails}
          else={MainContent}
          coupon={this.props.couponDetails}
          onShowDetails={this.openCouponDetailsModal}
        />
      </Drawer>
    );
  }
}
