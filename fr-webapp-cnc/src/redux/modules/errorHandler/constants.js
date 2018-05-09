export const RESET_API_ERROR_MESSAGES = 'errH/RESET_ALL';
export const RESET_API_CUSTOM_ERROR_MESSAGES = 'errH/RESET_CSTM_MSGS';
export const RESET_API_PAGE_ERROR_MESSAGES = 'errH/RESET_PAGE_MSGS';
export const PUSH_API_ERROR_MESSAGE = 'errH/PUSH_MSG';
export const POP_API_ERROR_MESSAGE = 'errH/POP_MSG';
export const PUSH_DETAILED_ERROR_MESSAGE = 'errH/PUSH_DTL_MSG';
export const RESET_DETAILED_ERROR_MESSAGES = 'errH/RESET_DTL_MSGS';
export const POP_DETAILED_ERROR_MESSAGE = 'errH/POP_DTL_MSG';
export const ERROR_REDIRECT = 'errH/REDIRECT';
export const RESET_ERROR_REDIRECT = 'errH/RESET_REDIRECT';
export const FAKE_ERROR_RESPONSE = 'errH/FAKE_ERR';
export const FAKE_BLUEGATE_ERROR = 'errH/FAKE_BLUGATE_ERR';
export const RESET_INVENTORY_ERROR = 'errH/RESET_INVENTORY_ERR';
export const RESET_SCROLL_UP_FLAG = 'errH/RESET_SCROLL_FLAG';

export const initialState = {
  isErrorRedirected: false,
  scrollUp: false,
  isACPFValidationError: false,
  isGDSValidationError: false,
  pageErrors: [],
  customErrors: {
    addToExistingCart: '',
    coupon: '',
    generateCart: '',
    getCartCouponInfo: '',
    loadCart: '',
    placeOrder: '',
    deleteOrder: '',
    provisionalInventory: '',
    saveGiftMessage: '',
    giftBagFetch: '',
    setDeliveryType: '',
    setPaymentMethod: '',
    loadDeliveryOptions: '',
    loadPaymentOptions: '',
    applyGiftCard: '',
    removeGiftCard: '',
    loadGiftCards: '',
    getPaymentType: '',
    saveShippingAddress: '',
    verifyGiftCard: '',
    removeCartItem: '',
    setCartItemCount: '',
    getOrderDetails: '',
    blueGateCreditCardError: '',
    prepareCreditCard: '',
    getBillingAddress: '',
    setBillingAddress: '',
    getDeliveryMethod: '',
  },
  detailedErrors: {
    cartItems: {},
    giftCards: {},
    formValidation: {},
  },
  inventoryError: [],
};
