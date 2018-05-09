import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Helmet from 'react-helmet';
import classNames from 'classnames';
import { trackCheckoutNavigation } from 'utils/gtm';
import {
  isReturnedUser as isReturnedUserSelector,
  isEditingAddressOptions as isEditingAddressOptionsSelector,
  isDeliveryTypeSelected as isDeliveryTypeSelectedSelector,
  isDeliveryTypeCvs as isDeliveryTypeCvsSelector,
  shouldShowNextDayMessage as shouldShowNextDayMessageSelector,
  isPreviousLocationOrderReview as isPreviousLocationOrderReviewSelector,
} from 'redux/modules/checkout/delivery/selectors';
import { isCreditCardUnsaved as isCreditCardUnsavedSelector } from 'redux/modules/checkout/payment/selectors';
import { getBrand } from 'redux/modules/cart/selectors';
import * as deliveryActions from 'redux/modules/checkout/delivery';
import ErrorHandler from 'containers/ErrorHandler';
import Button from 'components/Atoms/Button';
import Heading from 'components/uniqlo-ui/Heading';
import Text from 'components/uniqlo-ui/Text';
import If from 'components/uniqlo-ui/If';
import MessageBox from 'components/MessageBox';
import { popAPIErrorMessage } from 'redux/modules/errorHandler';
import ErrorMessage from 'components/ErrorMessage';
import { scrollElmIntoView } from 'utils/scroll';
import constants from 'config/site/default';
import Link from 'components/uniqlo-ui/Link';
import DateTimeSelector from './components/DateTimeSelector';
import DeliveryMethods from './DeliveryMethods';
import GiftingDeliveryOptions from './GiftingDeliveryOptions';
import styles from './styles.scss';
import DeliveryModal from './DeliveryModal';

const { string, object, func, bool } = PropTypes;
const { SEJ } = constants.deliveryTypes;

@asyncConnect([{ promise: deliveryActions.initializeDeliveryPage }])
@connect(
  (state, props) => ({
    showCvsNavigationModal: state.delivery.showCvsNavigationModal,
    isReturnUser: isReturnedUserSelector(state),
    isEditingAddressOptions: isEditingAddressOptionsSelector(state),
    isDeliveryTypeSelected: isDeliveryTypeSelectedSelector(state),
    isDeliveryTypeCvs: isDeliveryTypeCvsSelector(state),
    isCreditCardUnsaved: isCreditCardUnsavedSelector(state, props),
    shouldShowNextDayMessage: shouldShowNextDayMessageSelector(state),
    isPreviousLocationOrderReview: isPreviousLocationOrderReviewSelector(state),
    scrollToView: state.delivery.scrollToView,
    brand: getBrand(state, props),
  }),
  {
    toggleDeliveryEdit: deliveryActions.toggleDeliveryEdit,
    editDeliveryMethod: deliveryActions.editDeliveryMethod,
    getPreviousLocation: deliveryActions.getPreviousLocation,
    setDeliveryMethodOption: deliveryActions.setDeliveryMethodOption,
    setSelectedDeliveryType: deliveryActions.setSelectedDeliveryType,
    toggleCvsNavigationModal: deliveryActions.toggleCvsNavigationModal,
    popAPIErrorMessage,
  })
@ErrorHandler([
  'blueGateCreditCardError',
  'cvsNotFound',
  'placeOrder',
  'provisionalInventory',
  'saveGiftMessage',
  'saveShippingAddress',
  'setBillingAddress',
  'setDeliveryType',
  'setPaymentMethod',
  'addUserAddress',
  'uqAccPfError',
  'loadSplitDetails',
])
export default class Delivery extends PureComponent {

  static propTypes = {
    // From selectors
    isDeliveryTypeSelected: bool,
    isEditingAddressOptions: bool,
    isReturnUser: bool,
    isDeliveryTypeCvs: bool,
    isCreditCardUnsaved: bool,
    shouldShowNextDayMessage: bool,
    isPreviousLocationOrderReview: bool,

    // From state
    showCvsNavigationModal: bool,
    error: string,

    // Actions
    toggleDeliveryEdit: func,
    editDeliveryMethod: func,
    getPreviousLocation: func,
    popAPIErrorMessage: func,
    setDeliveryMethodOption: func,
    setSelectedDeliveryType: func,
    toggleCvsNavigationModal: func,

    brand: string,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  state = {
    isDateTimeModalVisible: false,
    isNextDateModalVisible: false,
    isApplyButtonVisible: false,
    removeId: 0,
    shouldShowHeader: true,
    showModal: false,
    isDrawerVisible: false,
  };

  componentWillMount() {
    const {
      getPreviousLocation,
      isPreviousLocationOrderReview,
    } = this.props;

    getPreviousLocation();

    if (isPreviousLocationOrderReview) {
      this.setState({ isApplyButtonVisible: true });
    }
  }

  componentDidMount() {
    this.scrollToPos = 0;
    const { brand } = this.props;

    trackCheckoutNavigation(brand);
    this.props.popAPIErrorMessage('addUserAddress', true);
    scrollElmIntoView(this.deliveryHead);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPreviousLocationOrderReview !== this.props.isPreviousLocationOrderReview) {
      this.setState({ isApplyButtonVisible: nextProps.isPreviousLocationOrderReview });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.isDateTimeModalVisible === true && this.state.isDateTimeModalVisible === false ||
      prevState.isNextDateModalVisible === true && this.state.isNextDateModalVisible === false
    ) {
      window.scrollTo(0, this.scrollToPos);
    }
  }

  onToggleDateTimeModal = (splitNo) => {
    this.setState(prevState => ({ isDateTimeModalVisible: !prevState.isDateTimeModalVisible, splitNo }));
  };

  onToggleNextDateModal = (splitNo) => {
    this.setState(prevState => ({ isNextDateModalVisible: !prevState.isNextDateModalVisible, splitNo }));
  }

  getRef = (node) => { this.deliveryHead = node; };

  closeModal = (scrollPos) => {
    this.scrollToPos = scrollPos;
    this.setState({
      isDateTimeModalVisible: false,
      isNextDateModalVisible: false,
      splitNo: null,
    });
  };

  toggleHeaderDisplay = (shouldShow) => {
    this.setState({
      shouldShowHeader: shouldShow,
    });
  };

  toggleModal = () => {
    this.setState(prevState => ({ showModal: !prevState.showModal }));
  };

  confirmCvsNavigation = (choice) => {
    const { toggleCvsNavigationModal, setSelectedDeliveryType, setDeliveryMethodOption } = this.props;

    toggleCvsNavigationModal();
    if (choice === 'yes') {
      setSelectedDeliveryType(SEJ);
      setDeliveryMethodOption(SEJ);
    }
  }

  render() {
    const { i18n: { checkout, common, heading, reviewOrder }, config: { deliveryMethodDetailsLink } } = this.context;
    const {
      editDeliveryMethod,
      error,
      isCreditCardUnsaved,
      isDeliveryTypeSelected,
      isEditingAddressOptions,
      isReturnUser,
      shouldShowNextDayMessage,
      showCvsNavigationModal,
    } = this.props;
    const {
      isDateTimeModalVisible,
      isNextDateModalVisible,
      isApplyButtonVisible,
      shouldShowHeader,
      showModal,
      splitNo,
    } = this.state;

    const mainClasses = classNames(styles.deliveryGifting, {
      [styles.hideHeader]: !shouldShowHeader,
    });

    if (!(isDateTimeModalVisible || isNextDateModalVisible)) {
      return (
        <div>
          <div className={mainClasses}>
            <Helmet title={checkout.deliveryMethod} />
            <If
              if={error}
              then={ErrorMessage}
              scrollUpOnError
              message={error}
              rootClassName="deliveryPageError"
            />
            <span ref={this.getRef} />
            <div className={styles.mainContainer}>
              <div className={styles.headWrap}>
                <Heading
                  className={styles.deliveryMethod}
                  headingText={heading.deliveryMethod}
                  type="h3"
                />
                <If
                  if={isEditingAddressOptions}
                  type={Button.type.edit}
                  onClick={editDeliveryMethod}
                  then={Button}
                >{common.edit}</If>
              </div>
              <If
                if={shouldShowNextDayMessage}
                then={Text}
                content={checkout.nextDayMessage}
                className={`blockText ${styles.shippingDescription}`}
              />
              <If if={shouldShowNextDayMessage}>
                <div className={styles.linkTextWrapper}>
                  <Link
                    to={deliveryMethodDetailsLink}
                    label={checkout.deliveryMethodDetails}
                    className={`blockText ${styles.linkText}`}
                    target="_blank"
                  />
                </div>
              </If>
              <DeliveryMethods
                isDeliveryTypeSelected={isDeliveryTypeSelected}
                isRegisteredUser={isReturnUser}
                saveEditedAddress={this.saveEditedAddress}
                isRemoveCvs={this.state.isRemoveCvs}
                removeCvsAddress={this.removeCvsAddress}
                toggleHeaderDisplay={this.toggleHeaderDisplay}
              />
              <If
                if={isEditingAddressOptions}
                isApplyButtonVisible={isApplyButtonVisible}
                onToggleDateTimeModal={this.onToggleDateTimeModal}
                onToggleNextDateModal={this.onToggleNextDateModal}
                then={GiftingDeliveryOptions}
                toggleModal={this.toggleModal}
              />
              <Heading
                className={classNames(styles.deliveryTitle)}
                headingText={heading.paymentMethod}
                type="h3"
              />
            </div>
          </div>
          <If
            if={showCvsNavigationModal && isCreditCardUnsaved}
            then={MessageBox}
            confirmLabel={common.continueText}
            message={reviewOrder.editWithCreditCard}
            onAction={this.confirmCvsNavigation}
            rejectLabel={common.cancelText}
            stickyBox
            variation="confirm"
          />
          <DeliveryModal isDrawerVisible={showModal} toggleModal={this.toggleModal} />
        </div>
      );
    }

    return (
      <DateTimeSelector onCancel={this.closeModal} nextDateOptionSelected={isNextDateModalVisible} splitNo={splitNo} />
    );
  }
}
