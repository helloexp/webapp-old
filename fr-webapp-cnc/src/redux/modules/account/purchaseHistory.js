import { purchaseHistoryApi } from 'config/api';

export const PURCHASE_HISTORY_LOAD = 'accounts/PURCHASE_HISTORY_LOAD';
export const PURCHASE_HISTORY_LOAD_SUCCESS = 'accounts/PURCHASE_HISTORY_LOAD_S';
export const PURCHASE_HISTORY_LOAD_FAIL = 'accounts/PURCHASE_HISTORY_LOAD_FAIL_F';

const initialState = {
  purchaseHistoryList: [],
  loaded: false,
};

const promiseConfig = {
  host: `${purchaseHistoryApi.base}`,
  headers: {
    'Content-Type': 'text/plain',
  },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case PURCHASE_HISTORY_LOAD_SUCCESS:
      const sortedPurchaseList = action.result.transactions;
      let start;

      if (sortedPurchaseList.length > 0) {
        start = sortedPurchaseList[sortedPurchaseList.length - 1].br_rg_date_id;
      }

      return {
        ...state,
        purchaseHistoryList: [...state.purchaseHistoryList, ...sortedPurchaseList],
        loaded: true,
        totalCount: action.result.total_count,
        start,
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.purchaseHistory && globalState.purchaseHistory.loaded;
}

export function loadPurchaseHistory(viewCount) {
  return (dispatch, getState) => {
    const start = getState().purchaseHistory.start;

    const params = {
      count: viewCount,
    };

    if (start !== undefined) {
      params.start = start;
    }

    dispatch({
      types: [PURCHASE_HISTORY_LOAD, PURCHASE_HISTORY_LOAD_SUCCESS, PURCHASE_HISTORY_LOAD_FAIL],
      promise: client => client.get(purchaseHistoryApi.purchase, {
        ...promiseConfig,
        params,
        tokenType: 'accessToken',
      }),
      errorHandler: { enableReaction: true },
    });
  };
}
