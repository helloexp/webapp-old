export default function newsLetterActions(me, state, newsLetter, value) {
  let newsLetterState = {};

  switch (value) {
    case newsLetter.general:
      me.props.setNewsLetter(value, !state.isGeneral, null);
      newsLetterState = { isGeneral: !state.isGeneral };
      break;
    case newsLetter.men:
      me.props.setNewsLetter(value, !state.isGeneral, null);
      newsLetterState = { isMen: !state.isMen };
      break;
    case newsLetter.women:
      me.props.setNewsLetter(value, !state.isGeneral, null);
      newsLetterState = { isWomen: !state.isWomen };
      break;
    case newsLetter.kids:
      me.props.setNewsLetter(value, !state.isGeneral, null);
      newsLetterState = { isKids: !state.isKids };
      break;
    case newsLetter.baby:
      me.props.setNewsLetter(value, !state.isGeneral, null);
      newsLetterState = { isBaby: !state.isBaby };
      break;
    case newsLetter.extendedSize:
      me.props.setNewsLetter(value, !state.isGeneral, null);
      newsLetterState = { isExtendedSize: !state.isExtendedSize };
      break;
    case newsLetter.smallSize:
      me.props.setNewsLetter(value, !state.isGeneral, null);
      newsLetterState = { isSmallSize: !state.isSmallSize };
      break;
    case newsLetter.onlineOrLimitedStore:
      me.props.setNewsLetter(value, !state.isGeneral, null);
      newsLetterState = { isOnlineOrLimitedStore: !state.isOnlineOrLimitedStore };
      break;
    case newsLetter.subscribeAll:
      const newsLetters = [
        newsLetter.general,
        newsLetter.men,
        newsLetter.women,
        newsLetter.kids,
        newsLetter.baby,
        newsLetter.extendedSize,
        newsLetter.smallSize,
        newsLetter.onlineOrLimitedStore,
      ];

      if (!state.subscribeAll) me.props.setNewsLetter(value, !state.subscribeAll, newsLetters);
      else me.props.setNewsLetter(value, !state.subscribeAll, newsLetters);
      newsLetterState = {
        isGeneral: !state.subscribeAll,
        isMen: !state.subscribeAll,
        isWomen: !state.subscribeAll,
        isKids: !state.subscribeAll,
        isBaby: !state.subscribeAll,
        isExtendedSize: !state.subscribeAll,
        isSmallSize: !state.subscribeAll,
        isOnlineOrLimitedStore: !state.subscribeAll,
        subscribeAll: !state.subscribeAll,
      };
      break;
    default:
      break;
  }
  me.setState(newsLetterState);
}
