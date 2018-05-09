import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import withShouldRender, { shouldRender } from 'helpers/ShouldRender';
import { getCurrentBrand } from 'utils/routing';
import Ticker from 'components/Ticker';
import filterTickerMessages from 'components/Ticker/filterTickerMessages';

const { object, string, func } = PropTypes;

class GlobalTicker extends PureComponent {
  render() {
    const currentBrand = getCurrentBrand(this.props);
    const tickerComponent = this.context.config.tickerData[0] || [];
    const tickerItems = tickerComponent.content[currentBrand] || [];
    // window.location is polyfilled
    const filterCondition = this.props.filterType || window.location.href;
    const filteredMessages = filterTickerMessages(filterCondition, tickerItems);

    return <Ticker messages={filteredMessages} timer={tickerComponent.timer} />;
  }
}

GlobalTicker.propTypes = {
  cartState: object,
  orderState: object,
  deliveryState: object,
  routing: object,
  filterType: string,
  closeAction: func,
};

GlobalTicker.contextTypes = {
  i18n: object,
  config: object,
};

const connectedGlobalTicker = connect(
  state => ({
    cartState: state.cart,
    orderState: state.order,
    deliveryState: state.delivery,
    routing: state.routing,
  }), null)(GlobalTicker);

const EmptyTicker = () => null;

const alternateTicker = force => (force || !shouldRender('Ticker') ? connectedGlobalTicker : EmptyTicker);

export { alternateTicker };

export default withShouldRender('Ticker')(connectedGlobalTicker);
