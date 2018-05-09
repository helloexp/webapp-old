import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getBrand } from 'redux/modules/cart/selectors';
import { saveAndRedirectToLogin, logout } from 'redux/modules/account/auth';
import Footer from 'components/Footer';
import {
  isFooterShown,
  isBrandTabsShown,
  isLinksSectionShown,
  getCopyrightBrands,
  isLinksTopBorderShown,
  isBottomPaddingAdded,
} from './utils';

const { string, bool, arrayOf, func } = PropTypes;

/**
 * Application footer component
 * @export
 * @class Footer
 * @extends {PureComponent}
 */
@connect(state => ({
  brand: getBrand(state),
  isFooterShown: isFooterShown(state),
  isBrandTabsShown: isBrandTabsShown(state),
  isLinksSectionShown: isLinksSectionShown(state),
  isLinksTopBorderShown: isLinksTopBorderShown(state),
  isBottomPaddingAdded: isBottomPaddingAdded(state),
  copyrightBrands: getCopyrightBrands(state),
}), {
  saveAndRedirectToLogin,
  logout,
})
export default class FooterContainer extends PureComponent {
  static propTypes = {
    brand: string.isRequired,
    isFooterShown: bool.isRequired,
    isBrandTabsShown: bool.isRequired,
    isLinksSectionShown: bool.isRequired,
    isLinksTopBorderShown: bool.isRequired,
    isBottomPaddingAdded: bool.isRequired,
    copyrightBrands: arrayOf(string).isRequired,

    saveAndRedirectToLogin: func.isRequired,
    logout: func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      brand: this.props.brand,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.brand !== nextProps.brand) {
      this.setState({
        brand: nextProps.brand,
      });
    }
  }

  /**
   * Change footer brand action
   * @memberof FooterContainer
   * @param {string} brand
   */
  changeFooterBrand = (brand) => {
    this.setState({
      brand,
    });
  };

  /**
   * Login button action
   * @memberof FooterContainer
   */
  saveAndRedirectToLogin = () => {
    this.props.saveAndRedirectToLogin();
  };

  /**
   * Logout button action
   * @memberof FooterContainer
   */
  handleLogout = () => {
    this.props.logout();
  };

  render() {
    return (
      <Footer
        brand={this.state.brand}
        isFooterShown={this.props.isFooterShown}
        isBrandTabsShown={this.props.isBrandTabsShown}
        isLinksSectionShown={this.props.isLinksSectionShown}
        copyrightBrands={this.props.copyrightBrands}
        isLinksTopBorderShown={this.props.isLinksTopBorderShown}
        isBottomPaddingAdded={this.props.isBottomPaddingAdded}
        changeFooterBrand={this.changeFooterBrand}
        saveAndRedirectToLogin={this.saveAndRedirectToLogin}
        logout={this.handleLogout}
      />
    );
  }
}
