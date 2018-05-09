import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { trackEvent } from 'utils/gtm';
import MessageBox from 'components/MessageBox';
import { confirmLogout, cancelLogout } from 'redux/modules/account/auth';

const { bool, func } = PropTypes;

@connect(state => ({
  showLogoutConfirm: state.auth.showLogoutConfirm,
}), { confirmLogout, cancelLogout })
export default class LogoutConfirm extends PureComponent {
  static propTypes = {
    showLogoutConfirm: bool,

    cancelLogout: func,
    confirmLogout: func,
  };

  static contextTypes = {
    i18n: PropTypes.object,
  };

  onConfirm = (btn) => {
    if (btn === 'yes') {
      trackEvent({
        action: 'Button Click',
        label: 'H_logout',
        category: 'Common Header',
      });
      this.props.confirmLogout();
    } else {
      this.props.cancelLogout();
    }
  };

  render() {
    const { showLogoutConfirm } = this.props;

    if (!showLogoutConfirm) {
      return null;
    }

    const { i18n: { account, cart } } = this.context;

    return (
      <MessageBox
        confirmLabel={cart.logOut}
        message={account.logoutConfirm}
        onAction={this.onConfirm}
        rejectLabel={account.cancel}
        stickyBox
        variation="confirm"
      />
    );
  }
}
