import React, { PropTypes, PureComponent } from 'react';
import Text from 'components/uniqlo-ui/Text';
import { fixBreakLinesFromApi } from 'utils/format';
import { connect } from 'react-redux';
import { setMessage } from 'redux/modules/checkout/gifting/actions';
import { getGiftMessageEntered, getGiftMessage } from 'redux/modules/checkout/gifting/selectors';
import MessageTextArea from './MessageTextArea';
import styles from './styles.scss';

const { func, object, string } = PropTypes;

@connect(state => ({
  message: getGiftMessageEntered(state),
  savedGiftMessage: getGiftMessage(state),
}), {
  onSetMessage: setMessage,
})
export default class MessageEditor extends PureComponent {

  static propTypes = {
    id: string,
    savedGiftMessage: string,
    message: string,
    onSetMessage: func,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
    inFocus: false,
  };

  componentDidMount() {
    const { onSetMessage, savedGiftMessage } = this.props;

    onSetMessage(savedGiftMessage);
  }

  onMessageWrite = (event) => {
    const { onSetMessage } = this.props;

    if (event.target) {
      onSetMessage(event.target.value);
    }
  };

  onFocusChange = () => {
    if (!this.state.inFocus && this.containerNode) {
      this.containerNode.querySelector('textarea')
        .scrollIntoView({ block: 'start', behavior: 'smooth' });
    }

    this.setState(prevState => ({
      inFocus: !prevState.inFocus,
    }));
  };

  render() {
    const { message, id } = this.props;
    const { inFocus } = this.state;
    const { gifting } = this.context.i18n;
    const messageWithBreakLines = fixBreakLinesFromApi(message) || '';
    const textareaClass = inFocus ? styles.onFocus : styles.notFocus;

    return (
      <div className={styles.giftSelectorPreview} ref={(node) => { this.containerNode = node; }}>
        <Text className={textareaClass}>{gifting.messageTitle}</Text>
        <MessageTextArea
          value={messageWithBreakLines}
          onChange={this.onMessageWrite}
          className={styles.giftTextArea}
          name={`message${id}`}
          onFocus={this.onFocusChange}
          onBlur={this.onFocusChange}
        />
      </div>
    );
  }
}
