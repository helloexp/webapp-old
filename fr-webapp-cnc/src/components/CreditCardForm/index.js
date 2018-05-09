import noop from 'utils/noop';
import React, { PureComponent, PropTypes } from 'react';
import CardValidator from 'utils/CardValidator';
import { toDoubleDigit } from 'utils/formatDate';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import If from 'components/uniqlo-ui/If';
import Image from 'components/uniqlo-ui/Image';
import Input from 'components/Atoms/Input';
import Select from 'components/Atoms/Select';
import InputGroup from 'components/Atoms/InputGroup';
import Drawer from 'components/Drawer';
import { toHalfWidth, formatCardNumber, toNumber, stripLeadingSpaces } from 'utils/format';
import classNames from 'classnames';
import spacing from 'theme/spacing.scss';
import cvvb from 'images/cvvb.png';
import cvvf from 'images/cvvf.png';
import CvvModal from './CvvModal';
import visa from './images/visa.png';
import jcb from './images/jcb.png';
import master from './images/master.png';
import amex from './images/amex.png';
import diners from './images/diners.png';
import styles from './styles.scss';

const cardImages = [
  visa,
  jcb,
  master,
  amex,
  diners,
];

const { object, func, string, bool } = PropTypes;

function stripPlaceholder(val) {
  return val ? val.replace(/ /g, '') : '';
}

function renderCardImages() {
  return cardImages.map((cardImage, index) =>
    <Image
      className={styles.creditCard}
      key={index}
      source={cardImage}
    />
  );
}

const buildFieldProps = (context) => {
  const { payment } = context.i18n;

  return {
    card: {
      classNames: ['card'],
      name: 'ccLastFourDigits',
      errors: {
        invalid: payment.invalidCreditCardNumber,
        declined: payment.creditCardDeclined,
      },
      id: 'card',
      placeholder: payment.creditCardNumber,
      validator: CardValidator.number,
    },
    cvv: {
      classNames: ['cvv'],
      errors: {
        invalid: payment.invalidCvv,
      },
      id: 'cvv',
      name: 'cardCvv',
      validator: CardValidator.cvv,
    },
  };
};

function getCardInfo(cardInfo) {
  return cardInfo.map((text, index) => <div className={styles.toolTipTextElmnt} key={index}>{text}</div>);
}

export default class CreditCardForm extends PureComponent {
  static propTypes = {
    card: object,
    cardCvv: string,
    cardNumber: string,
    cardType: string,
    cvv: string,
    creditCard: object,
    expMonth: string,
    expYear: string,
    name: string,
    setCreditCard: func,
    ccLastFourDigits: string,
    footerMargin: bool,
    getErrors: func,
    isFromCheckout: bool,
  };

  static contextTypes = {
    i18n: object,
    config: object,
    setErrorMessage: func,
  };

  static defaultProps = {
    setCreditCard: noop,
    cardType: '',
    expMonth: '',
    expYear: '',
    name: '',
    getErrors: noop,
  };

  static getCardTypeOptions({ cardTypes, payment }) {
    return [
      { value: '', label: payment.selectCardType },
      ...cardTypes,
    ];
  }

  static getMonthOptions({ payment }, year) {
    const months = [{ value: '', label: payment.expMonth }];
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    for (let month = currentYear === parseInt(year, 10) ? currentMonth : 1; month <= 12; month++) {
      months.push({ value: `${month}`, label: toDoubleDigit(month) });
    }

    return months;
  }

  static getYearOptions({ payment }, range) {
    const currentYear = new Date().getFullYear();
    const years = [{ value: '', label: payment.expYear }];

    for (let count = 0; count < range; count++) {
      const year = `${currentYear + count}`;

      years.push({ value: year, label: year });
    }

    return years;
  }

  state = {
    cardType: null,
    showCvvModal: false,
    isDrawerVisible: false,
    footerMargin: false,

    // Properties for card and cvv fields
    card: null,
    cvv: null,
    cardNumberFocused: false,
  };

  componentWillMount() {
    const { footerMargin, isFromCheckout } = this.props;
    const fieldProps = buildFieldProps(this.context);

    this.containerClass = classNames({
      [styles.checkoutCreditCard]: isFromCheckout,
      [styles.creditCardForm]: !isFromCheckout,
      [styles.footerMargin]: footerMargin,
    });

    this.infoIconStyle = classNames('small', 'default', 'showOverflow', styles.infoIcon, {
      [styles.noRightMargin]: footerMargin,
    });

    this.setState({ cardType: this.props.cardType, card: fieldProps.card, cvv: fieldProps.cvv });
  }

  onCardNumberFocus = () => {
    this.setState({ cardNumberFocused: true });
  };

  onCardNumberBlur = (event) => {
    this.handleChange(event, true);
    this.setState({ cardNumberFocused: false });
  };

  setInputValue(name, value) {
    this.props.setCreditCard(name, value);
  }

  getCardNumberValue() {
    const { cardNumberFocused } = this.state;
    const { ccLastFourDigits, cardType } = this.props;

    return cardNumberFocused
      ? (ccLastFourDigits || '')
      : formatCardNumber(ccLastFourDigits || '', cardType);
  }

  getCardNumberMaxLength() {
    const { config } = this.context;
    const { cardNumberFocused } = this.state;
    const { cardType } = this.props;

    const cardPattern = cardType === config.payment.amex
      ? config.creditCard.cardPattern.americanExpress
      : config.creditCard.cardPattern.default;

    return (cardNumberFocused ? stripPlaceholder(cardPattern) : cardPattern).length;
  }

  handleChange = (event) => {
    let fieldId = event.target.name;
    const eventValue = event.target.value;
    let value = fieldId === 'cvv' ? toNumber(eventValue) : eventValue;

    value = fieldId === 'name' ? stripLeadingSpaces(value) : value;

    if (fieldId === 'card' || fieldId === 'cvv') {
      const fieldData = { ...this.state[fieldId] };
      const state = {};
      let valData = {};

      value = stripPlaceholder(value);

      if (fieldId === 'cvv') {
        valData = fieldData.validator(value, this.cardData && this.cardData.code ? this.cardData.code.size : undefined);
      } else if (fieldId === 'card') {
        valData = fieldData.validator(value);

        const cardData = valData.card || {};

        state.cardType = cardData.type || '';
        this.setInputValue('cardType', cardData.type);
        this.cardData = cardData;
      }

      fieldData.hasVal = value.length > 0 || false;
      fieldData.isValid = valData.isValid === true;
      // Updating the state with the new values
      if (fieldId !== 'cardType') {
        state[fieldId] = fieldData;
      }

      this.setState(state);
      fieldId = fieldData.name;
    } else if (fieldId === 'name') {
      value = toHalfWidth(value);
    } else if (fieldId === 'cardType') {
      if (this.state.card.hasVal) {
        value = this.state.cardType;
      }

      this.setState({
        ...this.state,
        cardType: value,
      });
      this.setInputValue('cardType', value);
    }

    if (fieldId !== 'cardCvv') {
      const cvvData = { ...this.state.cvv };
      const valCvvData = cvvData.validator(this.props.cardCvv, this.cardData && this.cardData.code ? this.cardData.code.size : undefined);

      cvvData.hasVal = this.props.cardCvv && this.props.cardCvv.length > 0 || false;
      cvvData.isValid = valCvvData.isValid === true;
      cvvData.errorMessage = cvvData.errors.invalid;
      cvvData.showError = false;
      if (cvvData.hasVal) {
        this.setState({ cvv: cvvData });
      }
    }

    this.setInputValue(fieldId, value);
  };

  toggleModal = () => {
    this.setState(prevState => ({ showCvvModal: !prevState.showCvvModal }));
  };

  toggleDrawer = () => {
    this.setState(prevState => ({ isDrawerVisible: !prevState.isDrawerVisible }));
  };

  render() {
    const { cardCvv, name, expMonth, expYear, isFromCheckout } = this.props;
    const { i18n, config } = this.context;
    const { payment, paymentMethod, common: { validation } } = i18n;
    const { card, cvv } = this.state;
    const cardInfo = getCardInfo(payment.cardInfo);

    return (
      <div className={this.containerClass}>
        <div className={styles.wrapCardImages}>
          <div className={styles.imageWrap}>
            {renderCardImages()}
          </div>
          <div className={styles.wrapInfoIcon}>
            <Button
              className={this.infoIconStyle}
              onTouchTap={this.toggleDrawer}
            />
          </div>
          <If if={this.state.isDrawerVisible}>
            <Drawer onCancel={this.toggleDrawer} title={payment.creditCardTooltip} variation="noFooter">
              {cardInfo}
            </Drawer>
          </If>
        </div>
        <div className={styles.requiredWrapper}>
          <Text className={styles.required}>{payment.required}</Text>
        </div>
        <div
          className={classNames(styles.cardTextInput, {
            [spacing.MBSM]: !isFromCheckout,
            [styles.inputContainer]: isFromCheckout,
          })}
        >
          <Input
            value={this.getCardNumberValue()}
            maxLength={this.getCardNumberMaxLength()}
            name={card.id}
            onFocus={this.onCardNumberFocus}
            onBlur={this.onCardNumberBlur}
            onChange={this.handleChange}
            label={i18n.creditCard.cardNumber}
            inputStyle={styles.inputBottomPadding}
            type="tel"
            required
            validations={[{
              rule: 'required',
              errorMessage: validation.cardNumberRequired,
            }, {
              rule: 'creditCard',
              errorMessage: payment.invalidCreditCardNumber,
            }]}
          />
        </div>
        <Select
          value={this.state.cardType}
          values={this.constructor.getCardTypeOptions(i18n)}
          onChange={this.handleChange}
          onBlur={this.handleChange}
          name="cardType"
          required
          inputStyle={styles.inputBottomPadding}
          className={classNames({ [spacing.MBSM]: !isFromCheckout, [styles.inputContainer]: isFromCheckout })}
        />
        <InputGroup className={classNames({ [spacing.MBSM]: !isFromCheckout, [styles.inputContainer]: isFromCheckout })}>
          <Select
            value={expMonth}
            values={this.constructor.getMonthOptions(this.context.i18n, expYear)}
            onChange={this.handleChange}
            onBlur={this.handleChange}
            name="expMonth"
            label={payment.expiry}
            required
            inputStyle={styles.inputBottomPadding}
            validations={[
              {
                rule: 'required',
                errorMessage: validation.expDateRequired,
              },
            ]}
          />
          <Select
            value={expYear}
            values={this.constructor.getYearOptions(this.context.i18n, config.creditCard.yearSelectRange)}
            onChange={this.handleChange}
            onBlur={this.handleChange}
            name="expYear"
            required
            inputStyle={styles.inputBottomPadding}
            validations={[
              {
                rule: 'required',
                errorMessage: validation.expDateRequired,
              },
            ]}
          />
        </InputGroup>
        <div className={classNames(styles.cardTextInput, { [spacing.MBS]: !isFromCheckout, [styles.inputBottomPadding]: isFromCheckout })}>
          <Input
            value={cardCvv || ''}
            maxLength={4}
            name={cvv.id}
            onChange={this.handleChange}
            onBlur={this.handleChange}
            label={i18n.creditCard.cvv}
            inputStyle={styles.inputBottomPadding}
            type="tel"
            required
            validations={[{
              rule: 'required',
              errorMessage: paymentMethod.pleaseEnterTheCVV,
            }, {
              rule: 'cvv',
              errorMessage: payment.invalidCvv,
              params: this.cardData && this.cardData.code ? this.cardData.code.size : undefined,
            }]}
          />
        </div>
        <div className={classNames(styles.imageContainer, { [spacing.MBSM]: !isFromCheckout, [styles.inputContainer]: isFromCheckout })}>
          <div>
            <Image
              className={styles.cvvImage}
              source={cvvb}
            />
            <Image
              className={styles.cvvImage}
              source={cvvf}
            />
          </div>
          <div className={styles.wrapInfoIcon}>
            <Button
              className={this.infoIconStyle}
              onTouchTap={this.toggleModal}
            />
          </div>
        </div>
        <Input
          className={classNames(styles.uppercase, {
            [spacing.MBL]: !isFromCheckout,
            [styles.inputContainer]: isFromCheckout,
          })}
          value={name}
          onChange={this.handleChange}
          onBlur={this.handleChange}
          label={payment.nameOnCard}
          inputStyle={styles.inputBottomPadding}
          name="name"
          required
          validations={[{
            rule: 'required',
            errorMessage: validation.cardHolderRequired,
          }, {
            rule: 'alphaWithSpace',
            errorMessage: validation.alphaWithSpaceRequired,
          }]}
        />
        <If if={this.state.showCvvModal} onCancel={this.toggleModal} then={CvvModal} />
      </div>
    );
  }
}
