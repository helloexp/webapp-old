import expect from 'expect';
import {
  ALLOW_LOCATION_ACCESS,
  SET_CURRENT_LOCATION,
  STORES_LOAD_SUCCESS,
  STORES_LOAD_MORE_SUCCESS,
} from '../store/actions';
import storeReducer from '../store/reducer';

describe('redux/modules/checkout/delivery/store-reducers', () => {
  const storeResponse1 = {
    baby_flag: 1,
    distance: '8',
    kids_flag: 1,
    lat: '35.73022919',
    lon: '139.7155229',
    municipality: '豊島区',
    my_store_flag: 1,
    parking_flg: 0,
    store_id: 10101450,
    store_name: 'ユニクロ 池袋サンシャイン６０通り店',
    store_type_code: 1005,
    women_flg: 0,
  };
  const storeResponse2 = Object.assign({}, storeResponse1, { lat: '35.679987', lon: '139.770002' });
  const storeResponse3 = Object.assign({}, storeResponse1, { lat: '35.698765', lon: '139.773124' });

  const storeMapped1 = {
    id: 10101450,
    name: 'ユニクロ 池袋サンシャイン６０通り店',
    lat: '35.73022919',
    long: '139.7155229',
    distance: '8',
    babies: 1,
    kids: 1,
    parking: 0,
    news: 1,
    xl: true,
  };
  const storeMapped2 = { ...storeMapped1, lat: '35.679987', long: '139.770002' };
  const storeMapped3 = { ...storeMapped2, lat: '35.698765', long: '139.773124' };

  it('should set location access value', () => {
    expect(
      storeReducer(undefined, {
        type: ALLOW_LOCATION_ACCESS,
        allowGps: true,
      })
    ).toMatch({
      allowGps: true,
      showConfirm: false,
    });
  });

  it('should set current location', () => {
    expect(
      storeReducer(undefined, {
        type: SET_CURRENT_LOCATION,
        lat: 1,
        long: 2,
      })
    ).toMatch({
      location: {
        lat: 1,
        long: 2,
      },
    });
  });

  it('should load the list of stores', () => {
    expect(
      storeReducer(undefined, {
        type: STORES_LOAD_SUCCESS,
        result: {
          result: {
            stores: [storeResponse1, storeResponse2, storeResponse3],
            total_count: 20,
          },
        },
      })
    ).toMatch({
      stores: [storeMapped1, storeMapped2, storeMapped3],
    });
  });

  it('should load more stores', () => {
    expect(
      storeReducer({
        stores: [storeMapped1],
      }, {
        type: STORES_LOAD_MORE_SUCCESS,
        result: {
          result: {
            stores: [storeResponse2, storeResponse3],
            total_count: 20,
          },
        },
      })
    ).toMatch({
      stores: [storeMapped1, storeMapped2, storeMapped3],
      storeTotal: 20,
    });
  });
});
