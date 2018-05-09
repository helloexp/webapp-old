import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import { getSelectedGiftBox, getMessageCardItems, getGiftMessage, getSelectedMessageCardId } from 'redux/modules/checkout/gifting/selectors';
import * as giftingActions from 'redux/modules/checkout/gifting/actions';
import GiftSelector from '../GiftSelector';
import styles from './styles.scss';

const { array, string, func, object } = PropTypes;

@connect(
  state => ({
    selectedGiftBox: getSelectedGiftBox(state),
    messageCardItems: getMessageCardItems(state),

    message: getGiftMessage(state),
    selectedMessageCard: getSelectedMessageCardId(state),
  }),
  {
    selectMessageCard: giftingActions.selectMessageCard,
    onMessageCancel: giftingActions.onMessageCancel,
  })
export default class MessageCards extends PureComponent {
  static propTypes = {
    message: string,
    selectedGiftBox: object,
    selectedMessageCard: string,
    selectMessageCard: func,
    onMessageCancel: func,
    messageCardItems: array,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
    selected: null,
  };

  componentWillMount() {
    const { selectedMessageCard } = this.props;

    this.setState({
      selected: selectedMessageCard,
    });
  }

  componentWillReceiveProps({ selectedMessageCard, message }) {
    this.resetCard = !selectedMessageCard && !message;
  }

  select = (id, action) => (...args) => {
    this.resetCard = false;
    this.setState({ selected: id });
    action(args);
  };

  render() {
    const {
      selectedGiftBox,
      selectedMessageCard,
      messageCardItems,
      onMessageCancel,
      selectMessageCard,
    } = this.props;

    const { i18n: { gifting } } = this.context;
    const selected = !this.resetCard && this.state.selected || 'none';

    return (
      <Container>
        <Heading
          className={styles.cardTitle}
          headingText={gifting.selectCard}
          type="h3"
        />
        <div className={styles.cards}>
          {
            messageCardItems.map(item =>
              <GiftSelector
                checked={selected === item.id || !selected && item.selected}
                enabled={!!selectedGiftBox}
                key={item.id}
                {...item}
                name="card"
                onSelect={this.select(item.id, selectMessageCard)}
              />
            )
          }
          <GiftSelector
            checked={selected === 'none' || !selected && !selectedMessageCard}
            enabled={!!selectedGiftBox}
            name="noCard"
            onCancelSelect={this.select('none', onMessageCancel)}
            radioLabelStyle={styles.noMessageCard}
            title={gifting.noMessageCard}
          />
        </div>
      </Container>
    );
  }
}
