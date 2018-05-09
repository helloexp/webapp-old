import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import Link from 'components/uniqlo-ui/Link';
import { redirectToChangePassword } from 'redux/modules/account/auth';
import { isLinkedAccount } from 'redux/modules/account/selectors';
import { routes } from 'utils/urlPatterns';
import If from 'components/uniqlo-ui/If';
import constants from 'config/site/default';
import styles from './styles.scss';

const { object, number, func, bool } = PropTypes;
const { opBaseUrl, withdrawal } = constants.account;
const withdrawalURL = `${opBaseUrl}${withdrawal}`;
const guLinksGroup = [{
  labelKey: 'editAddressBook',
  to: routes.addressBook,
  analyticsOn: 'Click',
  analyticsLabel: 'Update address',
  analyticsCategory: 'Member Info',
}, {
  labelKey: 'changePassword',
  to: redirectToChangePassword(),
  analyticsOn: 'Click',
  analyticsLabel: 'Update pass',
  analyticsCategory: 'Member Info',
}, {
  labelKey: 'changeCCInfo',
  to: routes.creditCard,
  analyticsOn: 'Click',
  analyticsLabel: 'Update credit card',
  analyticsCategory: 'Member Info',
}];
const uqLinksGroup = [{
  labelKey: 'changeMySize',
  to: routes.mySizeView,
  analyticsOn: 'Click',
  analyticsLabel: 'Update mysize',
  analyticsCategory: 'Member Info',
},
  ...guLinksGroup,
];

const linksGroup = {
  0: uqLinksGroup,
  1: guLinksGroup,
};

@connect(state => ({
  hasLinkedAccount: isLinkedAccount(state),
}))
export default class MembershipLinks extends PureComponent {

  static contextTypes = {
    i18n: object,
  };

  static propTypes = {
    hasLinkedAccount: bool,
    toggleRelease: func,
    activeTab: number,
    editAddress: func,
  };

  render() {
    const { membershipInfo } = this.context.i18n;
    const {
      activeTab,
      hasLinkedAccount,
      toggleRelease,
      editAddress,
    } = this.props;

    const groups = (
      linksGroup[activeTab].map((link, index) =>
        <Link
          caret
          className={styles.links}
          contentType="linkTab"
          key={index}
          label={membershipInfo[link.labelKey]}
          to={link.to}
          analyticsOn={link.analyticsOn}
          analyticsLabel={link.analyticsLabel}
          analyticsCategory={link.analyticsCategory}
        />
      )
    );

    return (
      <div>
        <Link
          caret
          className={styles.links}
          contentType="linkTab"
          label={membershipInfo.editMemberInfo}
          onClick={editAddress}
          noRouter
          analyticsOn="Click"
          analyticsLabel="Update member info"
          analyticsCategory="Member Info"
        />
        {groups}
        <If
          if={hasLinkedAccount}
          then={Link}
          caret
          className={styles.links}
          contentType="linkTab"
          label={membershipInfo.releaseConnection}
          onClick={toggleRelease}
          noRouter
          analyticsOn="Click"
          analyticsLabel="Cancel member connection"
          analyticsCategory="Member Info"
        />
        <Link
          caret
          className={styles.links}
          contentType="linkTab"
          label={membershipInfo.withdrawal}
          to={withdrawalURL}
          analyticsOn="Click"
          analyticsLabel="Withdraw"
          analyticsCategory="Member Info"
        />
      </div>
    );
  }
}
