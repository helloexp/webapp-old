import React, { PureComponent, PropTypes } from 'react';
import cx from 'classnames';
import { routes } from 'utils/urlPatterns';
import If from 'components/uniqlo-ui/If';
import BrandTabs from './BrandTabs';
import BrandLinks from './BrandLinks';

import styles from './style.scss';

const { string, bool, arrayOf, func, object } = PropTypes;

/**
 * Application footer component
 * @export
 * @class Footer
 * @extends {PureComponent}
 */
export default class Footer extends PureComponent {
  static propTypes = {
    brand: string.isRequired,
    isFooterShown: bool.isRequired,
    isBrandTabsShown: bool.isRequired,
    isLinksSectionShown: bool.isRequired,
    copyrightBrands: arrayOf(string).isRequired,
    isLinksTopBorderShown: bool.isRequired,
    isBottomPaddingAdded: bool.isRequired,
    changeFooterBrand: func.isRequired,
    saveAndRedirectToLogin: func.isRequired,
    logout: func.isRequired,
  };

  static contextTypes = {
    i18n: object,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.brand !== nextProps.brand) {
      this.setState({
        brand: nextProps.brand,
      });
    }
  }

  /**
   * Generate copyright text
   * @memberof Footer
   * @returns {Array<JSX>}
   */
  getCopyrightText = copyrightI18n =>
    this.props.copyrightBrands.map((brand, idx) =>
      <div key={idx}>{copyrightI18n[brand]}</div>);

  render() {
    const { i18n } = this.context;
    const {
      isBottomPaddingAdded,
      brand,
      isBrandTabsShown,
      changeFooterBrand,
      saveAndRedirectToLogin,
      isLinksSectionShown,
      isLinksTopBorderShown,
      logout,
      isFooterShown,
    } = this.props;

    if (!isFooterShown) {
      return null;
    }

    const isFromCartOrCheckout = [routes.checkout, routes.cart].find(route =>
      window.location.pathname.includes(route));

    const footerClass = cx({
      [styles.footer]: isBottomPaddingAdded,
      [styles.noTopSpacing]: isFromCartOrCheckout,
    });

    return (
      <footer className={footerClass}>
        <If
          if={isBrandTabsShown}
          then={BrandTabs}
          brand={brand}
          changeFooterBrand={changeFooterBrand}
        />
        <If
          if={isLinksSectionShown}
          then={BrandLinks}
          {...{ brand, isLinksTopBorderShown, saveAndRedirectToLogin, logout }}
        />
        <div className={cx(styles.copyright, { [styles.smallSpacingCopyright]: isFromCartOrCheckout })}>{this.getCopyrightText(i18n.common.copyright)}</div>
      </footer>
    );
  }
}
