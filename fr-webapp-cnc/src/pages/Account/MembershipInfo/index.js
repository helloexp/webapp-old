import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import noop from 'utils/noop';
import getSiteConfig from 'config/site';
import { redirect, getCurrentHost } from 'utils/routing';
import { isLinkageStatusLoaded } from 'redux/modules/account/selectors';
import { isUserDefaultDetailsLoaded, loadDefaultDetails } from 'redux/modules/account/userInfo';
import { getAccountLinkageStatus, resetAddress } from 'redux/modules/account/address';
import MemberInfoView from './components/MemberInfoView';

const { object, func } = PropTypes;

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];
    const state = getState();

    if (!isUserDefaultDetailsLoaded(state)) {
      promises.push(dispatch(loadDefaultDetails()).catch(noop));
    }

    if (!isLinkageStatusLoaded(state)) {
      promises.push(dispatch(getAccountLinkageStatus()));
    }

    return Promise.all(promises);
  },
}])
@connect(null, { resetAddress })
export default class MembershipInfo extends Component {

  static propTypes = {
    resetAddress: func,
  };

  static contextTypes = {
    i18n: object,
    router: object,
    validateForm: func,
  };

  editAddress = () => {
    const { LINK_TO_EDIT_MEMBER } = getSiteConfig();

    // both UQ and GU point to UQ site for member information edit.
    redirect(LINK_TO_EDIT_MEMBER.replace('{%hostname}', getCurrentHost()));
  }

  backToMember = () => {
    this.props.resetAddress();
  }

  render() {
    const {
      backToMember,
      editAddress,
    } = this;

    return <MemberInfoView backToMember={backToMember} editAddress={editAddress} />;
  }
}
