import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import { getUrlWithQueryData } from 'utils/routing';
import { routes, routePatterns } from 'utils/urlPatterns';
import { canMakePayments } from 'utils/applePay';
import ErrorHandler from 'containers/ErrorHandler';
import If from 'components/uniqlo-ui/If';
import Button from 'components/uniqlo-ui/Button';
import CouponPanel from 'components/CouponPanel';
import OrderSummary from 'components/OrderSummary';
import Text from 'components/uniqlo-ui/Text';
import * as cartActions from 'redux/modules/cart';
import { updateGifting } from 'redux/modules/checkout/gifting/actions';
import * as cartSelector from 'redux/modules/cart/selectors';
import { getAddedCouponOfCurrentBrand } from 'redux/modules/membership/selectors';
import ApplePay from '../ApplePay';
import Gift from '../Gift';
import TimeoutInfo from '../TimeoutInfo';
import Products from './Products';
import StickyTotal from '../StickyTotal';
import styles from './styles.scss';

const { array, func, object, string, bool, oneOfType } = PropTypes;
const cx = classnames.bind(styles);

@connect(
  (state, props) => {
    const cart = cartSelector.getCart(state, props);
    const { orderSummary } = cart;
    const { isNativeAppApplePayAvailable } = state.applePay;
    const normalizedCartSelector = cartSelector.createStructuredProductsSelector('promoId');

    return {
      location: cartSelector.getLocation(state),
      items: normalizedCartSelector(state, props),
      giftingId: cartSelector.getVerifiedGiftingId(state, props),
      giftingSelected: !!cartSelector.getGiftingSelected(state, props),
      isUniqlo: cartSelector.isUniqlo(state, props),
      isCartEmpty: cartSelector.isCartEmpty(state, props),
      isCheckoutAvailable: cartSelector.isCheckoutAvailable(state, props),
      addedCoupon: getAddedCouponOfCurrentBrand(state, props),
      defaultGift: cartSelector.getDefaultGiftOption(state, props),
      isNativeAppApplePayAvailable,
      orderSummary,
    };
  },
  {
    ...cartActions,
    updateGifting,
  })
@ErrorHandler(['cartItems'], 'detailedErrors')
export default class Body extends PureComponent {
  static propTypes = {
    // from parent
    brand: string,
    items: array,
    params: object,
    orderSummary: object,

    // from connect
    onRemoveCartItem: func,
    updateGifting: func,
    checkoutFromCart: func,
    defaultGift: object,
    isNativeAppApplePayAvailable: bool,

    // from selectors
    giftingId: oneOfType([string, bool]),
    giftingSelected: bool,

    // from selectors
    isCheckoutAvailable: bool,
    isUniqlo: bool,

    // from selectors
    addedCoupon: object,
    isCartEmpty: bool,

    // from state using @ErrorHandler
    detailedErrors: object,

    doShippingFeeWorkaround: func,
    setupDefaultGiftingFromCookie: func,
    location: object,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
    collapsed: false,
    giftingSelected: false,
  };

  componentWillMount() {
    const { brand, doShippingFeeWorkaround, items } = this.props;

    doShippingFeeWorkaround(brand, items);
    this.couponPageUrl = getUrlWithQueryData(routes.coupons, { from: routes.cart, brand });
  }

  componentWillReceiveProps(nextProps) {
    const { brand, doShippingFeeWorkaround, items, giftingSelected } = nextProps;

    /*
     * When user places order the props such as orderSummary, items etc. are updated.
     * Due to this the doShippingFeeWorkaround() is called which fails, the error handler action being go to cart;
     * user is taken to cart with error message on top.
     * This was noted in native-app for apple-pay.
     * Subsequently the call is avoided if the url has changed to order confirm.
     */
    const shouldDoShippingFeeWorkAround = !routePatterns.confirmOrder.test(this.props.location.pathname);

    if (shouldDoShippingFeeWorkAround) doShippingFeeWorkaround(brand, items);
    if (this.props.brand !== brand) {
      this.couponPageUrl = getUrlWithQueryData(routes.coupons, { from: routes.cart, brand });
    }

    this.setState({ giftingSelected });
  }

  onCheckoutFromCart = () => {
    const { brand, checkoutFromCart } = this.props;

    checkoutFromCart(brand);
  };

  onToggle = (toggleState) => {
    this.setState({ collapsed: toggleState });
  };

  setGifting = () => {
    const {
      props: {
        giftingId,
        brand,
      },
      state: {
        giftingSelected,
      },
    } = this;

    this.props.updateGifting(!giftingSelected ? giftingId : '', brand, true);
    this.setState(prevState => ({ giftingSelected: !prevState.giftingSelected }));
  };

  render() {
    const { cart } = this.context.i18n;
    const {
      brand,
      addedCoupon,
      items,
      params,
      orderSummary,
      isUniqlo,
      isCartEmpty,
      onRemoveCartItem,
      defaultGift,
      isCheckoutAvailable,
      isNativeAppApplePayAvailable,
      detailedErrors: { cartItems: cartItemErrors = {} },
    } = this.props;

    const isApplePayAvaialble = canMakePayments || isNativeAppApplePayAvailable;

    const { giftingSelected, collapsed } = this.state;

    if (isCartEmpty) {
      return <Text className={`blockText ${styles.emptyMsg}`}>{cart.empty}</Text>;
    }

    const itemsElements = items.map((item, index) =>
      <Products brand={brand} item={item} key={index} onRemoveCartItem={onRemoveCartItem} cartItemErrors={cartItemErrors} />);

    const expandedClass = cx({
      orderSummaryExpanded: !collapsed,
    });

    const bottomTileClassName = cx({
      orderSummaryBottomTile: collapsed,
      summaryBottomTileBorder: !collapsed,
    });

    const checkoutBtnConfigs = {
      label: isUniqlo ? cart.purchaseProcedureUQ : cart.purchaseProcedureGU,
      className: cx('medium', styles.purchaseBtn, 'primary',
        {
          [styles.purchaseBtnWithApplePay]: isApplePayAvaialble,
        }),
    };

    return (
      <div>
        { itemsElements }
        <CouponPanel
          couponName={addedCoupon.title}
          params={params}
          to={this.couponPageUrl}
          variation="cart"
        />
        <OrderSummary
          bottomTileClassName={bottomTileClassName}
          className={expandedClass}
          collapsedClassName={styles.summaryCollapsed}
          fromCart
          headerStyle={styles.titleStyle}
          onToggle={this.onToggle}
          order={orderSummary}
          toggleable
          defaultState="expand"
          brand={brand}
          giftingSelected={giftingSelected}
        />
        <Gift
          brand={brand}
          gift={defaultGift}
          onChange={this.setGifting}
          selected={giftingSelected}
        />
        <TimeoutInfo />
        <Button
          {...checkoutBtnConfigs}
          onTouchTap={this.onCheckoutFromCart}
          disabled={!isCheckoutAvailable}
          analyticsOn="Button Click"
          analyticsCategory="Checkout Funnel"
          analyticsLabel="PROCEED TO CHECKOUT"
        />
        <StickyTotal fromCart giftingSelected={giftingSelected} />
        <If
          if={isApplePayAvaialble}
          then={ApplePay}
          brand={brand}
          isGiftCardPayment={!!orderSummary.giftCardPayment}
        />
      </div>
    );
  }
}
