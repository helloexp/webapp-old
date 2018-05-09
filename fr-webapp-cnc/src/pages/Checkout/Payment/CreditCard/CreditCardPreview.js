import React, { PropTypes, PureComponent } from 'react';
import Button from 'components/Atoms/Button';
import CreditCardTile from 'pages/Checkout/components/PaymentMethodTile/CreditCardTile';
import styles from './styles.scss';

const { func, object } = PropTypes;

export default class CreditCardPreview extends PureComponent {

  static propTypes = {
    creditCard: object,
    confirmDelete: func,
    selectCard: func,
  };

  static contextTypes = {
    i18n: object,
  };

  onConfirmDelete = () => {
    const {
      confirmDelete,
      creditCard,
    } = this.props;

    confirmDelete(creditCard);
  };

  onSelectCard = () => this.props.selectCard(this.props.creditCard);

  render() {
    const { i18n: { payment } } = this.context;
    const { creditCard } = this.props;

    return (
      <div className={styles.creditTileWrapper}>
        <CreditCardTile
          className={styles.creditTile}
          creditCard={creditCard}
          creditCardValid
          hideBilling
          isApplied
          paymentLink=""
          variation="payment"
        />
        <div className={styles.buttons}>
          <Button type={Button.type.flat} onClick={this.onSelectCard} className={styles.button}>
            <span className={creditCard.selected ? styles.tickIcon : 'hidden'} />
            {payment.choice}
          </Button>
          <Button type={Button.type.flat} onClick={this.onConfirmDelete} className={styles.button}>
            <span className={styles.closeIcon} />
          </Button>
        </div>
      </div>
    );
  }
}
