import React, { PropTypes, Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { getUrlWithQueryData, redirect } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import { releaseAppConnection } from 'redux/modules/account/address';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import If from 'components/uniqlo-ui/If';
import MessageBox from 'components/MessageBox';
import Tabs, { Tab } from 'components/uniqlo-ui/Tabs';
import { getDefaultAddressForMember, getUser, getAccountActiveTab } from 'redux/modules/account/selectors';
import classNames from 'classnames';
import tabJpImage from 'images/logo-uq.svg';
import tabGuImage from 'images/logo-gu.svg';
import UniqloTab from '../UniqloTab';
import GUTab from '../GUTab';
import ReleaseConnectionDrawer from './ReleaseConnectionDrawer';
import ConfirmReleaseDrawer from './ConfirmReleaseDrawer';
import UnsubscribeDrawer from './UnsubscribeDrawer';
import MembershipLinks from './MembershipLinks';
import styles from './styles.scss';
import MemberPanel from '../MemberPanel';

const { object, func, number, string } = PropTypes;

@connect((state, props) => ({
  activeTab: getAccountActiveTab(state, props),
  defaultAddress: getDefaultAddressForMember(state),
  user: getUser(state),
}), {
  releaseAppConnection,
})
export default class MemberInfoView extends Component {
  static propTypes = {
    editAddress: func,
    activeTab: number,
    releaseAppConnection: func,
    defaultAddress: object,
    user: object,
    brand: string,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
    isConnectionReleased: false,
    isUnsubscribed: false,
    isReleaseConfirmed: false,
  };

  onTabChange = (index) => {
    redirect(getUrlWithQueryData(routes.memberInfo, { brand: index === 0 ? 'uq' : 'gu' }));
  };

  toggleRelease = () => {
    this.setState(prevState => ({
      isConnectionReleased: !prevState.isConnectionReleased,
    }));
  };

  toggleUnsubscribe = () => {
    this.setState(prevState => ({
      isUnsubscribed: !prevState.isUnsubscribed,
    }));
  };

  releaseConnection = () => {
    this.setState(prevState => ({
      isReleaseConfirmed: !prevState.isReleaseConfirmed,
      isConnectionReleased: !prevState.isConnectionReleased,
    }));
  };

  cancelRelease = () => {
    this.setState(prevState => ({
      isReleaseConfirmed: !prevState.isReleaseConfirmed,
    }));
  };

  acceptRelease = () => {
    this.props.releaseAppConnection().then(() => {
      this.setState(prevState => ({
        isReleaseConfirmed: !prevState.isReleaseConfirmed,
        isReleaseCompleted: !prevState.isReleaseCompleted,
      }));
    });
  };

  backToMember = () => {
    this.setState(prevState => ({
      isReleaseCompleted: !prevState.isReleaseCompleted,
    }));
  };

  render() {
    const {
      user,
      editAddress,
      defaultAddress,
      activeTab,
    } = this.props;

    const {
      membershipInfo: {
        memberInfo,
        backToMemberInfo,
        completeRelease,
        changeCustomerInfoTitleUq,
        changeCustomerInfoTitleGu,
      },
    } = this.context.i18n;

    const {
      isConnectionReleased,
      isUnsubscribed,
      isReleaseConfirmed,
      isReleaseCompleted,
    } = this.state;

    const headingClass = classNames('mainHeaderHrule', styles.infoHeader);
    const titleClass = classNames('mainHeader', styles.subtitle);
    const containerClass = classNames('z2', styles.linksContainer);
    const changeCustomerInfoTitle = activeTab === 0 ? changeCustomerInfoTitleUq : changeCustomerInfoTitleGu;

    return (
      <div className={styles.membershipInfo}>
        <Helmet title={memberInfo} />
        <Heading className={headingClass} headingText={memberInfo} type="h1" />
        <Container className={styles.infoTab}>
          <MemberPanel
            user={user}
            defaultAddress={defaultAddress}
            editAddress={editAddress}
          />
        </Container>
        <Container className={styles.tabInfoContainer}>
          <Tabs
            type="accountTab"
            onTabChange={this.onTabChange}
            defaultTabIndex={activeTab}
            className={styles.gridTabStyle}
          >
            <Tab
              defaultImage={tabJpImage}
              imageStyle={styles.tabJpImage}
              analyticsOn="Click"
              analyticsLabel="UQ"
              analyticsCategory="Member Info"
            >
              <UniqloTab user={user} />
            </Tab>
            <Tab
              defaultImage={tabGuImage}
              imageStyle={styles.tabGuImage}
              analyticsOn="Click"
              analyticsLabel="GU"
              analyticsCategory="Member Info"
            >
              <GUTab />
            </Tab>
          </Tabs>
        </Container>
        <Heading className={titleClass} headingText={changeCustomerInfoTitle} type="h2" />
        <Container className={containerClass}>
          <MembershipLinks activeTab={activeTab} toggleRelease={this.toggleRelease} editAddress={editAddress} />
        </Container>
        <If
          if={isConnectionReleased}
          then={ReleaseConnectionDrawer}
          acceptRelease={this.releaseConnection}
          cancelRelease={this.toggleRelease}
        />
        <If
          if={isReleaseConfirmed}
          then={ConfirmReleaseDrawer}
          acceptRelease={this.acceptRelease}
          cancelRelease={this.cancelRelease}
        />
        <If
          if={isReleaseCompleted}
          then={MessageBox}
          title={completeRelease}
          onClose={this.backToMember}
          onAction={this.backToMember}
          rejectLabel={backToMemberInfo}
          variation="releaseAlert"
        />
        <If
          if={isUnsubscribed}
          then={UnsubscribeDrawer}
          cancelRelease={this.toggleUnsubscribe}
        />
    </div>
    );
  }
}
