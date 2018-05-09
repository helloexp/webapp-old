import React, { PropTypes } from 'react';
import noop from 'utils/noop';
import Panel from 'components/Panel';
import { formatPostalCode, replaceDelimitedCommasAndSpaces } from 'utils/format';
import classNames from 'classnames';
import styles from './styles.scss';

const AddressPanel = (props, context) => {
  const {
    title,
    firstName,
    lastName,
    firstNameKatakana,
    lastNameKatakana,
    salutation,
    street,
    city,
    prefecture,
    postalCode,
    address,
    apt,
    email,
    phoneNumber,
    cellPhoneNumber,
    frame,
    className,
    editable,
    onEdit,
    fromAccount,
    fromCheckout,
    noExtraSpacing,
    fromOrderDetails,
    fromCardRegistration,
    addressContainerStyle,
    isMembershipAddress,
    variation,
    receiverCorporateName,
    receiverDeptName,
    confirm,
    plannedDates,
    lighterBoxShadow,
  } = props;

  let addressText;
  const name = `${lastName} ${firstName}`;
  const { common, account, checkout, address: { defaultCity, defaultStreet } } = context.i18n;
  const cityField = city || '';
  const salutationText = salutation || common.salutation;
  const nameText = isMembershipAddress && `${name} ${salutationText} (${account.membershipAddress})` || `${name} ${salutationText}`;
  const formattedPostalCode = postalCode ? formatPostalCode(postalCode) : null;
  const katakanaInfo = fromCardRegistration && `${lastNameKatakana} ${firstNameKatakana}` || null;
  const isIncompleteAddress = cityField === defaultCity && street === defaultStreet;
  const addressField = replaceDelimitedCommasAndSpaces(
    isIncompleteAddress ? `${prefecture} (${cityField}) (${street})` : `${prefecture} ${cityField} ${street}`
  );

  if (fromAccount) {
    addressText = [
      `${nameText}`,
      `${account.postalPrefix} ${formattedPostalCode}`,
      `${prefecture} ${city}`,
      `${street} ${apt}`,
      phoneNumber,
      cellPhoneNumber,
    ];
  } else if (fromCheckout || fromCardRegistration || fromOrderDetails || noExtraSpacing) {
    if (variation === 'uqStoreAddress') {
      addressText = fromOrderDetails
        ? [
          `${receiverCorporateName} ${receiverDeptName}`,
          `${account.postalPrefix}${formattedPostalCode}${prefecture}${cityField}`,
          `${street} ${apt}`,
        ]
        : [
          `${receiverCorporateName} ${receiverDeptName}`,
          `${prefecture}${cityField}${street}`,
          apt,
        ];
    } else if (variation === 'cvsAddress') {
      addressText = fromOrderDetails
        ? [
          `${receiverCorporateName} ${receiverDeptName}`,
          `${street} ${apt}`,
          `${account.postalPrefix}${formattedPostalCode}${prefecture}${cityField}`,
        ]
        : [
          receiverCorporateName,
          receiverDeptName,
          `${account.postalPrefix}${formattedPostalCode}${prefecture}${cityField}${street}${apt}`,
        ];
    } else {
      addressText = [
        `${nameText}`,
        katakanaInfo,
        `${account.postalPrefix} ${formattedPostalCode}`,
        addressField,
        apt,
        phoneNumber,
        cellPhoneNumber,
      ];
    }
  } else {
    addressText = [
      `${name} ${salutationText}`,
      street,
      `${cityField} ${prefecture} ${formattedPostalCode}`,
      email,
      phoneNumber,
    ];
  }

  const addressBlockStyle = [addressContainerStyle, styles.address].filter(Boolean).join(' ');
  const addressElement = (
    <address className={addressBlockStyle}>
      {
        addressText.filter(Boolean).map((text, index) =>
          <div key={index}>
            {text && text.replace('undefined', '').replace('ｕｎｄｅｆｉｎｅｄ', '')}
          </div>
        )
      }
      {plannedDates &&
        checkout.standardDeliveryDateWithSeparator + plannedDates}
    </address>
  );
  const panelClasses = classNames(styles[className] || className, {
    [styles.addressPanel]: fromCheckout,
    [styles.addressPanelWrap]: fromCheckout,
    [styles.noMargin]: confirm,
  });
  const headerStyle = classNames({
    [styles.addressPanelHeader]: fromCheckout,
  });

  return (
    <Panel
      className={panelClasses}
      spacingTitle
      {...{ confirm, editable, frame, lighterBoxShadow, onEdit, title, headerStyle }}
      analyticsOn="Button Click"
      analyticsLabel="Change Address"
      analyticsCategory="Checkout Funnel"
    >
      {addressElement}
    </Panel>
  );
};

const { object, bool, string, func, oneOfType, number } = PropTypes;

AddressPanel.propTypes = {
  title: string,
  lastName: string,
  firstName: string,
  salutation: string,
  street: string,
  city: string,
  prefecture: string,
  postalCode: string,
  email: string,
  phoneNumber: string,
  className: string,
  addressContainerStyle: string,
  plannedDates: string,
  frame: bool,
  editable: bool,
  onEdit: func,
  fromAccount: bool,
  cellPhoneNumber: oneOfType([string, number]),
  address: string,
  apt: string,
  fromCheckout: bool,
  noExtraSpacing: bool,
  isMembershipAddress: bool,
  firstNameKatakana: string,
  lastNameKatakana: string,
  fromCardRegistration: bool,
  variation: string,
  receiverCorporateName: string,
  receiverDeptName: string,
  confirm: bool,
  lighterBoxShadow: bool,
  fromOrderDetails: bool,
};

AddressPanel.defaultProps = {
  onEdit: noop,
  fromAccount: false,
  mobNo: '',
  apt: '',
};

AddressPanel.contextTypes = {
  i18n: object,
};

export default AddressPanel;
