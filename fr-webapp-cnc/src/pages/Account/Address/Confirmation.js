import React, { PureComponent, PropTypes } from 'react';
import Label from 'components/uniqlo-ui/Label';
import Button from 'components/uniqlo-ui/Button';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import { formatBirthDate } from 'utils/formatDate';
import { formatPostalCode } from 'utils/format';
import scrollToTop from 'utils/scroll';
import styles from './confirmation.scss';

const { bool, object, func } = PropTypes;

const fieldHeaderClass = `subHeader ${styles.fieldHeader}`;
const fieldLabelClass = `formLabel ${styles.fieldLabel}`;
const newsLetterFieldClass = `formLabel ${styles.newsLetterField} ${styles.addressConfirmField}`;

function newRegConfirmationView(address, isNewAddressReg) {
  const labelClass = isNewAddressReg
      ? fieldLabelClass
      : newsLetterFieldClass;
  const fieldsView = [];

  Object.keys(address).forEach((field, index) => {
    fieldsView.push(
      <Container className={styles.addressConfirmation} key={index}>
        {
          isNewAddressReg
          ? <Heading className={fieldHeaderClass} headingText={address[field].head || ''} type="h4" />
        : null
        }
        <Label className={`${labelClass} ${styles.labelClass}`} text={address[field].value || ''} />
      </Container>
    );
  });

  return fieldsView;
}

export default class Confirmation extends PureComponent {
  static propTypes = {
    addressData: object,
    isNewAddressReg: bool,
    confirmAddress: func,
    backToEntry: func,
    backToNewAddressEntry: func,
  };

  static contextTypes = {
    i18n: object,
  };

  componentDidMount() {
    scrollToTop();
  }

  render() {
    const {
      addressData,
      isNewAddressReg,
      confirmAddress,
      backToEntry,
      backToNewAddressEntry,
    } = this.props;
    const { account, address, common } = this.context.i18n;
    let newRegAddressData = null;
    let newsLetterView = null;

    if (isNewAddressReg) {
      const birthday = formatBirthDate(addressData.birthday);

      newRegAddressData = {
        email: { head: address.email, value: addressData.email },
        name: { head: address.name, value: `${addressData.lastName} ${addressData.firstName}` },
        katakanaName: { head: address.katakanaName, value: `${addressData.lastNameKatakana} ${addressData.firstNameKatakana}` },
        zipcode: { head: address.postalCode, value: formatPostalCode(`${address.postalPrefix}${addressData.postalCode}`) },
        prefecture: { head: address.prefecture, value: addressData.prefecture },
        street: { head: address.street, value: addressData.city },
        streetNumber: { head: address.streetNumber, value: addressData.streetNumber },
        apt: { head: address.apt, value: addressData.apt },
        phoneNumber: { head: address.phoneNumber, value: addressData.phoneNumber },
        cellPhoneNumber: { head: address.cellPhoneNumber, value: addressData.cellPhoneNumber },
        gender: { head: address.gender.name, value: address.gender[addressData.gender] },
        birthday: { head: address.birthday, value: birthday },
      };
      newsLetterView = addressData.newsLetter
        ? (<Container className={styles.newsLetterView}>
          <Heading
            className={`subHeader ${styles.newsLetterHead}`}
            headingText={address.newsLetter.name}
            type="h4"
          />
          {addressData.newsLetter.map((item, index) =>
            <Label className={newsLetterFieldClass} key={index} text={item} />
            )}
        </Container>)
        : null;
    } else {
      newRegAddressData = {
        name: { value: `${addressData.lastName} ${addressData.firstName}` },
        katakanaName: { value: `${addressData.lastNameKatakana} ${addressData.firstNameKatakana}` },
        zipcode: { value: formatPostalCode(`${address.postalPrefix}${addressData.postalCode}`) },
        prefecture: { value: `${addressData.prefecture} ${addressData.city || addressData.street} ` },
        location: { value: `${addressData.streetNumber} ${addressData.apt || ''}` },
        phoneNumber: { value: addressData.phoneNumber },
        cellPhoneNumber: { value: addressData.cellPhoneNumber },
        email: { value: addressData.email },
      };
    }

    return (
      <Container className={styles.confirmation}>
        <Container className={isNewAddressReg && styles.fieldsContainer}>
          { newRegConfirmationView(newRegAddressData, isNewAddressReg) }
        </Container>
        {newsLetterView}
        <Button
          className={`secondary medium ${styles.confirmButton}`}
          label={common.update}
          labelClass={styles.buttonLabel}
          onTouchTap={confirmAddress}
        />
        <Button
          className="default medium boldWithBorder"
          label={account.backToEntry}
          labelClass={styles.buttonLabel}
          onTouchTap={isNewAddressReg ? backToNewAddressEntry : backToEntry}
        />
      </Container>
    );
  }
}
