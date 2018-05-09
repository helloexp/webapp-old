import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import * as cartActions from 'redux/modules/cart';
import { redirectToAccountLogin, getAuthenticated } from 'redux/modules/account/auth';
import { getBrand } from 'redux/modules/cart/selectors';
import { trackCheckoutNavigation } from 'utils/gtm';

const { object, func, string, bool } = PropTypes;

@asyncConnect([{ promise: cartActions.initializeCheckoutPage }])
@connect(
  (state, props) => ({
    brand: getBrand(state, props),
    isAuthenticated: getAuthenticated(state),
  }),
  {
    ...cartActions,
    redirectToAccountLogin,
  })
class Checkout extends Component {

  static propTypes = {
    // from cartActions
    checkout: func,
    // from cartActions
    redirectToAccountLogin: func,
    // from cartActions
    saveCheckout: func,
    // from selectors
    isAuthenticated: bool,
    // from selectors
    brand: string,
  };

  static contextTypes = {
    i18n: object,
  };

  componentDidMount() {
    const { isAuthenticated, brand, checkout, saveCheckout } = this.props;

    trackCheckoutNavigation(brand);

    // saves checkout cookie for checkout pages
    saveCheckout(brand, !isAuthenticated);

    if (!isAuthenticated) {
      return this.props.redirectToAccountLogin();
    }

    return checkout(brand);
  }

  render() {
    return null;
  }
}

export default Checkout;
