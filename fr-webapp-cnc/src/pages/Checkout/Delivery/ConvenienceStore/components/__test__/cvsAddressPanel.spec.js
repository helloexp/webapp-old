import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import CVSAddressPanel from '../CVSAddressPanel';

describe('CVSAddressPanel component', () => {
  const CVSState = {
    userInfo: {
      cvsAddress: {
        sevenEleven: {
          addressNumber: '998',
          apt: 'ローソン店舗受取',
          firstName: '盛岡大通３丁目',
          lastName: 'ローソン',
          postalCode: '0200022',
          prefecture: '岩手県',
          street: '盛岡市大通３丁目２－８',
        },
        lawson: {
          addressNumber: '999',
          apt: 'ローソン店舗受取',
          firstName: '盛岡大通３丁目',
          lastName: 'ローソン',
          postalCode: '0200022',
          prefecture: '岩手県',
          street: '盛岡市大通３丁目２－9',
        },
        familyMart: {
          addressNumber: '997',
          apt: 'ローソン店舗受取',
          firstName: '盛岡大通３丁目',
          lastName: 'ローソン',
          postalCode: '0200022',
          prefecture: '岩手県',
          street: '盛岡市大通３丁目２－10',
        },
      },
    },
  };

  const CVSStateWithDeliveryTime = {
    ...CVSState,
    delivery: {
      deliveryMethod: {
        deliveryType: '15',
      },
      deliveryTypeApplied: '15',
      deliveryMethodList: {
        deliveryDetails: [
          {
            deliveryType: '15',
            limitDatetime: '20161121201245',
            plannedDateFrom: '20161205000000',
            plannedDateTo: '20161111000000',
            plannedTime: '0',
            spareDate: '0',
          },
          {
            deliveryType: '18',
            limitDatetime: '20161121201245',
            plannedDateFrom: '20161206000000',
            plannedDateTo: '20161112000000',
            plannedTime: '15',
            spareDate: '0',
          },
          {
            deliveryType: '13',
            limitDatetime: '20161121201245',
            plannedDateFrom: '20161207000000',
            plannedDateTo: '20161112000000',
            plannedTime: '15',
            spareDate: '0',
          },
        ],
      },
    },
  };

  const { delivery: {
    familyMart,
    lawsonMinistop,
    sevenEleven,
  },
} = i18n;

  it('should render CVSAddressPanel component', () => {
    const wrapper = testHelpers.mountWithAll(<CVSAddressPanel />, CVSState);

    expect(wrapper.length).to.equal(1);
  });

  it('should display 3 CVSAddressPanel Containers', () => {
    const wrapper = testHelpers.mountWithAll(<CVSAddressPanel />, CVSState);
    const body = wrapper.find('Container');

    expect(body.length).to.equal(3);
  });

  it('should display address title text', () => {
    const wrapper = testHelpers.mountWithAll(<CVSAddressPanel cvsBrand="sevenEleven" />, CVSState);
    const titleText = wrapper.find('Text').props().children;

    expect(titleText).to.equal(sevenEleven);
  });

  it('should display lead time for SevenEleven', () => {
    const wrapper = testHelpers.mountWithAll(
      <CVSAddressPanel cvsBrand="sevenEleven" arrivesAt="as soon as possible" showAddress />,
      CVSStateWithDeliveryTime
    );
    const addressLines = wrapper.find('Container').at(2).text();

    expect(addressLines).to.equal(`${sevenEleven}盛岡大通３丁目〒0200022岩手県盛岡市大通３丁目２－８お届けの目安：as soon as possible`);
  });

  it('should display lead time for FamilyMart', () => {
    CVSStateWithDeliveryTime.delivery.deliveryMethod.deliveryType = '18';
    CVSStateWithDeliveryTime.delivery.deliveryTypeApplied = '18';
    const wrapper = testHelpers.mountWithAll(
      <CVSAddressPanel cvsBrand="familyMart" arrivesAt="as soon as possible" showAddress />,
      CVSStateWithDeliveryTime
    );
    const addressLines = wrapper.find('Container').at(2).text();

    expect(addressLines).to.equal(`${familyMart}盛岡大通３丁目〒0200022岩手県盛岡市大通３丁目２－10お届けの目安：as soon as possible`);
  });

  it('should display lead time for Lawson', () => {
    CVSStateWithDeliveryTime.delivery.deliveryMethod.deliveryType = '13';
    CVSStateWithDeliveryTime.delivery.deliveryTypeApplied = '13';
    const wrapper = testHelpers.mountWithAll(
      <CVSAddressPanel cvsBrand="lawson" arrivesAt="as soon as possible" showAddress />,
      CVSStateWithDeliveryTime
    );
    const addressLines = wrapper.find('Container').at(2).text();

    expect(addressLines).to.equal(
      `${lawsonMinistop}盛岡大通３丁目〒0200022岩手県盛岡市大通３丁目２－9お届けの目安：as soon as possible`
    );
  });
});
