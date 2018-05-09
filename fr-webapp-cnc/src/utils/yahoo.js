import { getCurrentBrandFromLocation } from 'utils/routing';
import { routePatterns } from 'utils/urlPatterns';

/**
 * Add Yahoo tracker where appropriate
 */
let yahooTrackerAdded = false;

/**
  * @type {Boolean} scriptLoaded - used to check if tag.js script is loaded. Its value will be set to true once the script is loaded.
  * @type {String} additionalEventAdded - used to identify in which page the additional event is fired
  *   values: - 'none' if initial load/event not fired yet
  *           - 'cart' if event is fired in cart page
  *           - 'orderConfirm' if event is fired in orderConfirm page
  * @type {Number} triggerEvent - used to clear the timer set by setInterval(). Its value is the return value of the timer.
  */
let scriptLoaded = false;
let additionalEventAdded = 'none';
let triggerEvent;

function injectYahooTracker() {
  const tagjs = document.createElement('script');
  const s = document.getElementsByTagName('script')[0];

  tagjs.async = true;
  tagjs.src = '//s.yjtag.jp/tag.js#site=w29euA6';
  s.parentNode.insertBefore(tagjs, s);

  tagjs.onload = () => { scriptLoaded = true; };
}

/**
  * Function to create and fire an additional event for affiliate conversion.
  * Clear the interval once the event is dispatched
  */
function triggerAffiliateConversionEvent() {
  const isCart = routePatterns.cart.test(location.pathname);

  if (scriptLoaded) {
    const eventName = isCart ? 'ytmViewCart' : 'ytmViewCV';
    const optSetEvent = new Event(eventName, { bubbles: true, cancelable: true });

    window.dispatchEvent(optSetEvent);
    clearInterval(triggerEvent);
  }
}

/**
 * Add Yahoo tracker in checkout for GU and cart for all brands
 * intentionally in timeout to give time for page to render
 */
export function maybeAddYahooTracker() {
  const { location: { pathname: path } } = document;
  const brand = getCurrentBrandFromLocation();
  const isGuCheckout = brand === 'gu' && routePatterns.checkoutPages.test(path);
  const isCart = routePatterns.cart.test(path);

  if (!yahooTrackerAdded && (isCart || isGuCheckout) && !__DEVELOPMENT__) {
    setTimeout(injectYahooTracker, 50);
    yahooTrackerAdded = true;
  }

  const isOrderConfirm = routePatterns.confirmOrder.test(path);
  const isEventNotFiredInCart = isCart && additionalEventAdded !== 'cart';
  const isEventNotFiredInOrderConfirm = isOrderConfirm && additionalEventAdded !== 'orderConfirm';

  /**
   * In order to kick the affiliate conversion event,
   * we have to set an additional event on gu cart page and gu order confirm page.
   * To ensure that the event is created and fired only once for the required page,
   * check if either of the following cases is true:
   *  - event is not created and fired yet (additionalEventAdded === 'none')
   *  - currently in cart page and event is not fired in cart page (isEventNotFiredInCart)
   *  - currently in confirm order page and event is not fired in confirm order page (isEventNotFiredInOrderConfirm)
   */
  if (brand === 'gu'
    && (isCart || isOrderConfirm)
    && (additionalEventAdded === 'none' || isEventNotFiredInCart || isEventNotFiredInOrderConfirm)
  ) {
    additionalEventAdded = isCart ? 'cart' : 'orderConfirm';
    triggerEvent = setInterval(triggerAffiliateConversionEvent, 100);
  }
}
