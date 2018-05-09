// needed to remove the _type coming from CMS or FreeShipping message.
function mapMessageFields(message) {
  const contentType = message.src ? 'src' : 'text';

  return {
    type: message.type === 'critical' ? 'critical' : 'normal',
    designType: message.designType,
    [contentType]: message[contentType],
    url: message.url,
  };
}

const shippingOnly = messages => messages.filter(message => message.type === 'critical');
const criticalMessages = messages => messages.filter(message => message.type === 'critical');

const filterRules = [
  // coupon wallet
  {
    match: /\/account\/coupon\/?/,
    filter: criticalMessages,
  },
  // delivery
  {
    match: /\/checkout\/delivery\/?/,
    filter: criticalMessages,
  },
  // gifting
  {
    match: /\/checkout\/gifting\/?/,
    filter: criticalMessages,
  },
  // payment
  {
    match: /\/checkout\/payment\/?/,
    filter: criticalMessages,
  },
  // order review and confirmation
  {
    match: /\/checkout\/order\/?/,
    filter: criticalMessages,
  },
  // order history
  {
    match: /\/store\/FSC05020E01.do/,
    filter: criticalMessages,
  },
  // purchase history [this is not a mistake]
  {
    match: /\/order\/history/,
    filter: criticalMessages,
  },
  // membership page
  {
    match: /account\/?/,
    filter: criticalMessages,
  },
  // addressbook page
  {
    match: /\/account\/addresses\/?/,
    filter: criticalMessages,
  },
  // my size pages
  {
    match: /\/mysize\//,
    filter: criticalMessages,
  },
  // special
  {
    match: /^shippingOnly$/,
    filter: shippingOnly,
  },
];

export default function filterTickerMessages(location, messages) {
  const match = filterRules.find(item => location.match(item.match));
  // by default all messages are returned.

  return (match ? match.filter(messages) : messages).map(mapMessageFields);
}
