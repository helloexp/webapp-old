import { collectionsApi } from 'config/api';
import { constantsGenerator } from 'utils';
import { getTranslation } from 'i18n';
import { pushAPIErrorMessage } from 'redux/modules/errorHandler';

const generateConstants = constantsGenerator('mySize');
const mySizeUrl = collectionsApi.mysize;

const {
  LOAD,
  LOAD_SUCCESS,
  LOAD_FAIL,
} = generateConstants('LOAD');

const {
  LOAD_ALL,
  LOAD_ALL_SUCCESS,
  LOAD_ALL_FAIL,
} = generateConstants('LOAD_ALL');

const {
  SAVE,
  SAVE_SUCCESS,
  SAVE_FAIL,
} = generateConstants('SAVE');

const {
  LOAD_PURCHASE,
  LOAD_PURCHASE_SUCCESS,
  LOAD_PURCHASE_FAIL,
} = generateConstants('LOAD_PURCHASE');

const {
  DELETE,
  DELETE_SUCCESS,
  DELETE_FAIL,
} = generateConstants('DELETE');

const {
  UPDATE,
  UPDATE_SUCCESS,
  UPDATE_FAIL,
} = generateConstants('UPDATE');

const TOGGLE_SECTION = 'mySize/TOGGLE_SECTION';
const SET_SELECTED_VALUE = 'mySize/SET_SELECTED_VALUE';
const EDIT = 'mySize/EDIT';
const CLEAR_VALUES = 'mySize/CLEAR_VALUES';

const collectionsHost = `${collectionsApi.base}/${collectionsApi.brand}/${collectionsApi.region}`;

function normalizeForApi(data) {
  const keys = Object.keys(data);
  const normalizedData = {};

  keys.forEach((key) => {
    if (key !== 'cup' && key !== 'size_title') {
      const number = parseFloat(data[key]);

      normalizedData[key] = isNaN(number) ? 0 : number;
    } else {
      normalizedData[key] = data[key];
    }
  });

  return normalizedData;
}

function normalizeForUI(data = []) {
  let ln = data.length;
  const normalizedData = [];

  while (ln--) {
    const mySizeItem = data[ln];
    const keys = Object.keys(mySizeItem);
    const normalizedDataItem = {};

    keys.forEach((key) => {
      if (key !== 'cup' && key !== 'size_title' && key !== 'size_id') {
        const number = parseFloat(mySizeItem[key]);

        normalizedDataItem[key] = isNaN(number) || number === 0
          ? ''
          : number.toFixed(number % 1 === 0 ? 0 : 1);
      } else {
        normalizedDataItem[key] = mySizeItem[key];
      }
    });

    normalizedData.push(normalizedDataItem);
  }

  return normalizedData;
}

const defaultState = {
  sizes: [],
  sections: {
    about: false,
    howTo: false,
    create: true,
    toMySize: false,
    confirmDelete: false,
  },
  transactions: [],
  selected: {
    size_title: '',
    size_id: '',
    height: '',
    weight: '',
    around_the_head: '',
    around_the_neck: '',
    shoulder_width: '',
    dress_length: '',
    sleeve: '',
    sleeve_neck: '',
    bust_under: '',
    bust: '',
    bust_top: '',
    cup: '',
    cup_int: '',
    waist: '',
    hip: '',
    inseam: '',
    foot: '',
  },
  loaded: false,
};

function getMySize(size) {
  const newSize = {};

  Object.keys(defaultState.selected).forEach((key) => {
    newSize[key] = size[key];
  });

  newSize.size_id = size.size_id;

  return newSize;
}

export default function mySize(state = defaultState, action = {}) {
  switch (action.type) {
    case LOAD_ALL:
    case UPDATE:
    case LOAD_PURCHASE:
      return {
        ...state,
        loaded: false,
      };

    case CLEAR_VALUES:
      return {
        ...state,
        selected: { ...defaultState.selected },
      };
    case EDIT:
      return {
        ...state,
        selected: getMySize(state.sizes[state.sizes.findIndex(size => size.size_id === action.sizeId)]),
      };

    case LOAD_SUCCESS:
      const loadedSizes = action.result[0].sizes;

      return {
        ...state,
        sizes: normalizeForUI(loadedSizes),
      };

    case LOAD_PURCHASE_SUCCESS: {
      return {
        ...state,
        loaded: true,
        transactions: { ...action.result },
      };
    }

    case LOAD_ALL_SUCCESS:
      const sizes = action.result.sizes || [];

      return {
        ...state,
        loaded: true,
        sizes: normalizeForUI(sizes),
      };

    case DELETE_SUCCESS:
      return {
        ...state,
        loaded: true,
        sections: {
          ...state.sections,
          confirmDelete: null,
        },
      };

    case UPDATE_SUCCESS:
    case SAVE_SUCCESS:
      return {
        ...state,
        sections: {
          ...state.sections,
          toMySize: false,
        },
        selected: { ...defaultState.selected },
      };

    case LOAD_ALL_FAIL:
    case SAVE_FAIL:
    case DELETE_FAIL:
    case UPDATE_FAIL:
    case LOAD_PURCHASE_FAIL: {
      return {
        ...state,
        loaded: true,
        error: action.error,
      };
    }

    case TOGGLE_SECTION:
      return {
        ...state,
        sections: {
          ...state.sections,
          [action.section]: action.value === undefined ? !state.sections[action.section] : action.value,
        },
      };

    case SET_SELECTED_VALUE:
      return {
        ...state,
        selected: {
          ...state.selected,
          [action.key]: action.value,
        },
      };

    default:
      return state;
  }
}

export function saveNewMySize(data) {
  return dispatch => dispatch({
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: client => client.post(mySizeUrl, {
      host: collectionsHost,
      data: normalizeForApi(data),
      tokenType: 'accesstoken',
    })
    .catch(() => {
      dispatch(pushAPIErrorMessage(getTranslation().mySize.confirmError, 'confirmSize'));

      return Promise.reject();
    }),
  });
}

export function loadAllSizes() {
  const promiseConfig = {
    host: collectionsHost,
    tokenType: 'accesstoken',
  };

  return {
    types: [LOAD_ALL, LOAD_ALL_SUCCESS, LOAD_ALL_FAIL],
    promise: client => client.get(mySizeUrl, { ...promiseConfig }),
    errorHandler: { enableReaction: true },
  };
}

export function deleteSelectedSize(sizeId) {
  const promiseConfig = {
    host: collectionsHost,
    tokenType: 'accesstoken',
  };

  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    promise: client => client.delete(`${mySizeUrl}/${sizeId}`, { ...promiseConfig }),
    errorHandler: { enableReaction: true },
  };
}

export function load(sizeId) {
  const promiseConfig = {
    host: collectionsHost,
    tokenType: 'accesstoken',
  };

  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: client => client.get(`${mySizeUrl}/${sizeId}`, {
      ...promiseConfig,
    }),
    errorHandler: { enableReaction: true },
  };
}

export function edit(sizeId, loaded) {
  return (dispatch, getState) => {
    const state = getState();

    if (!state.mySize.sizes[sizeId] && !loaded) {
      return dispatch(load(sizeId)).then(() => dispatch(edit(sizeId, true)));
    }

    return Promise.resolve(dispatch({
      type: EDIT,
      sizeId,
    }));
  };
}

export function updateSelectedSize(sizeId, editedData) {
  const promiseConfig = {
    host: collectionsHost,
    tokenType: 'accesstoken',
  };

  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    promise: client => client.put(`${mySizeUrl}/${sizeId}`, {
      ...promiseConfig,
      data: normalizeForApi(editedData),
    }),
    errorHandler: { enableReaction: true },
  };
}

export function toggleSection(section, value) {
  return {
    type: TOGGLE_SECTION,
    section,
    value,
  };
}

export function setSelectedValue(key, value) {
  return {
    type: SET_SELECTED_VALUE,
    key,
    value,
  };
}

export function clearValues() {
  return {
    type: CLEAR_VALUES,
  };
}
