import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import If from 'components/uniqlo-ui/If';
import { redirect, getCurrentBrand, getUrlWithQueryData } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import * as giftingSelectors from 'redux/modules/checkout/gifting/selectors';
import * as cartSelectors from 'redux/modules/cart/selectors';
import { clearCartGifting as clearCartGiftingAction } from 'redux/modules/cart';
import * as giftingActions from 'redux/modules/checkout/gifting/actions';
import GiftDetails from './GiftDetails';
import GiftLink from './GiftLink';

const { object, bool, func, string } = PropTypes;

@connect(
  (state, props) => ({
    giftMessage: giftingSelectors.getGiftMessage(state, props),
    giftBox: giftingSelectors.getGiftBoxFromGift(state, props),
    msgCard: giftingSelectors.getMessageCardFromGift(state, props),
    messageCardId: giftingSelectors.getSelectedMessageId(state, props),
    isGifting: giftingSelectors.getIsGifting(state, props),
    brand: getCurrentBrand(state),
    cartGift: cartSelectors.getCartGift(state, props),
    formattedGiftCardAmount: giftingSelectors.getFormattedGiftCardAmount(state, props),
    formattedMessageCardAmount: giftingSelectors.getFormattedMessageCardAmount(state, props),
  }),
  {
    selectGiftBox: giftingActions.selectGiftBox,
    setMessage: giftingActions.setMessage,
    selectMessageCard: giftingActions.selectMessageCard,
    clearCartGifting: clearCartGiftingAction,
  })
export default class GiftPanel extends PureComponent {
  static propTypes = {
    // from parent
    gift: object,
    className: string,

    // from actions
    clearCartGifting: func,
    selectGiftBox: func,
    selectMessageCard: func,
    setMessage: func,

    // from selectors
    messageCardId: string,
    giftMessage: string,
    msgCard: object,
    totalPrice: string,
    isGifting: bool,
    giftBox: object,
    cartGift: object,

    enabled: bool,
    editDelivery: bool,
    editable: bool,
    frame: bool,
    noIcon: bool,
    review: bool,
    confirm: bool,
    routing: object,
    brand: string,
    messageVisible: bool,
    orderHistory: bool,
    lighterBoxShadow: bool,
    formattedGiftCardAmount: string,
    formattedMessageCardAmount: string,
  };

  static contextTypes = {
    i18n: object,
    router: object,
    config: object,
  };

  componentWillMount() {
    this.giftingUrl = getUrlWithQueryData(routes.gifting, { brand: this.props.brand });
  }

  goToEditPage = () => {
    const { clearCartGifting, gift, selectGiftBox, selectMessageCard, setMessage, messageCardId, giftMessage, cartGift } = this.props;

    if (gift || cartGift) {
      selectGiftBox(gift && gift.id || cartGift.id);
    }

    if (messageCardId) {
      selectMessageCard([messageCardId]);
    }

    if (giftMessage) {
      setMessage(giftMessage);
    }

    clearCartGifting();

    redirect(this.giftingUrl);
  };

  render() {
    const { i18n: { gifting } } = this.context;
    const {
      confirm,
      editable,
      editDelivery,
      enabled,
      frame,
      giftBox,
      giftMessage,
      isGifting,
      msgCard,
      noIcon,
      messageCardId,
      review,
      orderHistory,
      lighterBoxShadow,
      formattedGiftCardAmount,
      formattedMessageCardAmount,
      className,
    } = this.props;

    const title = orderHistory ? '' : gifting.options;
    const isDetailsAvailable = !review && isGifting || review || false;

    // Here we are removing particular text sent from the API
    // This is for JP only so using it via i18n would risk unexpected results in other languages
    // Currently the business wants to detect type of giftbox based on this text in the title
    // More in https://redmine.fastretailing.com/issues/43369
    const giftBoxTitle = giftBox && giftBox.title.replace(/(資材同梱|直接)/, '');

    const giftingData = giftBox
      ? {
        title: `${giftBoxTitle} ${formattedGiftCardAmount}`,
        description: giftBox.hasPacking ? gifting.withPacking : gifting.withoutPacking,
      }
      : {
        title: gifting.noItem,
      };

    if (messageCardId && msgCard) {
      giftingData.card = {
        title: msgCard.title,
        message: giftMessage,
      };
    }

    return (
      <If
        if={isDetailsAvailable}
        then={GiftDetails}
        else={GiftLink}
        editable={editable || editDelivery}
        giftBox={giftingData}
        giftingUrl={this.giftingUrl}
        goToEditPage={this.goToEditPage}
        {...{ enabled, frame, lighterBoxShadow, noIcon, title, confirm, orderHistory, review, formattedMessageCardAmount, className }}
      />
    );
  }
}
