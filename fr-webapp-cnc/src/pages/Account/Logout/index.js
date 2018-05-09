import React, { PropTypes } from 'react';
import { asyncConnect } from 'redux-connect';
import Helmet from 'react-helmet';
import Loading from 'components/LoadingIndicator';
import { redirectAfterLogout } from 'redux/modules/account/auth';

function Logout(props, context) {
  const { account } = context.i18n;

  return (
    <div className="accountLogout">
      <Helmet title={account.logout} />
      <Loading type="fullscreen" show />
    </div>
  );
}

const { object } = PropTypes;

Logout.contextTypes = {
  i18n: object,
};

export default asyncConnect([{
  promise: ({ store: { dispatch } }) => (
    dispatch(redirectAfterLogout())
  ),
}])(Logout);
