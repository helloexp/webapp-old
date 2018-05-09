import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Icon from 'components/uniqlo-ui/core/Icon';
import Image from 'components/uniqlo-ui/Image';
import Link from 'components/uniqlo-ui/Link';
import If from 'components/uniqlo-ui/If';
import MiniBagContainer from 'components/MiniBagContainer';
import MiniBagDetails from 'components/MiniBagDetails';
import IconButton from 'components/IconButton';
import { routes, routePatterns } from 'utils/urlPatterns';
import { getUrlWithQueryData, getCurrentHost, redirect } from 'utils/routing';
import { getLoginStatus, saveAndRedirectToLogin, logout } from 'redux/modules/account/auth';
import { expandMinibag as expandMinibagAction } from 'redux/modules/header';
import { isCreditCardUnsaved as isCreditCardUnsavedSelector } from 'redux/modules/checkout/payment/selectors';
import { isUQPaymentTimeExpired as isUniqloStorePaymentSelector, getTotalCartValue } from 'redux/modules/checkout/order/selectors';
import { isConciergeCheckout as conciergeCheckout } from 'redux/modules/checkout/order/actions';
import { getRoutingPathName } from 'redux/modules/selectors';
import styles from './styles.scss';

const { object, bool, string, func } = PropTypes;

const UqGuLogo = (props, { i18n }) => {
  const { to, imageSource, imageClass, showNavigationAlert, isPayAtStoreConfirm } = props;
  const { common, reviewOrder, orderConfirmation } = i18n;
  const payAtStoreAlertText = `${common.navigateWarning}\n\n${orderConfirmation.payAtStoreSubTitle[0]}`;
  const navigationTexts = {
    cancelBtnLabel: common.cancelText,
    confirmBtnLabel: isPayAtStoreConfirm ? common.confirmLabel : common.continueText,
    warningMessage: isPayAtStoreConfirm ? payAtStoreAlertText : reviewOrder.editWithCreditCard,
  };

  return (
    <Link
      to={to}
      className={styles.imageWrapper}
      confirmNavigateAway={showNavigationAlert}
      navigationTexts={navigationTexts}
    >
      <Image
        className={imageClass}
        source={imageSource}
      />
    </Link>
  );
};

UqGuLogo.propTypes = {
  imageClass: string,
  imageSource: string,
  to: string,
  showNavigationAlert: bool,
  isPayAtStoreConfirm: bool,
};

UqGuLogo.contextTypes = {
  i18n: object,
};

const HeaderNavButtons = ({ isAuthenticated, loginAction, registerAction }, { i18n: { cart, account } }) => {
  let loginProps = {
    iconName: 'ActionLogin',
    label: cart.signIn,
    analyticsOn: 'Button Click',
    analyticsCategory: 'Common Header',
    analyticsLabel: 'H_login',
  };

  if (isAuthenticated) {
    loginProps = {
      iconName: 'ActionLogout',
      label: cart.logOut,
    };
  }

  return (
    <div className={styles.buttonsWrapper}>
      <IconButton
        labelStyle={styles.buttonLabel}
        onTouchTap={loginAction}
        className={styles.firstButton}
        {...loginProps}
      />
      <IconButton
        iconName={isAuthenticated ? 'ActionViewAccount' : 'ActionRegister'}
        label={isAuthenticated ? account.membershipAddress : account.memberRegistration}
        labelStyle={styles.buttonLabel}
        onTouchTap={registerAction}
        analyticsOn="Button Click"
        analyticsCategory="Common Header"
        analyticsLabel={isAuthenticated ? 'H_ member' : 'H_regist'}
      />
    </div>
  );
};

HeaderNavButtons.propTypes = {
  isAuthenticated: bool,
  loginAction: func,
  registerAction: func,
};

HeaderNavButtons.contextTypes = {
  i18n: object,
};

@connect((state, props) => {
  const pathName = getRoutingPathName(state);

  return ({
    isMinibagExpanded: state.header.isMinibagExpanded,
    isCreditCardUnsaved: state.payment && isCreditCardUnsavedSelector(state, props),
    isUniqloStorePayment: state.order && state.order.orderDetails && isUniqloStorePaymentSelector(state),
    totalOrderAmount: getTotalCartValue(state, props),
    isAuthenticated: getLoginStatus(state, props),
    promotion: state.header.promotion,
    routing: state.routing,
    pathName,
    isConciergeCheckout: pathName.match(routePatterns.reviewOrder) && conciergeCheckout(state),
  });
}, {
  expandMinibag: expandMinibagAction,
  saveAndRedirectToLogin,
  logout,
})
export default class Header extends PureComponent {
  static propTypes = {
    brand: string,
    isGULogo: bool,
    headerLogoImage: string,
    guHeaderLogo: string,
    isMinibagExpanded: bool,
    totalOrderAmount: string,
    promotion: object,
    routing: object,
    expandMinibag: func,
    firstLogoLink: string,
    secondLogoLink: string,
    isCreditCardUnsaved: bool,
    isUniqloStorePayment: bool,
    isAuthenticated: bool,
    saveAndRedirectToLogin: func,
    logout: func,
    pathName: string,
    isConciergeCheckout: bool,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  onLoginLogoutPress = () => {
    if (this.props.isAuthenticated) {
      this.props.logout();
    } else {
      this.props.saveAndRedirectToLogin(getUrlWithQueryData(routes.cart, { brand: this.props.brand }));
    }
  };

  onRegistrationPress = () => {
    const { context: { config: { account } }, props: { isAuthenticated, pathName, brand } } = this;
    const { memberInfo, cart } = routes;

    const redirectPage = isAuthenticated
      ? memberInfo
      : account.memberRegistry.replace('{%hostname}', getCurrentHost(false));

    const redirectURL = pathName.includes(cart) && redirectPage === memberInfo
      ? getUrlWithQueryData(redirectPage, { brand })
      : redirectPage;

    redirect(redirectURL);
  }

  toggleMinibag = () => {
    const {
      isMinibagExpanded,
      expandMinibag,
    } = this.props;

    expandMinibag(!isMinibagExpanded);
  };

  render() {
    const {
      i18n: { common },
    } = this.context;
    const {
      isGULogo,
      headerLogoImage,
      isMinibagExpanded,
      totalOrderAmount,
      promotion,
      guHeaderLogo,
      firstLogoLink,
      secondLogoLink,
      isCreditCardUnsaved,
      isUniqloStorePayment,
      isAuthenticated,
      pathName,
      isConciergeCheckout,
    } = this.props;

    const toggleButton = isMinibagExpanded
      ? <span className={styles.miniBagCareUp} />
      : <Icon className="iconChevronDown" />;

    const headerClasses = classnames(styles.header, {
      [styles.headerIsFixed]: isMinibagExpanded,
    });
    const logoClasses = classnames({
      [styles.brand]: !guHeaderLogo,
      [styles.uqGubrand]: !!guHeaderLogo,
      [styles.logo]: !isGULogo,
      [styles.gulogo]: isGULogo,
    });
    const headerLogoClasses = classnames({
      [styles.uqGulogo]: !!guHeaderLogo,
    });
    const isPayAtStoreConfirm = pathName.includes(routes.confirmOrder) && isUniqloStorePayment;
    const isCheckout = pathName.includes(routes.checkout);
    // Minibag is only shown in the routes delivery, payment and review order
    const isMinibagVisible = ['delivery', 'payment', 'reviewOrder'].some(route => pathName.match(routePatterns[route]));
    const logoLinks = isConciergeCheckout
      ? { firstLogoLink: '', secondLogoLink: '' }
      : { firstLogoLink, secondLogoLink };

    return (
      <div className={headerClasses}>
        <If
          if={promotion.text}
          colSpan={12}
          className={styles.promotion}
        >
          {promotion.text}
        </If>
        <div className={styles.current}>
          <div className={headerLogoClasses}>
            <UqGuLogo
              imageClass={logoClasses}
              to={logoLinks.firstLogoLink}
              imageSource={headerLogoImage}
              showNavigationAlert={isCreditCardUnsaved || isPayAtStoreConfirm}
              isPayAtStoreConfirm={isPayAtStoreConfirm}
            />
            <If
              if={guHeaderLogo}
              imageClass={logoClasses}
              then={UqGuLogo}
              imageSource={guHeaderLogo}
              to={logoLinks.secondLogoLink}
            />
          </div>
          <If
            common={common}
            if={isMinibagVisible}
            onToggle={this.toggleMinibag}
            then={MiniBagContainer}
            toggleButton={toggleButton}
            totalOrderAmount={totalOrderAmount}
          />
          <If
            if={!isCheckout && !isMinibagVisible}
            then={HeaderNavButtons}
            isAuthenticated={isAuthenticated}
            loginAction={this.onLoginLogoutPress}
            registerAction={this.onRegistrationPress}
          />
        </div>
        <If
          if={isMinibagExpanded}
          onToggle={this.toggleMinibag}
          then={MiniBagDetails}
        />
      </div>
    );
  }
}
