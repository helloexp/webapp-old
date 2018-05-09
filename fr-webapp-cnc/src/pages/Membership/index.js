import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import classNames from 'classnames';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Heading from 'components/uniqlo-ui/Heading';
import Tabs, { Tab } from 'components/uniqlo-ui/Tabs';
import If from 'components/uniqlo-ui/If';
import * as couponActions from 'redux/modules/membership/coupons';
import Drawer from 'components/Drawer';
import { redirect } from 'utils/routing';
import sharedStyles from 'theme/shared.scss';
import StoreCoupons from './StoreCoupons';
import styles from './styles.scss';
import CouponList from './CouponList';
import CouponDetails from './CouponDetails';

const { object, array, func } = PropTypes;

function onBackToMembership() {
  redirect('account');
}

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];
    const state = getState();
    const { isStoreCouponsLoaded, isOnlineCouponsLoaded } = couponActions;

    if (!isStoreCouponsLoaded(state) || !isOnlineCouponsLoaded(state)) {
      promises.push(dispatch(couponActions.load()));
    }

    return Promise.all(promises);
  },
}])
@connect(
  state => ({
    ...state.coupons,
  }),
  {
    ...couponActions,
  })
export default class Membership extends Component {

  static propTypes = {
    myCoupons: array,
    couponDetails: object,
    list: array,
    load: func,
    storeCouponList: array,
    deselectAllStoreCoupons: func,
    getDetails: func,
    params: object,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
    activeTab: 0,
    couponListCount: 5,
    isCouponsSelected: false,
    showCouponDetails: false,
    isConfirmationPopupVisible: false,
  };

  onTabChange = (index) => {
    this.setState({
      activeTab: index,
    });
  };

  openCouponDetailsModal = (couponCode) => {
    this.props.getDetails(couponCode);
    this.setState({
      showCouponDetails: true,
    });
  };

  closeModals = () => {
    this.setState({
      showCouponDetails: false,
      isConfirmationPopupVisible: false,
    });
  };

  viewMoreCoupons = () => {
    if (this.state.couponListCount < this.props.list.length) {
      this.setState({
        couponListCount: this.state.couponListCount + 5,
      });
    }
  };

  render() {
    const { membership, coupons } = this.context.i18n;
    const {
      storeCouponList,
      list,
      couponDetails,
    } = this.props;

    const onlineCoupons = list.length
      ? (<CouponList
        className={styles.coupons}
        count={this.state.couponListCount}
        items={list}
        noEdit
        onViewMore={this.viewMoreCoupons}
        showDetails={this.openCouponDetailsModal}
      />)
      : (<Text className={classNames('blockText', styles.noCouponMessage)}>
        {membership.noCouponMessage}
      </Text>);

    if (this.state.showCouponDetails) {
      return (
        <Drawer
          onCancel={this.closeModals}
          title={coupons.couponDetails}
          variation="noFooter"
        >
          <CouponDetails coupon={couponDetails} />
        </Drawer>
      );
    }

    return (
      <div className={styles.membershipContainer}>
        <div className={styles.headingContainer}>
          <Heading
            className={styles.pageHeading}
            headingText={membership.membershipHeading}
            type="h2"
          />
        </div>
        <div className={sharedStyles.backgroundWhite}>
          <Tabs type="bordered" onTabChange={this.onTabChange} defaultTabIndex={this.state.activeTab}>
            <Tab text={membership.store} type="text" >
              <If
                if={storeCouponList.length}
                then={StoreCoupons}
                showDetails={this.openCouponDetailsModal}
                else={Text}
                className={classNames('blockText', styles.noCouponMessage)}
                content={membership.noCouponMessage}
              />
            </Tab>
            <Tab text={membership.onlineStore} type="text" >
              <div className={styles.tabContainer}>
                {onlineCoupons}
              </div>
            </Tab>
          </Tabs>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            className={classNames('default', 'medium', 'boldWithBorder', styles.backToMemberShipBtn)}
            label={membership.backToMemberShip}
            onTouchTap={onBackToMembership}
          />
        </div>
      </div>
    );
  }
 }
