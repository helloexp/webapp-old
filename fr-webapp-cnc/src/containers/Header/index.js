import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getBrand } from 'redux/modules/cart/selectors';
import If from 'components/uniqlo-ui/If';
import Header from 'components/Header';
import * as utils from './utils';

const { string, bool, object } = PropTypes;

/**
 * Application header component
 * @export
 * @class Header
 * @extends {PureComponent}
 */
@connect(state => ({
  brand: getBrand(state),
  isGULogo: utils.isGULogo(state),
  isHeaderShown: utils.isHeaderShown(state),
  headerLogoImage: utils.getHeaderLogoImage(state),
  guHeaderLogo: utils.getGuHeaderLogo(state),
  headerLogoLinks: utils.getHeaderLogoLinks(state),
}))
export default class HeaderContainer extends PureComponent {
  static propTypes = {
    brand: string.isRequired,
    isGULogo: bool.isRequired,
    isHeaderShown: bool.isRequired,
    headerLogoImage: string.isRequired,
    guHeaderLogo: string,
    headerLogoLinks: object.isRequired,
  };

  render() {
    const {
      brand,
      isGULogo,
      isHeaderShown,
      headerLogoImage,
      guHeaderLogo,
      headerLogoLinks: { firstLogoLink, secondLogoLink },
    } = this.props;

    return (
      <If
        if={isHeaderShown}
        then={Header}
        {...{ brand, isGULogo, headerLogoImage, guHeaderLogo, firstLogoLink, secondLogoLink }}
      />
    );
  }
}
