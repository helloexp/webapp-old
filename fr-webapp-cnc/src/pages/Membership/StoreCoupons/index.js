import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { redirect } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import { selectStoreCouponToggle, deselectAllStoreCoupons, useSelectedStoreCoupons, saveSelectedStoreCoupons } from 'redux/modules/membership/coupons';
import { isStoreCouponSelected } from 'redux/modules/membership/selectors';
import If from 'components/uniqlo-ui/If';
import MessageBox from 'components/MessageBox';
import CouponList from 'pages/Membership/CouponList';

const { object, func, array, bool } = PropTypes;

@connect(state => (
  {
    storeCouponList: state.coupons.storeCouponList,
    isCouponsSelected: isStoreCouponSelected(state),
  }
),
  {
    toggleSelect: selectStoreCouponToggle,
    onCancel: deselectAllStoreCoupons,
    onUse: useSelectedStoreCoupons,
    saveCouponIds: saveSelectedStoreCoupons,
  })
export default class StoreCoupons extends Component {
  static propTypes = {
    toggleSelect: func,
    storeCouponList: array,
    isCouponsSelected: bool,
    onCancel: func,
    showDetails: func,
    onUse: func,
    saveCouponIds: func,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
    couponListCount: 5,
  };

  componentWillUnmount() {
    this.props.onCancel();
  }

  onFooterAction = (action) => {
    const { onUse, onCancel, saveCouponIds } = this.props;

    if (action === 'yes') {
      onUse();
      saveCouponIds();
      redirect(routes.barCode);
    } else {
      onCancel();
    }
  }

  viewMoreCoupons = () => {
    if (this.state.couponListCount < this.props.storeCouponList.length) {
      this.setState({
        couponListCount: this.state.couponListCount + 5,
      });
    }
  };

  render() {
    const { membership } = this.context.i18n;
    const {
      toggleSelect,
      storeCouponList,
      showDetails,
    } = this.props;

    return (
      <div>
        <CouponList
          count={this.state.couponListCount}
          items={storeCouponList}
          onAdd={toggleSelect}
          onRemove={toggleSelect}
          onViewMore={this.viewMoreCoupons}
          showDetails={showDetails}
        />
        <If
          if={this.props.isCouponsSelected}
          confirmLabel={membership.use}
          message={membership.useCouponMessage}
          onAction={this.onFooterAction}
          rejectLabel={membership.cancel}
          stickyBox
          variation="noOverlayConfirm"
          then={MessageBox}
        />
      </div>
    );
  }
}
