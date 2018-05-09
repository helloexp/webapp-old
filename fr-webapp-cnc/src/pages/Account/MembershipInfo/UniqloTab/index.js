import React, { PropTypes } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Image from 'components/uniqlo-ui/Image';
import Link from 'components/uniqlo-ui/Link';
import Divider from 'components/uniqlo-ui/Divider';
import { membersApi } from 'config/api';
import { root, getCurrentHost } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import SCAN_DE_CHANCE_IMAGE from '../images/scan_de_chance.png';
import styles from './styles.scss';

function buildLinks(context) {
  const { purchaseHistory, reviewUser } = context.config;

  return [{
    labelKey: 'coupon',
    to: `${root}/${routes.membershipCoupon}`,
    analyticsOn: 'Click',
    analyticsLabel: 'Couponlist',
    analyticsCategory: 'Member Info',
  }, {
    labelKey: 'wishlist',
    to: `${root}/${routes.wishlist}`,
    noRouter: true,
    analyticsOn: 'Click',
    analyticsLabel: 'Wishlist',
    analyticsCategory: 'Member Info',
  }, {
    labelKey: 'purchaseHistory',
    to: purchaseHistory.uq.replace('{%hostname}', getCurrentHost()),
    analyticsOn: 'Click',
    analyticsLabel: 'PurchaseHistory',
    analyticsCategory: 'Member Info',
  }, {
    labelKey: 'orderHistory',
    to: routes.orderHistory,
    analyticsOn: 'Click',
    analyticsLabel: 'Order List',
    analyticsCategory: 'Member Info',
  }, {
    labelKey: 'reviewUser',
    to: reviewUser.uq.replace('{%hostname}', getCurrentHost()),
    analyticsOn: 'Click',
    analyticsLabel: 'User Review',
    analyticsCategory: 'Member Info',
  }, {
    labelKey: 'giftCardInformation',
    window: { target: '_blank' },
    analyticsOn: 'Click',
    analyticsLabel: 'Gift Card info',
    analyticsCategory: 'Member Info',
  }];
}

const UniqloTab = ({ user }, context) => {
  const { membershipInfo } = context.i18n;
  const { UQ_GIFT_CARD_URL, account: { scanDeChanceBaseUrl } } = context.config;
  const linksGroup = buildLinks(context);
  const scanDeChanceUrl = scanDeChanceBaseUrl.replace('{%hostname}', getCurrentHost());

  return (
    <div className={styles.uniqloTabWrapper}>
      <div className={styles.uniqloTabContainer}>
        <Image
          className={styles.barcode}
          source={`${membersApi.base}/barcode.png?accessToken=${user && user.accessToken}&scale=3&height=9`}
        />
        <Text className={`blockText ${styles.instructions}`}>{membershipInfo.showBarcode}</Text>
        <Divider className={styles.topDivider} />
        {
          linksGroup.map((link, index) =>
            <Link
              {...link.window}
              caret
              className={styles.links}
              contentType="linkTab"
              key={index}
              label={membershipInfo[link.labelKey]}
              to={link.labelKey === 'giftCardInformation' ? UQ_GIFT_CARD_URL : link.to}
              noRouter={link.noRouter}
              analyticsOn={link.analyticsOn}
              analyticsLabel={link.analyticsLabel}
              analyticsCategory={link.analyticsCategory}
            />
          )
        }
    </div>
    <Link
      to={`${scanDeChanceUrl}?accessToken=${user && user.accessToken}`}
      analyticsOn="Click"
      analyticsLabel="SDC"
      analyticsCategory="Member Info"
    >
      <Image className={styles.scanDeChance} source={SCAN_DE_CHANCE_IMAGE} />
    </Link>
    <Text className={`blockText ${styles.bannerFooterText}`}>{membershipInfo.bannerFooterText}</Text>
  </div>
  );
};

const { object } = PropTypes;

UniqloTab.propTypes = {
  user: object,
};

UniqloTab.contextTypes = {
  i18n: object,
  config: object,
};

export default UniqloTab;
