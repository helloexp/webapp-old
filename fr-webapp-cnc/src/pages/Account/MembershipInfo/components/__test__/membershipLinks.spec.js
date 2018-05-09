import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-ja';
import MembershipLinks from '../MembershipLinks';

function mountItem(props = {}) {
  return testHelpers.mountWithAll(<MembershipLinks {...props} />);
}

describe('src/pages/Account/MembershipInfo/MembershipLinks', () => {
  let wrapper;

  describe('MembershipLinks - UQ Tab selected', () => {
    beforeEach(() => {
      wrapper = mountItem({ activeTab: 0 });
    });

    it('should render MembershipLinks', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render member address edit Link', () => {
      const memberEdit = wrapper.find('Link').first();

      expect(memberEdit.props().label).to.equal(i18n.membershipInfo.editMemberInfo);
    });

    it('should render UQ membership Links', () => {
      const links = wrapper.find('Link');

      expect(links.at(1).props().label).to.equal(i18n.membershipInfo.changeMySize);
      expect(links.at(3).props().label).to.equal(i18n.membershipInfo.editAddressBook);
      expect(links.at(5).props().label).to.equal(i18n.membershipInfo.changePassword);
      expect(links.at(6).props().label).to.equal(i18n.membershipInfo.changeCCInfo);
    });

    it('should render Withdrawal Link', () => {
      const withdrawal = wrapper.find('Link').at(8);

      expect(withdrawal.props().label).to.equal(i18n.membershipInfo.withdrawal);
    });
  });

  describe('MembershipLinks - GU Tab selected', () => {
    beforeEach(() => {
      wrapper = mountItem({ activeTab: 1 });
    });

    it('should render GU membership Links', () => {
      const links = wrapper.find('Link');

      expect(links.at(1).props().label).to.equal(i18n.membershipInfo.editAddressBook);
      expect(links.at(3).props().label).to.equal(i18n.membershipInfo.changePassword);
      expect(links.at(4).props().label).to.equal(i18n.membershipInfo.changeCCInfo);
    });
  });
});
