import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import ErrorHandler from 'containers/ErrorHandler';
import If from 'components/uniqlo-ui/If';
import CustomerServiceButton from 'components/CustomerServiceButton';
import ErrorMessage from 'components/ErrorMessage';
import BrandHeader from 'components/BrandHeader';
import Container from 'components/uniqlo-ui/core/Container';
import defaultSiteConfig from 'config/site/default';
import { clearCartGifting, initializeCartPage, loadCatalogData as loadCatalogDataAction, switchCart } from 'redux/modules/cart';
import { cancelGift } from 'redux/modules/checkout/gifting/actions';
import { constructSilvereggScript, getSilvereggProducts } from 'redux/modules/silveregg';
import { initializeWishlist } from 'redux/modules/wishlist/actions';
import { loadStyleData as loadStyleDataAction, loadRecentlyViewedProductIds } from 'redux/modules/style';
import { trackCartNavigation } from 'utils/gtm';
import { isApplePaySessionAvailable } from 'utils/applePay';
import Certona from 'containers/Product/Certona';
import * as cartSelector from 'redux/modules/cart/selectors';
import { checkoutGroup as preloadCheckout } from 'routes/appRoutes';
import noop from 'utils/noop';
import cx from 'classnames';
import RecentlyViewed from './RecentlyViewed';
import GuProductRecommendations from './GuProductRecommendations';
import styles from './Cart.scss';
import Content from './Content';

const { object, func, string, bool, array } = PropTypes;

function clickHandler(event) {
  event.stopPropagation();
  event.preventDefault();
}

@connect(
  (state, props) => ({
    isCartEmpty: cartSelector.isCartEmpty(state, props),
    isOtherCartEmpty: cartSelector.isOtherCartEmpty(state, props),
    cartItems: cartSelector.getCartItems(state, props),
    cartItemIds: cartSelector.getCartItemIds(state, props),
    isUniqlo: cartSelector.isUniqlo(state, props),
    firstCartItem: cartSelector.getFirstCartItem(state, props),
    brand: cartSelector.getBrand(state, props),
    otherBrand: cartSelector.getOtherBrand(state, props),
    guCart: cartSelector.getGuCart(state),
  }),
  {
    cancelGift,
    clearCartGifting,
    initCart: () => (dispatch, getState) => initializeCartPage({ store: { dispatch, getState } }),
    loadCatalogData: loadCatalogDataAction,
    loadStyleData: loadStyleDataAction,
    initializeWishlist,
    switchToOtherCart: switchCart,
    getSilvereggProducts,
    loadRecentlyViewedProductIds,
  })
@ErrorHandler([
  'applyGiftCard',
  'coupon',
  'getBillingAddress',
  'getCartCouponInfo',
  'getDeliveryMethod',
  'getPaymentType',
  'giftBagFetch',
  'loadCart',
  'loadGiftCards',
  'loadDeliveryOptions',
  'loadPaymentOptions',
  'placeOrder',
  'prepareLogin',
  'provisionalInventory',
  'requestToken',
  'removeCartItem',
  'removeGiftCard',
  'requestToken',
  'saveGiftMessage',
  'saveShippingAddress',
  'setBillingAddress',
  'setCartItemCount',
  'setDeliveryType',
  'setPaymentMethod',
  'getOrderDetails',
  'verifyGiftCard',
  'backToCart',
  'loadSplitDetails',
  'applePayPIB',
  'applePayOrder',
])
export default class Cart extends PureComponent {

  static propTypes = {
    // from errorHandler HOC
    error: string,

    // action creator from redux/cart
    loadCatalogData: func,

    // action from redux/style. Used for loading style recommendations
    loadStyleData: func,

    // action from redux/style. Used for loading recently viewed items
    loadRecentlyViewedProductIds: func,

    // true when cart is empty, from selectors
    isCartEmpty: bool,

    isOtherCartEmpty: bool,

    // flag that returns true if using uniqlo brand in cart, from selectors
    isUniqlo: bool,

    // array of cart items, from selectors
    cartItems: array,

    // array of cart item IDs, from selectors
    cartItemIds: array,

    // first item in the cart, coming from selectors
    firstCartItem: string,

    // current brand 'uq' or 'gu'
    brand: string,

    // other brand 'gu' or 'uq'
    otherBrand: string,

    // We need to clear gifting on cart when switching brand
    clearCartGifting: func,

    // We need to clear gifting on gifting reducer as well
    cancelGift: func,

    initCart: func,
    initializeWishlist: func,
    switchToOtherCart: func,

    // For loading Gu product recommendations
    getSilvereggProducts: func,
    guCart: object,
  };

  static defaultProps = {
    cartItems: [],
  };

  static contextTypes = {
    i18n: object,
  };

  componentWillMount() {
    document.addEventListener('click', clickHandler, true);

    this.silvereggScript = constructSilvereggScript(this.props.guCart);

    window.processSilvereggResponse = (json) => {
      this.props.getSilvereggProducts(json);
    };
    this.props.initializeWishlist(this.props.brand);
    this.props.initCart()
    .then(() => {
      // preload checkout logic (not API) after 5 seconds
      setTimeout(() => preloadCheckout('checkout')(null, noop), 5000);

      if (this.props.isCartEmpty) {
        trackCartNavigation({
          [this.props.brand]: [],
        });
      }
    })
    .then(
      () => document.removeEventListener('click', clickHandler, true),
      () => document.removeEventListener('click', clickHandler, true)
    );
  }

  componentWillReceiveProps(props) {
    const { isCartEmpty, cartItems, cartItemIds, loadCatalogData, brand, guCart: { items, totalAmount } } = props;
    const { brand: currentBrand, guCart: { items: currentItems, totalAmount: currentTotalAmount }, isCartEmpty: isCurrentCartEmpty } = this.props;

    if (items.length !== currentItems.length || totalAmount !== currentTotalAmount) {
      this.silvereggScript = constructSilvereggScript(props.guCart);
    }

    if (brand !== currentBrand) {
      this.props.loadRecentlyViewedProductIds();
      this.props.initializeWishlist(brand)
        .catch(noop);
    }

    // if cart is no longer empty, load catalog data
    if (isCurrentCartEmpty && !isCartEmpty) {
      loadCatalogData(cartItemIds, brand)
        .then((catalogData) => {
          const { items: catalogItems } = catalogData;

          trackCartNavigation({
            [brand]: cartItems.map(cartItem => ({
              ...cartItem,
              catalogItem: catalogItems.find(catalogItem => catalogItem.productID === cartItem.id),
            })),
          });
        });
    }
  }

  onGoToCart = () => {
    // Clear gifting before going to the other cart
    this.props.clearCartGifting();
    this.props.cancelGift();
    this.props.switchToOtherCart(this.props.otherBrand);
  };

  render() {
    const { i18n: { cart } } = this.context;
    const { creditCard: creditCardConfig } = defaultSiteConfig;
    const certonaScript = [{
      src: defaultSiteConfig.certona.scriptUrl,
      type: 'text/javascript',
    }];
    const {
      cartItems,
      isUniqlo,
      isOtherCartEmpty,
      firstCartItem,
      brand,
      otherBrand,
      error,
      guCart,
    } = this.props;
    const multipleCartItems = cartItems.length > 1;
    const certonaId = multipleCartItems ? cartItems.map(item => item.id).join(',') : firstCartItem;

    let productRecommendationScripts = certonaScript;

    if (!isUniqlo) {
      productRecommendationScripts = this.silvereggScript;
    }

    return (
      <div className={styles.cartMainContainer}>
        <Helmet script={productRecommendationScripts} title={cart.pageTitle} />
        <If
          if={isApplePaySessionAvailable}
          then={Helmet}
          script={[{
            src: creditCardConfig.jscDataScriptUrl,
            type: 'text/javascript',
          }]}
        />
        <If
          if={error}
          scrollUpOnError
          message={error}
          rootClassName="cartPageError"
          then={ErrorMessage}
        />
        <Content brand={brand} />
        <CustomerServiceButton variation="cart" />
        <If
          if={firstCartItem && isUniqlo}
          then={Certona}
          brand={brand}
          multiple={multipleCartItems}
          containerId={certonaId}
          onlineId={certonaId}
          pageType={defaultSiteConfig.certona.CART_PAGE_TYPE}
          type="alsoBought,alsoLooked"
        />
        <If
          if={!isUniqlo}
          then={GuProductRecommendations}
          guCart={guCart}
        />
        <RecentlyViewed brand={brand} />
        <Container className={cx('guCart', styles.guCartContainer)}>
          <BrandHeader
            brand={otherBrand}
            goToCart={this.onGoToCart}
            linkToCart
            isButtonShown={!isOtherCartEmpty}
          />
        </Container>
      </div>
    );
  }
}
