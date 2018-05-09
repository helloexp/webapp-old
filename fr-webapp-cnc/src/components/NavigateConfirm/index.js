import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import MessageBox from 'components/MessageBox';
import * as appActions from 'redux/modules/app';

const { bool, string, func, object } = PropTypes;

@connect(state => ({
  showNavigateConfirm: state.app.promptNavigation,
  ...state.app.navigationAlertProps,
}), {
  confirmNavigate: appActions.confirmNavigate,
  cancelNavigate: appActions.cancelNavigate,
})
export default class NavigateConfirm extends PureComponent {
  static propTypes = {
    showNavigateConfirm: bool,
    // from state.app.navigationAlertTexts
    cancelBtnLabel: string,
    confirmBtnLabel: string,
    warningMessage: string,

    cancelNavigate: func,
    confirmNavigate: func,
    analyticsProps: object,
  };

  static contextTypes = {
    i18n: PropTypes.object,
  };

  onConfirm = (btn) => {
    if (btn === 'yes') {
      this.props.confirmNavigate();
    } else {
      this.props.cancelNavigate();
    }
  };

  render() {
    const { showNavigateConfirm, confirmBtnLabel, cancelBtnLabel, warningMessage, analyticsProps } = this.props;
    let confirmProps = {};

    if (!showNavigateConfirm) {
      return null;
    }

    if (analyticsProps) {
      confirmProps = { confirmProps: analyticsProps };
    }

    const { i18n: { common } } = this.context;

    return (
      <MessageBox
        confirmLabel={confirmBtnLabel || common.navigateConfirm}
        message={warningMessage || common.navigateAway}
        onAction={this.onConfirm}
        rejectLabel={cancelBtnLabel || common.navigateCancel}
        stickyBox
        variation="confirm"
        {...confirmProps}
      />
    );
  }
}
