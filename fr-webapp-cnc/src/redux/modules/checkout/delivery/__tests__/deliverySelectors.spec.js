import expect from 'expect';
import { setTexts } from 'i18n';
import japanese from 'i18n/strings-ja';
import constants from 'config/site/default';
import * as selector from '../selectors';

const { deliveryTypes: { LAWSON, FM, SEJ, SHIPPING, YU_PACKET, YAMATO_MAIL, SAME_DAY, STORE_PICKUP }, defaultSplitNumber } = constants;

// Mock i18n texts
setTexts(japanese);

describe('redux/modules/checkout/delivery/selectors', () => {
  const address = {
    apt: '',
    birthday: '19830305',
    cellPhoneNumber: '',
    city: 'ときょ',
    email: 'komander@gmail.com',
    firstName: 'ぉきよ',
    firstNameKatakana: 'ォキヨ',
    gender: '01',
    isDefaultShippingAddress: true,
    lastName: 'こまんでる',
    lastNameKatakana: 'コマンデル',
    phoneNumber: '123343431',
    postalCode: '1520021',
    prefecture: '青森県',
    street: 'あかさか',
    streetNumber: 'あかさか',
  };

  const stateShipping = {
    delivery: {
      deliveryMethod: [{
        deliveryType: SHIPPING,
        deliveryReqDate: '20161201',
        deliveryReqTime: '04',
        splitNo: '1',
      }],
      currentShippingAddress: {
        ...address,
      },
    },
    userInfo: {},
  };

  const stateYuPacket = {
    delivery: {
      deliveryMethod: [{
        deliveryType: YU_PACKET,
        splitNo: '1',
      }],
      isFromAddressBook: true,
      currentShippingAddress: {},
    },
    userInfo: {
      userDefaultDetails: {
        ...address,
      },
    },
  };

  const stateSameDay = {
    delivery: {
      deliveryMethod: [{
        deliveryType: SAME_DAY,
        splitNo: '1',
      }],
      isFromAddressBook: true,
    },
    userInfo: {
      userDefaultDetails: {},
    },
  };

  const stateYamato = {
    delivery: {
      deliveryMethod: [{
        deliveryType: YAMATO_MAIL,
        splitNo: '1',
      }],
    },
  };

  const stateSEJ = {
    delivery: {
      deliveryMethod: [{
        deliveryType: SEJ,
        splitNo: '1',
      }],
    },
  };

  const stateLW = {
    delivery: {
      deliveryMethod: [{
        deliveryType: LAWSON,
        splitNo: '1',
      }],
    },
  };

  const stateFM = {
    delivery: {
      deliveryMethod: [{
        deliveryType: FM,
        splitNo: '1',
      }],
    },
  };

  const stateUniqlo = {
    delivery: {
      deliveryMethod: [{
        deliveryType: STORE_PICKUP,
        splitNo: '1',
      }],
    },
  };

  const cvsStoreSample = (storeType, storeTypeApplied) => ({
    delivery: {
      deliveryMethod: {
        deliveryType: storeType,
      },
      deliveryTypeApplied: storeTypeApplied,
      deliveryTypes: [
        SEJ,
        FM,
        LAWSON,
      ],
      deliveryMethodList: {
        1: {
          C: {
            deliveryDetails: [
              {
                deliveryType: SEJ,
                plannedDateFrom: '20161202000000',
                plannedDateTo: '20161205000000',
                plannedTime: '10',
                limitDateTime: '20161205233000',
                spareDate: '0',
              },
              {
                deliveryType: LAWSON,
                plannedDateFrom: '20161202000000',
                plannedDateTo: '20161205000000',
                plannedTime: '10',
                limitDateTime: '20161205233000',
                spareDate: '0',
              },
              {
                deliveryType: FM,
                plannedDateFrom: '20161202000000',
                plannedDateTo: '20161205000000',
                plannedTime: '10',
                limitDateTime: '20161205233000',
                spareDate: '0',
              },
            ],
          },
        },
      },
    },
  });

  const splitStoreSample = {
    delivery: {
      deliveryMethodList: {
        1: {
          C: {
            deliveryTypes: ['5'],
          },
          S: {
            deliveryTypes: ['5'],
          },
        },
        2: {
          S: {
            deliveryTypes: ['5'],
          },
        },
      },
      updatedDeliveryMethodList: {
        1: {
          C: {
            deliveryRequestedDateTimes: [],
          },
          S: {
            deliveryRequestedDateTimes: [],
          },
        },
        2: {
          S: {
            deliveryRequestedDateTimes: [],
          },
        },
      },
      nextDateOptions: {
        1: {
          C: false,
          S: false,
        },
        2: {
          S: false,
        },
      },
      splitDetails: {
        1: {
          split_no: 1,
          cartItemsSeqNo: [
            '1',
          ],
        },
        2: {
          split_no: 2,
          cartItemsSeqNo: [
            '2',
          ],
        },
      },
      splitCount: 2,
    },
  };
  const cartSample = {
    cart: {
      uq: {
        items: [
          {
            seqNo: '1',
          },
          {
            seqNo: '2',
          },
        ],
      },
    },
  };

  const routingSample = {
    routing: {
      locationBeforeTransitions: {
        query: {
          brand: 'uq',
        },

      },
    },
  };

  it('should return true if the current selected type is shipping', () => {
    expect(selector.isShipping(stateShipping, { splitNo: '1' })).toBe(true);
    expect(selector.isShipping(stateYuPacket, { splitNo: '1' })).toBe(true);
    expect(selector.isShipping(stateSameDay, { splitNo: '1' })).toBe(true);
    expect(selector.isShipping(stateYamato, { splitNo: '1' })).toBe(true);
  });

  it('should return false if the current selected type is cvs or uniqlo', () => {
    expect(selector.isShipping(stateSEJ)).toBe(false);
    expect(selector.isShipping(stateLW)).toBe(false);
    expect(selector.isShipping(stateFM)).toBe(false);
    expect(selector.isShipping(stateUniqlo)).toBe(false);
  });

  it('should return the current delivery method', () => {
    expect(selector.getDeliveryMethod(stateShipping)).toBe(stateShipping.delivery.deliveryMethod);
  });

  it('should return the current shipping address', () => {
    expect(selector.getCurrentShippingAddress(stateShipping)).toBe(stateShipping.delivery.currentShippingAddress);
  });

  it('should return the default address from account platform', () => {
    expect(selector.getDefaultAddress(stateYuPacket)).toBe(stateYuPacket.userInfo.userDefaultDetails);
  });

  it('should return true if delivery type is selected', () => {
    expect(selector.isDeliveryTypeSelected(stateShipping)).toBe(true);
    expect(selector.isDeliveryTypeSelected(stateYuPacket)).toBe(true);
    expect(selector.isDeliveryTypeSelected(stateSameDay)).toBe(true);
    expect(selector.isDeliveryTypeSelected(stateYamato)).toBe(true);
    expect(selector.isDeliveryTypeSelected(stateSEJ)).toBe(true);
    expect(selector.isDeliveryTypeSelected(stateLW)).toBe(true);
    expect(selector.isDeliveryTypeSelected(stateFM)).toBe(true);
    expect(selector.isDeliveryTypeSelected(stateUniqlo)).toBe(true);
  });

  it('should return true if the user is a returned user', () => {
    expect(selector.isReturnedUser(stateShipping)).toBe(true);
  });

  it('should return false if the user is not a returned user', () => {
    expect(selector.isReturnedUser(stateYuPacket)).toBe(false);
  });

  it('should return true if the default address from account platform is valid', () => {
    expect(selector.isDefaultAddressValid(stateYuPacket)).toBe(true);
  });

  it('should return false if the default address from account platform is not valid', () => {
    expect(selector.isDefaultAddressValid(stateSameDay)).toBe(false);
  });

  it('should return address panel delivery description if and only if its CVS delivery type is selected', () => {
    expect(selector.getCvsAddressDeliveryDescription(cvsStoreSample(FM, SEJ), {})).toContain('2016/12/02(金)');
    expect(selector.getCvsAddressDeliveryDescription(cvsStoreSample(FM, SEJ), {})).toContain('2016/12/05(月)');
    expect(selector.getCvsAddressDeliveryDescription(cvsStoreSample(FM, STORE_PICKUP), {})).toEqual('');
  });

  it('should return delivery method list for group delivery', () => {
    const storeSample = (cvsStoreSample('', ''));
    const expectedResult = storeSample.delivery.deliveryMethodList[1].C;

    expect(selector.getDeliveryMethodListOfDiv(storeSample, defaultSplitNumber)).toEqual(expectedResult);
  });

  it('should return delivery method list for split delivery', () => {
    const expectedResult = splitStoreSample.delivery.deliveryMethodList[2].S;

    expect(selector.getDeliveryMethodListOfDiv(splitStoreSample, { splitNo: 2 })).toEqual(expectedResult);
  });

  it('should return true if standard delivery selected', () => {
    const storeSample = {
      ...splitStoreSample,
      delivery: {
        ...splitStoreSample.delivery,
        deliveryPreference: 'C',
      },
    };

    expect(selector.isGroupDeliverySelected(storeSample)).toEqual(true);
  });

  it('should return true if split delivery selected', () => {
    const storeSample = {
      ...splitStoreSample,
      delivery: {
        ...splitStoreSample.delivery,
        deliveryPreference: 'S',
      },
    };

    expect(selector.isSplitDeliverySelected(storeSample)).toEqual(true);
  });

  it('should return delivery standard as true for split delivery', () => {
    const storeSample = {
      ...splitStoreSample,
      delivery: {
        ...splitStoreSample.delivery,
        deliveryStandard: {
          1: {
            S: true,
          },
          2: {
            S: true,
          },
        },
      },
    };

    expect(selector.getStandardDeliveryOfDiv(storeSample, { splitNo: 2 })).toEqual(true);
  });

  it('should return delivery standard as true for group delivery', () => {
    const storeSample = {
      ...splitStoreSample,
      delivery: {
        ...splitStoreSample.delivery,
        deliveryStandard: {
          1: {
            C: true,
          },
        },
      },
    };

    expect(selector.getStandardDeliveryOfDiv(storeSample)).toEqual(true);
  });

  it('should return delivery method for group delivery', () => {
    const storeSample = {
      ...splitStoreSample,
      delivery: {
        ...splitStoreSample.delivery,
        deliveryMethod: [
          {
            0: {
              splitNo: '1',
              deliveryType: '5',
              deliveryReqDate: '',
              deliveryReqTime: '',
            },
          },
        ],
      },
    };
    const expectedResult = storeSample.delivery.deliveryMethod[0];

    expect(selector.getDeliveryMethodOfDiv(storeSample)).toEqual(expectedResult);
  });

  it('should return delivery method for split delivery', () => {
    const storeSample = {
      ...splitStoreSample,
      delivery: {
        ...splitStoreSample.delivery,
        deliveryMethod: [
          {
            splitNo: '1',
            deliveryType: '5',
            deliveryReqDate: '',
            deliveryReqTime: '',
          },
          {
            splitNo: '2',
            deliveryType: '5',
            deliveryReqDate: '',
            deliveryReqTime: '',
          },
        ],
      },
    };
    const expectedResult = storeSample.delivery.deliveryMethod[1];

    expect(selector.getDeliveryMethodOfDiv(storeSample, { splitNo: '2' })).toEqual(expectedResult);
  });

  it('should return updated delivery method list for split delivery', () => {
    const expectedResult = splitStoreSample.delivery.updatedDeliveryMethodList[2].S;

    expect(selector.getUpdatedDeliveryMethodListOfDiv(splitStoreSample, { splitNo: 2 })).toEqual(expectedResult);
  });

  it('should return updated delivery method list for group delivery', () => {
    const expectedResult = splitStoreSample.delivery.updatedDeliveryMethodList[1].C;

    expect(selector.getUpdatedDeliveryMethodListOfDiv(splitStoreSample)).toEqual(expectedResult);
  });

  it('should return split details of group delivery', () => {
    const expectedResult = splitStoreSample.delivery.splitDetails[1];

    expect(selector.getSplitDetailsOfDiv(splitStoreSample)).toEqual(expectedResult);
  });

  it('should return split details of split delivery', () => {
    const expectedResult = splitStoreSample.delivery.splitDetails[2];

    expect(selector.getSplitDetailsOfDiv(splitStoreSample, { splitNo: '2' })).toEqual(expectedResult);
  });

  it('should return item details for the provided split number', () => {
    const storeSample = { ...splitStoreSample, ...cartSample, ...routingSample };
    const expectedResult = [cartSample.cart.uq.items[1]];

    expect(selector.getItems(storeSample, { splitNo: '2' })).toEqual(expectedResult);
  });

  it('should return null if group delivery is selected', () => {
    const storeSample = { ...splitStoreSample, ...cartSample, ...routingSample };

    expect(selector.getItems(storeSample)).toEqual([]);
  });

  it('should return next date option of group delivery', () => {
    const expectedResult = splitStoreSample.delivery.nextDateOptions[1].C;

    expect(selector.getNextDateOption(splitStoreSample)).toEqual(expectedResult);
  });

  it('should return next date option of split delivery', () => {
    const expectedResult = splitStoreSample.delivery.nextDateOptions[2].S;

    expect(selector.getNextDateOption(splitStoreSample, { splitNo: 2 })).toEqual(expectedResult);
  });

  it('should return delivery date time list if next day option set to true for standard delivery', () => {
    const expectedResult = splitStoreSample.delivery.nextDateOptions[1].C;

    expect(selector.getDeliveryDateTimeListForOption(splitStoreSample, { nextDateOptionSelected: true })).toEqual(expectedResult);
  });

  it('should return delivery date time list if next day option set to true for split delivery ', () => {
    const expectedResult = splitStoreSample.delivery.nextDateOptions[2].S;
    const props = {
      splitNo: 2,
      nextDateOptionSelected: true,
    };

    expect(selector.getDeliveryDateTimeListForOption(splitStoreSample, props)).toEqual(expectedResult);
  });

  it('should return delivery date time list if next day option set to false for standard delivery', () => {
    const expectedResult = splitStoreSample.delivery.updatedDeliveryMethodList[1].C.deliveryRequestedDateTimes;

    expect(selector.getDeliveryDateTimeListForOption(splitStoreSample, { nextDateOptionSelected: false })).toEqual(expectedResult);
  });

  it('should return delivery date time list if next day option set to false for split delivery ', () => {
    const expectedResult = splitStoreSample.delivery.updatedDeliveryMethodList[2].S.deliveryRequestedDateTimes;
    const props = {
      splitNo: 2,
      nextDateOptionSelected: false,
    };

    expect(selector.getDeliveryDateTimeListForOption(splitStoreSample, props)).toEqual(expectedResult);
  });

  it('should return true if standard delivery is available for standard delivery', () => {
    const storeSample = {
      delivery: {
        deliveryMethodList: {
          1: {
            C: {
              deliveryTypes: [SHIPPING],
            },
          },
        },
      },
    };

    expect(selector.isStandardDeliveryAvailable(storeSample)).toEqual(true);
  });

  it('should return true if standard delivery is available for split delivery', () => {
    const storeSample = {
      delivery: {
        deliveryMethodList: {
          2: {
            S: {
              deliveryTypes: [SHIPPING],
            },
          },
        },
      },
    };

    expect(selector.isStandardDeliveryAvailable(storeSample, { splitNo: 2 })).toEqual(true);
  });

  it('should return true if custom time frame is available for standard delivery', () => {
    const storeSample = {
      delivery: {
        deliveryMethodList: {
          1: {
            C: {
              deliveryRequestedDateTimes: [{}],
              deliveryTypes: [SHIPPING],
            },
          },
        },
      },
    };

    expect(selector.isStandardDeliveryAvailable(storeSample)).toEqual(true);
  });

  it('should return true if delivery type is CVS', () => {
    expect(selector.isDeliveryTypeCvs(stateSEJ)).toEqual(true);
  });

  it('should return false if delivery type is not CVS', () => {
    expect(selector.isDeliveryTypeCvs(stateSameDay)).toEqual(false);
  });

  it('should return true if delivery method is valid for group delivery', () => {
    const storeSample = {
      delivery: {
        ...splitStoreSample.delivery,
        deliveryPreference: 'C',
        deliveryMethod: [
          {
            splitNo: '1',
            deliveryType: '5',
            deliveryReqDate: '',
            deliveryReqTime: '',
          },
        ],
        deliveryStandard: {
          1: {
            C: true,
          },
        },
      },
    };

    expect(selector.checkIfAllDeliveryMethodsValid(storeSample)).toEqual(true);
  });

  it('should return true if delivery methods are valid for split delivery', () => {
    const storeSample = {
      delivery: {
        ...splitStoreSample.delivery,
        deliveryPreference: 'S',
        deliveryMethod: [
          {
            splitNo: '1',
            deliveryType: '5',
            deliveryReqDate: '',
            deliveryReqTime: '',
          },
          {
            splitNo: '2',
            deliveryType: '5',
            deliveryReqDate: '',
            deliveryReqTime: '',
          },
        ],
        deliveryStandard: {
          1: {
            S: true,
          },
          2: {
            S: true,
          },
        },
      },
    };

    expect(selector.checkIfAllDeliveryMethodsValid(storeSample)).toEqual(true);
  });

  it('Should return split details of the provided split number', () => {
    const expectedResult = splitStoreSample.delivery.splitDetails[2];

    expect(selector.getSplitDetailsOfDiv(splitStoreSample, { splitNo: '2' })).toEqual(expectedResult);
  });

  it('Should return the delivery method type for group delivery', () => {
    const storeSample = {
      delivery: {
        deliveryMethod: [
          {
            splitNo: '1',
            deliveryType: '5',
            deliveryReqDate: '',
            deliveryReqTime: '',
          },
        ],
      },
    };
    const expectedResult = storeSample.delivery.deliveryMethod[0].deliveryType;

    expect(selector.getDeliveryMethodType(storeSample)).toEqual(expectedResult);
  });

  it('Should return the delivery method type for split delivery', () => {
    const storeSample = {
      delivery: {
        deliveryMethod: [
          {
            splitNo: '1',
            deliveryType: '5',
            deliveryReqDate: '',
            deliveryReqTime: '',
          },
          {
            splitNo: '2',
            deliveryType: '5',
            deliveryReqDate: '',
            deliveryReqTime: '',
          },
        ],
      },
    };
    const expectedResult = storeSample.delivery.deliveryMethod[1].deliveryType;

    expect(selector.getDeliveryMethodType(storeSample, { splitNo: '2' })).toEqual(expectedResult);
  });

  it('Should return the delivery types for group delivery', () => {
    const expectedResult = splitStoreSample.delivery.deliveryMethodList[1].C.deliveryTypes;

    expect(selector.getDeliveryTypesOfDiv(splitStoreSample)).toEqual(expectedResult);
  });

  it('Should return the delivery types for split delivery', () => {
    const expectedResult = splitStoreSample.delivery.deliveryMethodList[2].S.deliveryTypes;

    expect(selector.getDeliveryTypesOfDiv(splitStoreSample, { splitNo: '2' })).toEqual(expectedResult);
  });

  it('Should return true if standard delivery is available', () => {
    const storeSample = {
      delivery: {
        deliveryMethodList: {
          1: {
            C: {
              deliveryTypes: [SHIPPING],
            },
          },
          2: {
            S: {
              deliveryTypes: [SHIPPING],
            },
          },
        },
      },
    };

    expect(selector.isStandardDeliveryAvailable(storeSample)).toEqual(true);
    expect(selector.isStandardDeliveryAvailable(storeSample, { splitNo: 2 })).toEqual(true);
  });

  it('Should return false if standard delivery is not available', () => {
    const storeSample = {
      delivery: {
        deliveryMethodList: {
          1: {
            C: {
              deliveryTypes: [SEJ],
            },
          },
          2: {
            S: {
              deliveryTypes: [SEJ],
            },
          },
        },
      },
    };

    expect(selector.isStandardDeliveryAvailable(storeSample)).toEqual(false);
    expect(selector.isStandardDeliveryAvailable(storeSample, { splitNo: 2 })).toEqual(false);
  });

  it('Should return true if custom time frame is available', () => {
    const storeSample = {
      delivery: {
        deliveryMethodList: {
          1: {
            C: {
              deliveryTypes: [SHIPPING],
              deliveryRequestedDateTimes: [{}],
            },
          },
          2: {
            S: {
              deliveryTypes: [SHIPPING],
              deliveryRequestedDateTimes: [{}],
            },
          },
        },
      },
    };

    expect(selector.isCustomTimeFrameAvailable(storeSample)).toEqual(true);
    expect(selector.isCustomTimeFrameAvailable(storeSample, { splitNo: 2 })).toEqual(true);
  });

  it('Should return false if custom time frame is not available', () => {
    const storeSample = {
      delivery: {
        deliveryMethodList: {
          1: {
            C: {
              deliveryTypes: [SHIPPING],
              deliveryRequestedDateTimes: [],
            },
          },
          2: {
            S: {
              deliveryTypes: [SHIPPING],
              deliveryRequestedDateTimes: [],
            },
          },
        },
      },
    };

    expect(selector.isCustomTimeFrameAvailable(storeSample)).toEqual(false);
    expect(selector.isCustomTimeFrameAvailable(storeSample, { splitNo: 2 })).toEqual(false);
  });
});
