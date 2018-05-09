
export function getStores(storesRaw) {
  return storesRaw && storesRaw.map(store => ({
    id: store.store_id,
    name: store.store_name,
    lat: store.lat,
    long: store.lon,
    distance: store.distance,
    weekDayOpen: store.wd_open_at,
    weekDayClose: store.wd_close_at,
    weekendOpen: store.we_open_at,
    weekendClose: store.we_close_at,
    holidayOpen: store.hol_open_at,
    holidayClose: store.hol_close_at,
    prefecture: store.area0_name,
    municipality: store.municipality,
    city: store.area1_name,
    number: store.number,
    irregularOpenHours: store.open_hours,
    closedDates: store.store_holiday,

    // Feature Flags
    babies: store.baby_flag,
    kids: store.kids_flag,
    parking: store.parking_flg,
    news: store.my_store_flag,
    xl: store.store_type_code === 1005,
    large: store.store_type_code === 1001,
    storeDeliveryFlag: store.store_delivery_flg,
  })) || [];
}

export function getStoreDetail(store) {
  return {
    id: store.store_id,
    name: store.store_name,
    address: store.address,
    building: store.building,
    openHours: store.open_hours,
    Monday: {
      open: store.mon_open_at,
      close: store.mon_close_at,
    },
    Tuesday: {
      open: store.tue_open_at,
      close: store.tue_close_at,
    },
    Wednesday: {
      open: store.wed_open_at,
      close: store.wed_close_at,
    },
    Thursday: {
      open: store.thu_open_at,
      close: store.thu_close_at,
    },
    Friday: {
      open: store.fri_open_at,
      close: store.fri_close_at,
    },
    Saturday: {
      open: store.sat_open_at,
      close: store.sat_close_at,
    },
    Sunday: {
      open: store.sun_open_at,
      close: store.sun_close_at,
    },
    holidayOpen: store.hol_open_at || '0:00',
    holidayClose: store.hol_close_at || '0:00',
    weekDayOpen: store.wd_open_at || '0:00',
    weekDayClose: store.wd_close_at || '0:00',
    weekendOpen: store.we_open_at || '0:00',
    weekendClose: store.we_close_at || '0:00',
    closedDates: store.store_holiday,
    irregularOpenHours: store.open_hours,
    g1StoreId: store.g1_ims_store_id_6,
    municipality: store.municipality,
    city: store.area1_name,
    lat: store.lat,
    long: store.lon,
    prefecture: store.area0_name,
    number: store.number,
    babies: store.baby_flag,
    kids: store.kids_flag,
    parking: store.parking_flg,
    news: store.my_store_flag,
    xl: store.store_type_code === 1005,
    large: store.store_type_code === 1001,
    storeDeliveryFlag: store.store_delivery_flg,
    // for GA
    imsStoreId4: store.g1_ims_store_id_4,
    clickAndCollectFlag: store.click_and_collect_flg,
  };
}
