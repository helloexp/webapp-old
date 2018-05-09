import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import Button from 'components/Atoms/Button';
import Text from 'components/Atoms/Text';
import Accordion from 'components/uniqlo-ui/Accordion';
import cx from 'classnames';

import { redirect } from 'utils/routing';
import { routes } from 'utils/urlPatterns';

import {
  toggleSection,
  deleteSelectedSize,
} from 'redux/modules/mySize';
import {
  getSizes,
  getSections,
  checkIfAddNewUserButtonShown,
} from 'redux/modules/mySize/selectors';
import { MBL, MHM, MTL, PTL, PTE, PBL, PHM } from 'theme/spacing.scss';
import sharedStyles from 'theme/shared.scss';

import Size from './Size';
import HeadingInfo from '../HeadingInfo';

const { object, bool, func, array } = PropTypes;

function goToAccount() {
  redirect(routes.memberInfo);
}

@connect(state => ({
  sizes: getSizes(state),
  sections: getSections(state),
  isAddNewUserButtonShown: checkIfAddNewUserButtonShown(state),
}), {
  toggleSection,
  deleteSize: deleteSelectedSize,
})
export default class SizeList extends PureComponent {
  static propTypes = {
    sizes: array,
    toggleSection: func,
    toggleMySizeScreen: func,
    deleteSize: func,
    isAddNewUserButtonShown: bool,
  };

  static contextTypes = {
    i18n: object,
  };

  deleteSize = (selectedSize) => {
    this.props.toggleSection('confirmDelete', selectedSize);
  };

  toggleHowToSection = () => {
    this.props.toggleSection('howTo');
  };

  toggleMySizeScreen = () => {
    this.props.toggleSection('toMySize');
  };

  toggleAboutSection = () => {
    this.props.toggleSection('about');
  };

  render() {
    const {
      props: { sizes, isAddNewUserButtonShown },
      context: { i18n: { mySize: mySizeLabels } },
    } = this;

    sizes.reverse();

    return (
      <div className={cx(MHM, PTL)}>
        <HeadingInfo text={mySizeLabels.viewMySizes} iconNavigation={this.toggleAboutSection} className={MBL} isPageHeading />

        <div className={cx(PTE, PBL, PHM, MBL, sharedStyles.tile)}>
          <Accordion>
            { sizes.map((mySize, index) => (
              <Size
                key={index}
                size={mySize}
                toggleHowToSection={this.toggleHowToSection}
                deleteSize={this.deleteSize}
                index={index}
              />))
            }
          </Accordion>
          { isAddNewUserButtonShown && (
            <Button
              className={MTL}
              type={Button.type.arrowRight}
              onClick={this.toggleMySizeScreen}
              analyticsOn="Click"
              analyticsLabel="Register mysize"
              analyticsCategory="Member Info"
            >
              <Text size={1} weight="bolder">{mySizeLabels.addNewUser}</Text>
            </Button>
          )}
        </div>

        <div className={cx(sharedStyles.backgroundWhite, MBL)}>
          <Button type={Button.type.secondary} onClick={goToAccount}>{mySizeLabels.backToHome}</Button>
        </div>
      </div>
    );
  }
}
