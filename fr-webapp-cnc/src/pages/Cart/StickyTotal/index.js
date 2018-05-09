import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import { isCheckoutAvailable as isCheckoutAvailableSelector, isUniqlo, getIfFreeShipping } from 'redux/modules/cart/selectors';
import { getTotalAmount } from 'redux/modules/checkout/order/selectors';
import { checkoutFromCart } from 'redux/modules/cart';
import events from 'utils/events';
import { getScrollPosition } from 'utils/scroll';
import { formatPrice } from 'utils/format';
import classNames from 'classnames';
import styles from './styles.scss';

/**
 * The percentage of the page where this component will be displayed.
 * @type {number}
 */
const displayPercentage = 0.05;
const hidePercentage = 2.15;

const { bool, string, func, number } = PropTypes;

@connect(
  (state, props) => ({
    totalAmount: getTotalAmount(state, props),
    isCheckoutAvailable: isCheckoutAvailableSelector(state, props),
    isUQCart: isUniqlo(state, props),
    isFreeShipping: getIfFreeShipping(state, props),
  }),
  {
    onCheckoutFromCart: checkoutFromCart,
  })
export default class StickyTotal extends PureComponent {
  static propTypes = {
    total: string,
    onCheckoutFromCart: func,
    fromCart: bool,
    giftingSelected: bool,

    // from selector
    totalAmount: number,
    isCheckoutAvailable: bool,
    isUQCart: bool,
    isFreeShipping: bool,
  };

  static contextTypes = {
    i18n: PropTypes.object,
  };

  static defaultProps = {
    giftingSelected: true,
  };

  state = {
    isShown: false,
  };

  componentDidMount() {
    this.listenScroll();

    // parse scroll if user went back/forth through history
    this.handleScroll();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.isShown !== nextState.isShown || this.props.totalAmount !== nextProps.totalAmount;
  }

  componentWillUnmount() {
    events.unsubscribe(this.subscription);
  }

  /**
   * Subscription id
   * @type {number}
   */
  subscription = 0;

  listenScroll = () => {
    this.subscription = events.subscribe('scroll', this.handleScroll);
  };

  handleScroll = () => {
    const currentIsShown = this.state.isShown;
    const height = document.body.scrollHeight;
    const currentToHide = height * hidePercentage;
    const currentToShow = height * displayPercentage;
    const scroll = getScrollPosition();
    const newIsShown = scroll > currentToShow && scroll < currentToHide;

    if (currentIsShown !== newIsShown) {
      this.setState({
        isShown: newIsShown,
      });
    }
  };

  render() {
    const { cart } = this.context.i18n;
    const { totalAmount, onCheckoutFromCart, isCheckoutAvailable, isUQCart, isFreeShipping } = this.props;
    const { isShown } = this.state;
    const uqShippingMessage = isFreeShipping ? cart.stickyTotalMessageMore : cart.stickyTotalMessageLess;
    const shippingMessage = isUQCart ? uqShippingMessage : cart.guFreeShippingMessage;

    return (
      <Container className={classNames(styles.stickyContainer, { [styles.hide]: !isShown })}>
        <Text content={shippingMessage} className={`blockText ${styles.message}`} />
        <Container className={styles.stickyTotal}>
          <Container className={styles.total}>
            <Text className={styles.finePrintText}>{cart.subtotal}</Text>
            <Text className={styles.totalAmount}>{formatPrice(totalAmount)}</Text>
          </Container>
          <Container className={styles.checkoutWrapper}>
            <Button
              className={`secondary medium ${styles.checkout}`}
              label={cart.checkout}
              onTouchTap={onCheckoutFromCart}
              disabled={!isCheckoutAvailable}
              analyticsOn="Button Click"
              analyticsCategory="Checkout Funnel"
              analyticsLabel="PROCEED TO CHECKOUT FLOATING"
            />
          </Container>
        </Container>
      </Container>
    );
  }
}
