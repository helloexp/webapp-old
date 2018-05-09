import React, { Component, PropTypes } from 'react';
import Button from 'components/Atoms/Button';
import Text from 'components/Atoms/Text';
import { redirect } from 'utils/routing';
import { connect } from 'react-redux';
import { toggleSection, loadAllSizes } from 'redux/modules/mySize';
import { getSizes, getLoaded, getSections } from 'redux/modules/mySize/selectors';
import cx from 'classnames';
import spacing from 'theme/spacing.scss';
import { routes } from 'utils/urlPatterns';
import sharedStyles from 'theme/shared.scss';
import ToMySize from '../Common/ToMySize';
import HeadingInfo from '../HeadingInfo';
import { navigateMySize } from '../utils';

const { object, func, bool, array } = PropTypes;

function goToView() {
  navigateMySize('view');
}

function goToAccount() {
  redirect(routes.memberInfo);
}

@connect(state => ({
  sizes: getSizes(state),
  loaded: getLoaded(state),
  sections: getSections(state),
}), {
  toggleSection,
  loadAll: loadAllSizes,
})
export default class CompleteMySize extends Component {
  static propTypes = {
    sizes: array,
    loaded: bool,
    sections: object,
    toggleSection: func,
    loadAll: func,
  };

  static contextTypes = {
    i18n: object,
    router: object,
  };

  componentDidMount() {
    this.props.loadAll();
    this.tileClassNames = cx(spacing.PTL, spacing.PHM, spacing.MBL, sharedStyles.tile);
  }

  toggleMySizeScreen = () => {
    this.props.toggleSection('toMySize');
  };

  render() {
    const {
      context: { i18n: { mySize: mySizeLabels } },
      props: { sizes, loaded },
    } = this;

    const length = Object.keys(sizes).length;
    const isToggleMySizeButtonShown = loaded && length < 10;

    return (
      <div className={cx(spacing.horizontalGap, spacing.PTL)}>
        <HeadingInfo text={mySizeLabels.headingComplete} className={spacing.MBL} isPageHeading />
        <div className={this.tileClassNames}>
          <Text className={spacing.MBL} type={Text.type.paragraph}>{mySizeLabels.completionMsg}</Text>
          <hr className={sharedStyles.hr} />
          <Button type={Button.type.arrowRight} onClick={goToView} className={spacing.PVSM}>
            <Text size={1}>{mySizeLabels.viewMySizes}</Text>
          </Button>
          { isToggleMySizeButtonShown && <hr className={sharedStyles.hr} /> }
          { isToggleMySizeButtonShown &&
            <Button type={Button.type.arrowRight} onClick={this.toggleMySizeScreen} className={spacing.PVSM}>
              <Text size={1}>{mySizeLabels.addNewUser}</Text>
            </Button>
          }
        </div>
        <div className={cx(sharedStyles.backgroundWhite, spacing.MBL)}>
          <Button type={Button.type.secondary} onClick={goToAccount}>{mySizeLabels.backToHome}</Button>
        </div>
        <ToMySize />
      </div>
    );
  }
}
