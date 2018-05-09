import React, { PropTypes, PureComponent } from 'react';
import classNames from 'classnames';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import { connect } from 'react-redux';
import Grid from 'components/uniqlo-ui/core/Grid';
import GridCell from 'components/uniqlo-ui/core/GridCell';
import If from 'components/uniqlo-ui/If';
import { maybeNavigate } from 'redux/modules/app';
import * as cartSelector from 'redux/modules/cart/selectors';
import { isCreditCardValid as hasCreditCardUnsavedSelector } from 'redux/modules/checkout/payment/selectors';
import { isConciergeCheckout as conciergeCheckout } from 'redux/modules/checkout/order/actions';
import { getUrlWithQueryData, redirect } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import Heading from 'components/uniqlo-ui/Heading';
import CartItems from './CartItems';
import styles from './styles.scss';

const { array, object, number, func, bool, string } = PropTypes;

@connect((state, props) => ({
  brand: cartSelector.getBrand(state, props),
  cartItems: cartSelector.getCartItems(state, props),
  totalItems: cartSelector.getCart(state, props).totalItems,
  isCreditCardUnsaved: hasCreditCardUnsavedSelector(state, props),
  isConciergeCheckout: conciergeCheckout(state),
}), {
  toggleNavigationAlert: maybeNavigate,
})
export default class ShoppingBagSummary extends PureComponent {
  static propTypes = {
    toggleNavigationAlert: func,
    isCreditCardUnsaved: bool,
    brand: string,

    // items in cart from selectors
    cartItems: array.isRequired,
    isConciergeCheckout: bool,

    // total no.items from cart selectors
    totalItems: number,
  };

  static contextTypes = {
    config: object,
    i18n: object,
  };

  handleCartNavigation = () => {
    const cartUrl = getUrlWithQueryData(routes.cart, { brand: this.props.brand });
    const {
      props: { toggleNavigationAlert, isCreditCardUnsaved },
      context: { i18n: { reviewOrder, common } },
     } = this;

    if (isCreditCardUnsaved) {
      toggleNavigationAlert(cartUrl, false, null, {
        confirmBtnLabel: common.continueText,
        cancelBtnLabel: common.cancelText,
        warningMessage: reviewOrder.editWithCreditCard,
      });
    } else {
      redirect(cartUrl);
    }
  }

  render() {
    const { i18n: { shoppingBagSummary, cart } } = this.context;
    const { cartItems, totalItems, isConciergeCheckout } = this.props;

    return (
      <Container className={styles.itemsWrap}>
        <Grid className="verticalCenter">
          <GridCell className={styles.itemsHeading} colSpan={10}>
            <Heading
              className={classNames('summaryHeading', styles.summary)}
              headingText={shoppingBagSummary.itemHead}
              type="h3"
            />
            <Text className={styles.count}>{`| ${cart.totalOf}${totalItems} ${cart.points}`}</Text>
          </GridCell>
          <GridCell colSpan={2} contentAlign="right" className={styles.editCartButton}>
            <If
              if={!isConciergeCheckout}
              then={Button}
              className={classNames('default', 'small', 'boldLight', styles.footerBtn)}
              onTouchTap={this.handleCartNavigation}
              label={cart.editItem}
            />
          </GridCell>
        </Grid>
        <CartItems className="cartItem" items={cartItems} />
      </Container>
    );
  }
}
