import React, { PropTypes } from 'react';
import Link from 'components/uniqlo-ui/Link';
import { getCurrentHost } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import styles from './styles.scss';

const { object } = PropTypes;

function buildLinks(context) {
  const { GUAPP_USER_URL, LIKE_LIST_URL, purchaseHistory, reviewUser } = context.config;

  return [{
    labelKey: 'likeList',
    to: LIKE_LIST_URL.replace('{%hostname}', getCurrentHost()),
    analyticsOn: 'Click',
    analyticsLabel: 'Wishlist',
    analyticsCategory: 'Member Info',
  }, {
    labelKey: 'purchaseHistory',
    to: purchaseHistory.gu.replace('{%hostname}', getCurrentHost()),
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
    to: reviewUser.gu.replace('{%hostname}', getCurrentHost()),
    analyticsOn: 'Click',
    analyticsLabel: 'User Review',
    analyticsCategory: 'Member Info',
  }, {
    labelKey: 'guAppUsers',
    to: GUAPP_USER_URL,
    analyticsOn: 'Click',
    analyticsLabel: 'APP info',
    analyticsCategory: 'Member Info',
  }];
}

const GUTab = (props, context) => {
  const { membershipInfo } = context.i18n;

  return (
    <div className={styles.guTabContainer}>
      {
        buildLinks(context).map((link, index) =>
          <Link
            caret
            className={styles.links}
            key={index}
            label={membershipInfo[link.labelKey]}
            to={link.to}
            analyticsOn={link.analyticsOn}
            analyticsLabel={link.analyticsLabel}
            analyticsCategory={link.analyticsCategory}
          />
        )
      }
    </div>
  );
};

GUTab.contextTypes = {
  i18n: object,
  config: object,
};

export default GUTab;
