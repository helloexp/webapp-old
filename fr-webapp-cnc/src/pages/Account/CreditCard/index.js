import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Button from 'components/uniqlo-ui/Button';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import ErrorHandler from 'containers/ErrorHandler';
import ErrorMessage from 'components/ErrorMessage';
import noop from 'utils/noop';
import { prependRoot } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import If from 'components/uniqlo-ui/If';
import * as paymentActions from 'redux/modules/checkout/payment/actions';
import * as creditCardActions from 'redux/modules/checkout/payment/creditCard/actions';
import { loadDefaultDetails, isUserDefaultDetailsLoaded } from 'redux/modules/account/userInfo';
import { updateDefaultAddress } from 'redux/modules/account/address';
import { fakeBlueGateError } from 'redux/modules/errorHandler';
import Helmet from 'react-helmet';
import MessageBox from 'components/MessageBox';
import cx from 'classnames';
import FormDrawer from './FormDrawer';
import SavedCreditCard from './SavedCreditCard';
import RegistrationConfirm from './RegistrationConfirm';
import RemoveCompletion from './RemoveCompleted';
import styles from './styles.scss';

const { object, func, string } = PropTypes;
const Views = {
  DEFAULT_PAGE: 1,
  EDIT_CARD: 2,
  SAVE_CONFIRM: 3,
  COMPLETED: 4,
  REMOVE_COMPLETED: 5,
};

const headingClassName = cx('mainHeaderHrule', styles.creditHeading);

function getBackButton(creditCard, memberLink) {
  return (
    <Button
      noLabelStyles
      className={`default medium ${styles.backButton}`}
      label={creditCard.backToMember}
      link={memberLink}
    />
  );
}

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const state = getState();
    const promises = [];
    const resultCode = state.routing.locationBeforeTransitions.query.resultCode;

    if (resultCode) {
      dispatch(fakeBlueGateError(resultCode));
    }
    promises.push(dispatch(paymentActions.getCreditCardInfo()).catch(noop));

    if (!isUserDefaultDetailsLoaded(state)) {
      promises.push(dispatch(loadDefaultDetails()));
    }

    return Promise.all(promises);
  },
}])
@connect(
  state => ({
    creditInfo: state.payment.creditInfo,
    requiredDefaultAddressField: state.userInfo.userDefaultDetails && state.userInfo.userDefaultDetails.phoneNumber,
    billingAddress: state.payment.billingAddress,
    creditCardInfo: state.payment.creditCardInfo,
    userDefaultDetails: state.userInfo.userDefaultDetails,
  }),
  {
    setBillingAddress: paymentActions.setBillingAddress,
    setCreditCard: paymentActions.setCreditCard,
    saveNewCardOnBluegate: creditCardActions.saveNewCardOnBluegate,
    resetCreditCard: paymentActions.resetCreditCard,
    updateDefaultAddress,
    resetBillingAddress: paymentActions.resetBillingAddress,
    deleteCreditCard: creditCardActions.deleteCreditCard,
  })
@ErrorHandler(['blueGateCreditCardError', 'prepareCreditCard', 'placeOrder'])
export default class CreditCard extends Component {

  static propTypes = {
    billingAddress: object,
    // New credit card in form
    creditCardInfo: object,
    // Current saved credit card
    creditInfo: object,
    deleteCreditCard: func,
    resetCreditCard: func,
    resetBillingAddress: func,
    saveNewCardOnBluegate: func,
    setCreditCard: func,
    updateDefaultAddress: func,
    errorMessages: object,
    error: string,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
    currentView: Views.DEFAULT_PAGE,
    showRemoveConfirm: false,
  };

  onEditCreditCard = () => {
    const { creditInfo, setCreditCard } = this.props;
    const month = parseInt(creditInfo.expiry.substring(0, 2), 10);

    // Set the existing credit card info in editing state
    setCreditCard('name', creditInfo.cardHolder);
    setCreditCard('expYear', `20${creditInfo.expiry.substring(2)}`);
    setCreditCard('expMonth', `${month}`);

    this.setCurrentView(Views.EDIT_CARD);
  };

  onCancelRegistration = () => {
    this.props.resetCreditCard();
    this.props.resetBillingAddress();
    this.setCurrentView(Views.DEFAULT_PAGE);
  };

  setCurrentView = (view) => {
    this.setState({ currentView: view });
  };

  removeCreditCard = (action) => {
    if (action === 'yes') {
      const { creditInfo, deleteCreditCard } = this.props;

      deleteCreditCard(creditInfo)
        .then(() => this.setState({ currentView: Views.REMOVE_COMPLETED }));
    }

    this.setState({ showRemoveConfirm: false });
  };

  resetDefaultView = () => this.setState({ currentView: Views.DEFAULT_PAGE })

  saveRegistrationDetails = () => {
    const props = this.props;

    if (!props.requiredDefaultAddressField) {
      // Save billing address first, then send to bluegate
      props.updateDefaultAddress(props.billingAddress)
        .then(() => props.saveNewCardOnBluegate(props.creditCardInfo))
        .catch(() => this.setCurrentView(Views.EDIT_CARD));
    } else {
      props.saveNewCardOnBluegate(props.creditCardInfo);
    }
  };

  renderDefaultView() {
    if (this.state.currentView === Views.DEFAULT_PAGE) {
      return (
        <SavedCreditCard
          {...this.props}
          onAdd={() => this.setCurrentView(Views.EDIT_CARD)}
          onEdit={this.onEditCreditCard}
          onRemove={() => this.setState({ showRemoveConfirm: true })}
        />
      );
    }

    return null;
  }

  renderRegisterForm() {
    const { currentView } = this.state;

    if (currentView === Views.EDIT_CARD) {
      return (
        <FormDrawer
          {...this.props}
          onAccept={() => this.setCurrentView(Views.SAVE_CONFIRM)}
          onCancel={this.onCancelRegistration}
        />
      );
    }

    return null;
  }

  renderRegistrationConfirmation() {
    if (this.state.currentView === Views.SAVE_CONFIRM) {
      return (
        <RegistrationConfirm
          {...this.props}
          onCancel={() => this.setCurrentView(Views.EDIT_CARD)}
          onConfirm={this.saveRegistrationDetails}
        />
      );
    }

    return null;
  }

  renderRemoveOption() {
    const { creditCard } = this.context.i18n;

    if (this.state.showRemoveConfirm) {
      return (
        <MessageBox
          confirmLabel={creditCard.removeCard}
          message={creditCard.removeCardMessage}
          onAction={this.removeCreditCard}
          rejectLabel={creditCard.removeCardCancel}
          stickyBox
          variation="confirm"
          widthNav
          analyticsOn="Click"
          analyticsLabel="Delete"
          analyticsCategory="Member Info"
        />
      );
    }

    return null;
  }

  render() {
    const { creditCard } = this.context.i18n;
    const { currentView } = this.state;
    const { error } = this.props;

    if (currentView === Views.REMOVE_COMPLETED) {
      return <RemoveCompletion onBackClick={this.resetDefaultView} />;
    }

    const memberLink = prependRoot(routes.memberInfo);
    const backButton = currentView === Views.DEFAULT_PAGE ? getBackButton(creditCard, memberLink) : null;

    return (
      <div className={styles.creditCardContainer}>
        <Helmet title={creditCard.heading} />
          <If
            if={error}
            then={ErrorMessage}
            message={error}
            rootClassName="cartPageError"
          />
        <Heading className={headingClassName} headingText={creditCard.heading} type="h2" />
        <Container className={`z2 ${styles.content}`}>
          {this.renderRegistrationConfirmation()}
          {this.renderDefaultView()}
        </Container>
        {backButton}
        {this.renderRegisterForm()}
        {this.renderRemoveOption()}
      </div>
    );
  }
}
