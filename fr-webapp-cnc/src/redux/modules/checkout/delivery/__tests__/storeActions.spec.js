import expect from 'expect';
import * as actions from '../store/actions';

describe('redux/modules/checkout/delivery/store-actions', () => {
  it('setLocationAccess', () => {
    expect(actions.setLocationAccess('yes')).toEqual({
      type: actions.ALLOW_LOCATION_ACCESS,
      allowGps: true,
    });

    expect(actions.setLocationAccess('no')).toEqual({
      type: actions.ALLOW_LOCATION_ACCESS,
      allowGps: false,
    });
  });

  it('setCurrentLocation', () => {
    expect(actions.setCurrentLocation({ lat: 1, long: 2 }, false)).toEqual({
      type: actions.SET_CURRENT_LOCATION,
      lat: 1,
      long: 2,
      error: false,
      gpsAvailable: true,
    });
  });
});
