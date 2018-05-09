import React, { PropTypes, PureComponent } from 'react';
import getSiteConfig from 'config/site';
import If from 'components/uniqlo-ui/If';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import { redirect, getCurrentHost } from 'utils/routing';
import { connect } from 'react-redux';
import MessageBox from 'components/MessageBox';
import BrandHeader from 'components/BrandHeader';
import { removeCartItem } from 'redux/modules/cart';
import cx from 'classnames';
import Body from './Body';
import styles from './styles.scss';

const { string, object, bool, func } = PropTypes;

@connect(null, { removeCartItem })
class Content extends PureComponent {
  static propTypes = {
    brand: string,
    removeCartItem: func,

    // true when cart is uniqlo, comes from selectors
    isUniqloBrand: bool,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
    confirmMessage: false,
    editCartData: {},
    editCount: 0,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.brand !== nextProps.brand && this.state.confirmMessage) {
      this.setState({ confirmMessage: false });
    }
  }

  onConfirmRemoveItem = (status) => {
    if (status === 'yes') {
      this.props.removeCartItem(this.state.seqNo, this.props.brand);
    }

    this.setState({ confirmMessage: false });
  };

  onRemoveCartItem = (seqNo) => {
    this.setState({ confirmMessage: true, seqNo });
  };

  goToTopPage = () => {
    const { UQ_LINK_TO_TOP_PAGE, GU_LINK_TO_TOP_PAGE } = getSiteConfig();
    let redirectTo = UQ_LINK_TO_TOP_PAGE.replace('{%hostname}', getCurrentHost(true));

    if (this.props.brand === 'gu') {
      redirectTo = GU_LINK_TO_TOP_PAGE.replace('{%hostname}', getCurrentHost(false, 'gu'));
    }

    redirect(redirectTo);
  };

  render() {
    const { cart, common } = this.context.i18n;
    const { brand } = this.props;

    return (
      <Container className={styles.cartContainer}>
        <BrandHeader brand={brand} wrapperClass={styles.brandHeaderWrapper} />
        <Body
          brand={brand}
          onRemoveCartItem={this.onRemoveCartItem}
        />
        <Button
          className={cx('default', 'medium', styles.continueBtn)}
          label={common.continueShopping}
          onTouchTap={this.goToTopPage}
          analyticsOn="Button Click"
          analyticsCategory="Checkout Funnel"
          analyticsLabel="Continue shopping"
        />
        <Text content={cart.wishlistNotAvailable} className={`${styles.wishlistMessage} blockText`} />
        <If
          if={this.state.confirmMessage}
          then={MessageBox}
          stickyBox
          confirmLabel={cart.removeCartConfirmLabel}
          message={cart.removeCartMessage}
          onAction={this.onConfirmRemoveItem}
          rejectLabel={cart.removeCartReject}
          variation="confirm"
        />
      </Container>
    );
  }
}

export default Content;
