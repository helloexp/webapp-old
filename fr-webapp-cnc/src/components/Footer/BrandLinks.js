import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { routes } from 'utils/urlPatterns';
import Link from 'components/uniqlo-ui/Link';
import Button from 'components/uniqlo-ui/Button';
import Image from 'components/uniqlo-ui/Image';
import Grid from 'components/uniqlo-ui/core/Grid';
import GridCell from 'components/uniqlo-ui/core/GridCell';
import { getCurrentHost } from 'utils/routing';
import { brandName } from 'config/site/default';
import { getLoginStatus } from 'redux/modules/account/auth';
import { getRoutingPathName } from 'redux/modules/selectors';
import cx from 'classnames';
import { PVL, PHZ } from 'theme/spacing.scss';
import guLogo from 'images/gu-logo.svg';
import uqLogo from 'images/logo-uq.svg';
import styles from './style.scss';

const { bool, func, object, oneOf, string } = PropTypes;

/**
 * Footer brand related link section
 * @export
 * @class BrandLinks
 * @extends {PureComponent}
 */
@connect((state, props) => ({
  isAuthenticated: getLoginStatus(state, props),
  pathname: getRoutingPathName(state),
}))
export default class BrandLinks extends PureComponent {
  static propTypes = {
    brand: oneOf([brandName.uq, brandName.gu]).isRequired,
    isLinksTopBorderShown: bool.isRequired,
    saveAndRedirectToLogin: func.isRequired,
    logout: func.isRequired,
    isAuthenticated: bool,
    pathname: string,
  };

  static contextTypes = {
    config: object,
    i18n: object,
  };

  getLinks() {
    const { brand, pathname } = this.props;
    const { config, i18n } = this.context;
    const linksI18n = i18n.footer.links;
    const linksUrl = config.footer.links[brand];
    const isFromCart = pathname.includes(routes.cart);
    const linkClassNames = cx(styles.link, {
      [styles.smallSpacingLink]: isFromCart,
      [PVL]: !isFromCart,
      [PHZ]: !isFromCart,
    });

    const links = {
      [brandName.uq]: [
        {
          text: i18n.account.uniqloTop,
          addLogo: true,
          logoImg: uqLogo,
          imgStyle: styles.fixedSizeImg,
          noColSpan: true,
          props: {
            to: linksUrl.uniqloTop.replace('{%hostname}', getCurrentHost(false)),
            noRouter: true,
            className: styles.guLink,
          },
        },
        {
          text: this.props.isAuthenticated ? i18n.cart.logOut : linksI18n.login,
          isButton: true,
          props: {
            onTouchTap: this.props.isAuthenticated ? this.props.logout : this.props.saveAndRedirectToLogin,
            className: linkClassNames,
            confirmNavigateAway: true,
          },
        },
        {
          text: linksI18n.membership,
          props: {
            to: linksUrl.memberInfo.replace('{%hostname}', getCurrentHost(false)),
            className: linkClassNames,
          },
        },
        {
          text: linksI18n[brandName.uq].wishlist,
          props: {
            to: linksUrl.wishlist.replace('{%hostname}', getCurrentHost(false)),
            noRouter: true,
            className: linkClassNames,
          },
        },
        {
          text: linksI18n.cart,
          props: {
            to: linksUrl.cart.replace('{%hostname}', getCurrentHost(false)),
            noRouter: true,
            className: linkClassNames,
          },
        },
        {
          text: linksI18n.search,
          props: {
            to: linksUrl.search.replace('{%hostname}', getCurrentHost(false)),
            noRouter: true,
            className: linkClassNames,
          },
        },
        {
          text: linksI18n.storeLocator,
          props: {
            to: linksUrl.storeLocator.replace('{%hostname}', getCurrentHost(false, 'map')),
            noRouter: true,
            className: linkClassNames,
          },
        },
        {
          text: linksI18n.userGuide,
          props: {
            to: linksUrl.userGuide,
            noRouter: true,
            className: linkClassNames,
          },
        },
        {
          text: linksI18n[brandName.uq].onlineStore,
          addLogo: true,
          logoImg: guLogo,
          imgStyle: styles.guLogoImg,
          props: {
            to: linksUrl.onlineStore.replace('{%hostname}', getCurrentHost(false, 'gu')),
            noRouter: true,
            className: styles.guLink,
          },
        },
      ],
      [brandName.gu]: [
        {
          text: linksI18n[brandName.gu].guToTop,
          addLogo: true,
          logoImg: guLogo,
          imgStyle: styles.guLogoImg,
          props: {
            to: linksUrl.uniqloTop.replace('{%hostname}', getCurrentHost(false, 'gu')),
            noRouter: true,
            className: styles.guLink,
          },
        },
        {
          text: this.props.isAuthenticated ? i18n.cart.logOut : linksI18n.login,
          isButton: true,
          props: {
            onTouchTap: this.props.isAuthenticated ? this.props.logout : this.props.saveAndRedirectToLogin,
            className: linkClassNames,
            confirmNavigateAway: true,
          },
        },
        {
          text: linksI18n.membership,
          props: {
            to: linksUrl.memberInfo.replace('{%hostname}', getCurrentHost(false)),
            className: linkClassNames,
          },
        },
        {
          text: linksI18n[brandName.gu].wishlist,
          props: {
            to: linksUrl.wishlist.replace('{%hostname}', getCurrentHost(false)),
            noRouter: true,
            className: linkClassNames,
          },
        },
        {
          text: linksI18n.cart,
          props: {
            to: linksUrl.cart.replace('{%hostname}', getCurrentHost(false)),
            noRouter: true,
            className: linkClassNames,
          },
        },
        {
          text: linksI18n.search,
          props: {
            to: linksUrl.search.replace('{%hostname}', getCurrentHost(false)),
            noRouter: true,
            className: linkClassNames,
          },
        },
        {
          text: linksI18n.storeLocator,
          props: {
            to: linksUrl.storeLocator,
            noRouter: true,
            className: linkClassNames,
          },
        },
        {
          text: linksI18n.userGuide,
          props: {
            to: linksUrl.userGuide,
            noRouter: true,
            className: linkClassNames,
          },
        },
        {
          text: linksI18n[brandName.gu].onlineStore,
          addLogo: true,
          logoImg: uqLogo,
          imgStyle: styles.fixedSizeImg,
          noColSpan: true,
          props: {
            to: linksUrl.onlineStore.replace('{%hostname}', getCurrentHost(false)),
            noRouter: true,
            className: styles.guLink,
          },
        },
      ],
    };

    return links[brand].map((link, index) => {
      if (link.addLogo) {
        return (
          <Grid className={styles.guLogoContainer} childrenWrapperClass={link.noColSpan && 'noColspan' || ''} key={index}>
            <GridCell className={cx(styles.logos, brand, { [styles.smallSpacingLogos]: isFromCart })} colSpan={1}>
              <Image className={link.imgStyle || styles.image} source={link.logoImg} />
            </GridCell>
            <GridCell
              colSpan={!link.noColSpan && 10 || 1}
              className={cx(styles.linkContainer, { [styles.smallLinkContainer]: isFromCart })}
              contentAlign="left"
            >
              <Link key={index} {...link.props}>{link.text}</Link>
            </GridCell>
          </Grid>
        );
      }
      if (link.isButton) {
        return <Button key={index} {...link.props}>{link.text}</Button>;
      }

      return <Link key={index} {...link.props}>{link.text}</Link>;
    });
  }

  render() {
    return (
      <div className={cx(styles.links, { [styles.topBorder]: this.props.isLinksTopBorderShown })}>
        { this.getLinks() }
      </div>
    );
  }
}
