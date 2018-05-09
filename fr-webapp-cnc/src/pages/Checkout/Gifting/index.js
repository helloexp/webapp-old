import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { asyncConnect } from 'redux-connect';
import siteConfig from 'config/site/default';
import { trackCheckoutNavigation } from 'utils/gtm';
import { routes } from 'utils/urlPatterns';
import { redirect, removeRegion, getUrlWithQueryData } from 'utils/routing';
import { popAPIErrorMessage } from 'redux/modules/errorHandler';
import * as giftingActions from 'redux/modules/checkout/gifting/actions';
import * as giftingSelectors from 'redux/modules/checkout/gifting/selectors';
import { getBrand, isUniqlo } from 'redux/modules/cart/selectors';
import ErrorHandler from 'containers/ErrorHandler';
import If from 'components/uniqlo-ui/If';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import Drawer from 'components/Drawer';
import MessageBox from 'components/MessageBox';
import formValidator from 'components/FormValidator';
import MessageCards from './MessageCards';
import GiftSelector from './GiftSelector';
import styles from './styles.scss';

const { string, object, func, array, bool } = PropTypes;
const { deliveryConflictErrCodes: delvGiftConflictErrCodes } = siteConfig.gifting;

function getAmountFromCurrency(currency) {
  const amount = parseInt(currency.slice(1), 10);

  return isNaN(amount) ? null : amount;
}

/**
 * Indication of saving process, to prevent running multiple API calls
 * It used instead of component state because of setState is asynchronous
 * @type {boolean}
 */
let isInSavingProcess = false;

const GiftBoxSizes = (props, { i18n: { gifting } }) => <Container>
  <p className={styles.giftSize}>{gifting.giftSizeExtraSmall}</p>
  <p className={styles.giftSize}>{gifting.giftSizeSmall}</p>
  <p className={styles.giftSize}>{gifting.giftSizeMedium}</p>
  <p className={styles.giftPerOrder}>{gifting.giftSizeLarge}</p>
</Container>;

GiftBoxSizes.contextTypes = {
  i18n: object,
};

function getRedirectPath(previous) {
  if ([routes.reviewOrder, routes.payment, routes.delivery].includes(removeRegion(previous))) {
    return previous;
  }

  return routes.reviewOrder;
}

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => giftingActions.initGifting(dispatch, getState),
}])
@connect(
  (state, props) => ({
    previousPathname: state.app.previousPathname,
    giftItems: giftingSelectors.getGiftItems(state, props),
    selectedGiftBox: giftingSelectors.getSelectedGiftBox(state),
    selectedGiftData: giftingSelectors.getSelectedGiftBoxData(state),
    selectedMessageCard: state.gifting.selectedMessageCard,
    messageCardItems: giftingSelectors.getMessageCardItems(state),
    isAnyGiftSelected: giftingSelectors.isAnyGiftSelected(state),
    brand: getBrand(state, props),
    isUniqloBrand: isUniqlo(state, props),
  }),
  {
    cancelGift: giftingActions.cancelGift,
    loadGift: giftingActions.loadGift,
    onCardCancel: giftingActions.onCardCancel,
    selectGiftBox: giftingActions.selectGiftBox,
    setGiftAndLoad: giftingActions.setGiftAndLoad,
    popErrorMessage: popAPIErrorMessage,
    handleDeliveryGiftingConflict: giftingActions.handleDeliveryGiftingConflict,
  })
@ErrorHandler(['saveGiftMessage'])
@formValidator
export default class Gifting extends PureComponent {
  static propTypes = {
    // from actions
    cancelGift: func,
    selectGiftBox: func,
    setGiftAndLoad: func,
    loadGift: func,
    onCardCancel: func,
    popErrorMessage: func,
    handleDeliveryGiftingConflict: func,

    // from redux
    previousPathname: string,
    selectedGiftBox: object,
    selectedMessageCard: object,
    error: string,

    // from selectors
    giftItems: array,
    messageCardItems: array,
    selectedGiftData: object,
    brand: string,
    isAnyGiftSelected: bool,
    isUniqloBrand: bool,
  };

  static contextTypes = {
    i18n: object,
    validateForm: func,
    routerContext: object,
  };

  state = {
    selected: null,
    canceled: false,
  };

  componentDidMount() {
    const { brand } = this.props;

    trackCheckoutNavigation(brand);

    isInSavingProcess = false;
    this.isDeliveryTypeValid = true;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !nextState.canceled;
  }

  onCancel = () => {
    const path = getUrlWithQueryData(getRedirectPath(this.props.previousPathname), { brand: this.props.brand });

    this.setState({ canceled: true });
    this.props.cancelGift();

    redirect(path);
  };

  onDone = () => {
    if (!isInSavingProcess && this.context.validateForm()) {
      const path = getUrlWithQueryData(getRedirectPath(this.props.previousPathname), { brand: this.props.brand });

      isInSavingProcess = true;

      this.props.setGiftAndLoad()
        .then(() => redirect(path))
        .catch((error = {}) => {
          if (delvGiftConflictErrCodes.includes(error.resultCode)) {
            this.isDeliveryTypeValid = false;
          }

          isInSavingProcess = false;
        });
    }
  };

  onErrorMessageAction = () => {
    const { brand, selectedGiftBox } = this.props;

    if (!this.isDeliveryTypeValid) {
      this.props.handleDeliveryGiftingConflict(selectedGiftBox.id, brand);
    }

    this.props.popErrorMessage('saveGiftMessage', true);
  }

  select = (id, action) => (...args) => {
    this.setState({ selected: id });
    action(args);
  };

  render() {
    const {
      props: {
        selectedGiftBox,
        selectedMessageCard,
        messageCardItems,
        onCardCancel,
        giftItems,
        selectedGiftData,
        selectGiftBox,
        isAnyGiftSelected,
        error,
        isUniqloBrand,
      },
      context: {
        i18n: {
          common,
          gifting,
        },
      },
    } = this;

    const selected = this.state.selected;
    const isNothingSelected = selected === 'none' || !selected && !isAnyGiftSelected;
    const messageOrder = selectedMessageCard ? gifting.messageOrder : '';
    let confirmMessage = gifting.noGiftMessage;
    let price;

    if (selectedGiftBox) {
      price = getAmountFromCurrency(selectedGiftData.price);

      if (selectedMessageCard) {
        const card = messageCardItems.find(cardItem => cardItem.id === selectedMessageCard.id[0]);

        if (card) {
          price += getAmountFromCurrency(card.price);
        }
      }

      confirmMessage = `${common.currencySymbol}${price || 0}${gifting.confirmGiftOrder}${messageOrder}${gifting.applyGiftOrder}`;
    }

    return (
      <div>
        <If
          if={error}
          then={MessageBox}
          message={error}
          onAction={this.onErrorMessageAction}
          rejectLabel="OK"
          variation="completed"
        />
        <Drawer
          acceptLabel={common.done}
          cancelLabel={common.cancelText}
          className="giftDrawer"
          bodyClass={styles.drawerBody}
          onAccept={this.onDone}
          onCancel={this.onCancel}
          title={gifting.selectGifting}
          acceptBtnProps={{ preventMultipleClicks: true }}
          variation="giftHeader"
        >
          <Container className={styles.giftContent}>
            <p className={styles.giftWarning}>{gifting.giftWarning}</p>
            <p className={classNames(styles.giftWarning, { [styles.giftPerOrder]: !isUniqloBrand })}>{gifting.oneGiftBox}</p>
            <If if={isUniqloBrand} then={GiftBoxSizes} />
            <Heading
              className={styles.giftSubHeading}
              headingText={gifting.selectBox}
              type="h3"
            />
            {
              giftItems.map(item =>
                <GiftSelector
                  checked={selected === item.id || !selected && item.selected}
                  key={item.id}
                  {...item}
                  name="box"
                  onSelect={this.select(item.id, selectGiftBox)}
                />
              )
            }
            <GiftSelector
              checked={isNothingSelected}
              name="noBox"
              onCancelSelect={this.select('none', onCardCancel)}
              radioLabelStyle={styles.noGiftBox}
              title={gifting.noGiftBox}
            />
            <If if={!isNothingSelected} then={MessageCards} />
          </Container>
          <div className={styles.wrapConfirmMessage}>
            <Text>{confirmMessage}</Text>
          </div>
        </Drawer>
      </div>
    );
  }
}
