import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { routes } from 'utils/urlPatterns';
import * as addressActions from 'redux/modules/account/address';
import * as userInfoActions from 'redux/modules/account/userInfo';
import noop from 'utils/noop';
import AddressPanel from 'components/AddressPanel';
import Panel from 'components/Panel';
import Button from 'components/uniqlo-ui/Button';
import CheckBox from 'components/uniqlo-ui/core/CheckBox';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import If from 'components/uniqlo-ui/If';
import TSLToolTip from 'components/TSLToolTip';
import MessageBox from 'components/MessageBox';
import AddressForm from 'containers/AddressForm';
import { redirect } from 'utils/routing';
import constants from 'config/site/default';
import { getUserInfoMapped } from 'redux/modules/account/mappings/addressMappings';
import ErrorHandler from 'containers/ErrorHandler';
import formValidator from 'components/FormValidator';
import ErrorMessage from 'components/ErrorMessage';
import { popAPIErrorMessage } from 'redux/modules/errorHandler';
import scrollToTop from 'utils/scroll';
import styles from './styles.scss';
import Completion from './Completion';
import NoAddressList from './NoAddressList';
import Confirmation from './Confirmation';
import AddressGrid from './AddressGrid';

const { object, array, func, bool, string } = PropTypes;
const { account: { processTypes }, FIRST_ADDRESS_BOOK_ENTRY, gyroTags } = constants;

function onBackToInfo() {
  redirect(routes.memberInfo);
}

const showConfirmationBox = (title, message, onConfirmAction, account, confirmLabel) => (
  <MessageBox
    confirmLabel={confirmLabel}
    message={message}
    onAction={onConfirmAction}
    rejectLabel={account.cancel}
    stickyBox
    title={title}
    variation="confirm"
    confirmProps={{
      analyticsOn: 'Click',
      analyticsLabel: 'Confirm',
      analyticsCategory: 'Member Info',
    }}
  />
);

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];
    const state = getState();

    if (!userInfoActions.isUserDefaultDetailsLoaded(state)) {
      promises.push(dispatch(userInfoActions.loadDefaultDetails()).catch(noop));
    }

    if (!userInfoActions.isAllUserInfoAddressesLoaded(state)) {
      promises.push(dispatch(userInfoActions.loadAllUserInfoAddresses(true)).catch(noop));
    }

    return Promise.all(promises);
  },
}])
@connect(
  state => ({
    user: state.auth.user,
    ...state.address,
    userInfoAddressList: state.userInfo.userInfoAddressList,
    defaultAddress: state.userInfo.userDefaultDetails,
    shouldSetBillingAddress: state.userInfo.shouldSetBillingAddress,
  }),
  { ...addressActions, ...userInfoActions, popAPIErrorMessage }
  )
@formValidator
@ErrorHandler([
  'addUserAddress',
])
export default class Address extends Component {

  static propTypes = {
    user: object,
    selectAddress: func,
    setNewAddress: func,
    address: object,
    params: object,
    defaultAddress: object,
    userInfoAddressList: array,
    editOtherAddress: func,
    addNewAddress: func,
    deleteUserAddress: func,
    setDefaultUserAddress: func,
    loadDefaultAddress: func,
    loadAddressBook: func,
    setAddressToStore: func,
    onSetBillingAddress: func,
    shouldSetBillingAddress: bool,
    editMemberAddress: func,
    regAddress: func,
    resetAddress: func,
    error: string,
    popAPIErrorMessage: func,
  };

  static contextTypes = {
    i18n: object,
    router: object,
    validateForm: func,
  };

  state = {
    isEditAddressFormModal: false,
    isNewAddressFormModal: false,
    isAddressFormView: false,
    isConfirmationVisible: false,
    actionType: '',
    addressNumber: 0,
    isCompleted: false,
    isAddConfirmed: false,
    isNewRegConfirmationVisible: false,
    isRegConfirmationVisible: false,
    newRegConfirmed: false,
    processType: '',
    disabledAccept: true,
    shouldSetDefaultAddress: false,
  };

  componentDidMount() {
    scrollToTop();
  }

  componentWillUnmount() {
    this.props.resetAddress();
  }

  ontoggleConfirmation = () => {
    this.setState({ isConfirmationVisible: !this.state.isConfirmationVisible });
  };

  onConfirmAction = (action) => {
    const props = this.props;
    const { actionType, addressNumber } = this.state;

    this.ontoggleConfirmation();

    if (action === 'yes') {
      if (actionType === 'select') {
        props.setDefaultUserAddress(addressNumber, true).then(() =>
          this.afterConfirm());
      } else if (actionType === 'remove') {
        props.deleteUserAddress(addressNumber, true);
      }
      this.setState({ isCompleted: true });
    }
  };

  onSelect = addressNumber => this.selectOrRemoveAddress('select', addressNumber);

  onRemove = addressNumber => this.selectOrRemoveAddress('remove', addressNumber);

  onActionCompleted = () => {
    this.setState({ isCompleted: false, newRegConfirmed: false, isAddressFormView: false, isNewAddressFormModal: false, isEditAddressFormModal: false });
  };

  selectOrRemoveAddress(type, addressNumber) {
    this.ontoggleConfirmation();
    this.setState({ actionType: type, addressNumber });
    this.props.popAPIErrorMessage('addUserAddress', true);
  }

  editAddress = (item, isDefault = false) => {
    this.props.setAddressToStore(item);

    if (isDefault) {
      this.props.setNewAddress('isDefaultAddress', isDefault);
    }

    this.setState({ isEditAddressFormModal: true, processType: processTypes.update });
  };

  addNewAddress = () => {
    this.props.resetAddress();
    this.setState({
      isNewAddressFormModal: true,
      isAddressFormView: true,
      actionType: 'add',
      processType: processTypes.create,
    });
  };

  regAddress = () => {
    if (this.context.validateForm() === true) {
      this.setState({ isRegConfirmationVisible: true, isEditAddressFormModal: false, isNewAddressFormModal: false, isNewRegConfirmationVisible: true });
    }
  };

  gotoAddressBook = () => {
    this.setState({
      isRegConfirmationVisible: false,
      isEditAddressFormModal: false,
      isAddressFormView: false,
    });
  }

  backToEntry = () => {
    this.setState({ isRegConfirmationVisible: false, isEditAddressFormModal: true });
  };

  backToNewAddressEntry = () => {
    this.setState({ isNewRegConfirmationVisible: false, isAddressFormView: true });
  };

  afterConfirm = () => {
    const props = this.props;

    props.setNewAddress('isDefaultAddress', false);
    props.loadDefaultDetails();

    if (this.state.shouldSetDefaultAddress === true) {
      props.setDefaultUserAddress(FIRST_ADDRESS_BOOK_ENTRY, true).then(() => props.loadAllUserInfoAddresses(true));
    } else {
      props.loadAllUserInfoAddresses(true);
    }

    props.popAPIErrorMessage('addUserAddress', true);

    this.setState({
      isCompleted: true,
      newRegConfirmed: true,
      isNewRegConfirmationVisible: false,
      isRegConfirmationVisible: false,
      shouldSetDefaultAddress: false,
    });
  };

  confirmAddress = () => {
    const props = this.props;
    let addressPromise;
    const shouldSetDefaultAddress = !props.userInfoAddressList.length && (!props.defaultAddress || !props.defaultAddress.firstName);

    if ((props.defaultAddress && !props.defaultAddress.firstName) && props.shouldSetBillingAddress) {
      addressPromise = props.editMemberAddress(props.address);
    } else if (this.state.processType === processTypes.create) {
      const newAddress = getUserInfoMapped(props.address);

      addressPromise = props.addNewAddress(newAddress);

      if (shouldSetDefaultAddress) {
        this.setState({ shouldSetDefaultAddress });
      }
    } else if (props.address.isDefaultAddress) {
      addressPromise = props.updateDefaultAddress(props.address);
    } else {
      addressPromise = props.editOtherAddress(props.address);
    }
    addressPromise.then(this.afterConfirm).catch((response) => {
      if (response && response.code === 'validation_failed' && response.errors[0].code === 'out_of_range') {
        return this.gotoAddressBook();
      }

      return shouldSetDefaultAddress ? this.backToNewAddressEntry() : this.backToEntry();
    });
  };

  render() {
    const { account, address, membership, checkout } = this.context.i18n;
    const {
      params,
      userInfoAddressList,
      defaultAddress,
      onSetBillingAddress,
      shouldSetBillingAddress,
      error,
    } = this.props;
    const state = this.state;
    const addressToPopulate = state.isEditAddressFormModal || state.isAddressFormView ? this.props.address : null;
    const checkBoxOption = !defaultAddress || !defaultAddress.firstName
      ? (<CheckBox
        checked={shouldSetBillingAddress}
        className={`spaCheckBox ${styles.check}`}
        id="billing"
        label={checkout.useMemberInfo}
        onCheck={onSetBillingAddress}
      />)
      : null;
    const AddressFormView = state.isNewAddressFormModal || state.isEditAddressFormModal
        ? (<div>
          <AddressForm
            {...addressToPopulate}
            additionalFields
            fromAddressBook
            gyroTagValue={gyroTags.ADDRESSBOOK}
            setNewAddress={this.props.setNewAddress}
          />
          {checkBoxOption}
          <Button
            className="secondary medium"
            label={account.toConfirmationScreen}
            labelClass={styles.buttonLabel}
            onTouchTap={this.regAddress}
          />
        </div>)
        : null;
    const defaultAddresspanel = defaultAddress && defaultAddress.firstName && defaultAddress.lastName
      ? (<Container>
        <AddressPanel {...defaultAddress} fromAccount isMembershipAddress />
        <AddressGrid
          account={account}
          editAddress={this.editAddress}
          isDefault
          item={defaultAddress}
          onRemove={this.onRemove}
          onSelect={this.onSelect}
        />
      </Container>)
      : null;

    const AddressGridView = !(state.isNewAddressFormModal || state.isEditAddressFormModal) && state.isRegConfirmationVisible
        ? (<Confirmation
          addressData={this.props.address}
          addressFields={address}
          backToEntry={this.backToEntry}
          confirmAddress={this.confirmAddress}
        />)
        : (<Container>
          {defaultAddresspanel}
          {
                userInfoAddressList
                ? userInfoAddressList.map(item =>
                  <Container key={item.id}>
                    <AddressPanel {...item} fromAccount />
                    <AddressGrid
                      account={account}
                      editAddress={this.editAddress}
                      item={item}
                      onRemove={this.onRemove}
                      onSelect={this.onSelect}
                    />
                  </Container>
                  )
                : null
              }
          <Button
            className="secondary medium"
            labelClass={styles.buttonLabel}
            label={account.newAddress}
            onTouchTap={this.addNewAddress}
            analyticsOn="Click"
            analyticsLabel="New address"
            analyticsCategory="Member Info"
          />
        </Container>);

    let headingText = account.addressList;

    headingText = state.isNewRegConfirmationVisible || state.isRegConfirmationVisible
       ? account.registrationDetails
       : headingText;

    let message = '';
    let description = account.addressCompletion;
    let confirm = '';

    if (!state.newRegConfirmed) {
      if (state.actionType === 'select') {
        message = account.selectMessage;
        description = account.selectCompletion;
        confirm = account.confirmSelect;
      } else if (state.actionType === 'remove') {
        message = account.removeMessage;
        description = account.removeCompletion;
        confirm = account.confirmRemove;
      }
    }

    const confirmationElement = state.isConfirmationVisible
          ? showConfirmationBox('', message, this.onConfirmAction, account, confirm)
          : null;
    let addressBookView = null;

    if (!userInfoAddressList.length && !state.isCompleted && (defaultAddress && !defaultAddress.firstName)) {
      const _this = this;

      addressBookView =
        (<NoAddressList
          {..._this.props}
          addressToPopulate={addressToPopulate}
          backToAddressList={_this.onActionCompleted}
          backToInfo={onBackToInfo}
          backToNewAddressEntry={_this.backToNewAddressEntry}
          confirmAddress={_this.confirmAddress}
          headingText={headingText}
          isAddressFormView={state.isAddressFormView}
          isNewAddressReg
          isNewRegConfirmationVisible={state.isNewRegConfirmationVisible}
          onAddNewAddress={_this.addNewAddress}
          regAddress={_this.regAddress}
          regNewAddress={_this.regNewAddress}
        />)
       ;
    } else if (!state.isCompleted && !state.isAddConfirmed && !state.newRegConfirmed) {
      const isFormView = state.isNewAddressFormModal || state.isEditAddressFormModal;
      let backButtonLabel = membership.backToMemberShip;
      let backTo = onBackToInfo;

      if (isFormView) {
        backButtonLabel = account.backToAddress;
        backTo = this.onActionCompleted;
      }

      addressBookView =
        (<Container className={styles.accountAddress}>
          <Container className={`z6 ${styles.addressListHead}`}>
            <Heading className={`mainHeaderHrule ${styles.addressListHeading}`} headingText={headingText} type="h2" />
            {
              isFormView
                ? <TSLToolTip />
              : null
            }
          </Container>
          <Panel frame>
            { isFormView
                ? AddressFormView
                : AddressGridView
              }
          </Panel>
          {
            state.isRegConfirmationVisible
            ? null
            : (
              <Button
                className="default medium boldWithBorder"
                labelClass={styles.buttonLabel}
                label={backButtonLabel}
                onTouchTap={backTo}
                analyticsOn="Click"
                analyticsLabel="Back to member info"
                analyticsCategory="Member Info"
              />
            )
          }
          {confirmationElement}
        </Container>)
      ;
    } else {
      const isHeaderLabel = state.newRegConfirmed && state.actionType !== 'remove';

      addressBookView =
        (<Container className={styles.completionWrapper}>
          {
            <Completion
              backToAddressList={this.onActionCompleted}
              description={description}
              params={params}
              isHeaderLabel={isHeaderLabel}
            />
          }
        </Container>)
      ;
    }

    return (
      <Container className={styles.addressBook}>
        <If
          if={error}
          then={ErrorMessage}
          scrollUpOnError
          message={error}
          rootClassName="deliveryPageError"
        />
        {addressBookView}
      </Container>
    );
  }
}
