import React, { PureComponent, PropTypes } from 'react';
import { getCurrentHost } from 'utils/routing';
import Button from 'components/Atoms/Button';
import Select from 'components/Atoms/Select';
import Text from 'components/Atoms/Text';
import InfoToolTip from 'components/InfoToolTip';
import formValidator from 'components/FormValidator';
import RegularInput from 'components/Atoms/Input';
import Input from 'components/Atoms/field/Numeric';
import Link from 'components/Atoms/Link';
import InputGroup from 'components/Atoms/InputGroup';
import { connect } from 'react-redux';
import { toggleSection, edit, setSelectedValue, clearValues } from 'redux/modules/mySize';
import { getSelectedSize, getLoaded, isMySizeValid } from 'redux/modules/mySize/selectors';
import * as appActions from 'redux/modules/app';
import { asyncConnect } from 'redux-connect';
import HeadingInfo from '../HeadingInfo';
import About from '../Common/About';
import HowTo from '../Common/HowTo';
import PurchaseHistory from '../Common/PurchaseHistory';
import { navigateMySize, cupValues, cupUnderValues } from '../utils';
import styles from './styles.scss';

const { bool, func, object } = PropTypes;

@asyncConnect([{
  promise: ({ store: { dispatch }, params }) => (params.id ? dispatch(edit(params.id)) : Promise.resolve()),
}])
@connect(state => ({
  selected: getSelectedSize(state),
  loaded: getLoaded(state),
  valid: isMySizeValid(state),
}), {
  toggleSection,
  setValue: setSelectedValue,
  editSize: edit,
  toggleConfirmedNav: appActions.toggleConfirmedNav,
  toggleDirectNav: appActions.toggleDirectNav,
  clearMySizeValues: clearValues,
})
@formValidator
export default class CreateMySize extends PureComponent {
  static propTypes = {
    params: object,
    selected: object,
    loaded: bool,
    toggleSection: func,
    setValue: func,
    editSize: func,
    valid: bool,
    toggleConfirmedNav: func,
    toggleDirectNav: func,
    clearMySizeValues: func,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  constructor(props) {
    super(props);

    this.state = {};

    this.nudeSizeUrls = {
      aboutNude: '',
      topSizes: '',
      womenSizes: '',
      bottomSizes: '',
    };
  }

  componentWillMount() {
    const { config } = this.context;

    this.nudeSizeUrls = {
      aboutNude: config.mySize.aboutNude,
      topSizes: config.mySize.topSizes.replace('{%hostname}', getCurrentHost(true)),
      womenSizes: config.mySize.womenSizes.replace('{%hostname}', getCurrentHost(true)),
      bottomSizes: config.mySize.bottomSizes.replace('{%hostname}', getCurrentHost(true)),
    };
  }

  componentDidMount() {
    const { toggleConfirmedNav } = this.props;

    toggleConfirmedNav();
  }

  componentWillUnmount() {
    const { toggleDirectNav, clearMySizeValues } = this.props;
    const { doNotClear } = this.state;

    toggleDirectNav();

    if (!doNotClear) {
      clearMySizeValues();
    }
  }

  createChangeEvent(key) {
    return ((boundKey, event) => this.props.setValue(boundKey, event.target.value)).bind(this, key);
  }

  goToConfirm = () => {
    this.setState({
      doNotClear: true,
    });

    navigateMySize('confirm');
  };

  mySizeInfoToolTip() {
    const { i18n: { mySize: { aboutMySize: labels } } } = this.context;

    return (
      <InfoToolTip position="bottom">
        <div className={styles.mySizeInfoToolTip}>{labels.explanation}</div>
        <div>{labels.howToMeasure}</div>
        <Link to={this.nudeSizeUrls.aboutNude} className={styles.mySizeInfoLink}>
          {labels.howToMeasureLinkLabel}
        </Link>
        <div>
          <ul className={styles.mySizeInfoNoteList}>
            {labels.notes.map((note, index) => <li key={index}>{note}</li>)}
          </ul>
        </div>
      </InfoToolTip>
    );
  }

  render() {
    const { i18n: { mySize: mySizeLabels } } = this.context;
    const twoDigitsAndDecimalNumber = `2${mySizeLabels.validations.numbersOnly}`;
    const threeDigitsAndDecimalNumber = `3${mySizeLabels.validations.numbersOnly}`;

    const { selected, valid } = this.props;

    const unit = {
      centimeter: mySizeLabels.unitCm,
      kilo: mySizeLabels.unitKg,
    };

    return (
      <div>
        <div className={styles.container}>
          <HeadingInfo text={mySizeLabels.heading} infoToolTip={this.mySizeInfoToolTip()} className={styles.largeBottomMargin} isPageHeading />
          <div className={styles.tile}>
            <RegularInput
              className={styles.smallPlusMediumBottomMargin}
              value={selected.size_title}
              onChange={this.createChangeEvent('size_title')}
              placeholder={mySizeLabels.nameHint}
              validations={[{
                rule: 'required',
                errorMessage: mySizeLabels.validations.required,
              }, {
                rule: 'stringMaxLength',
                errorMessage: mySizeLabels.validations.maxLettersLength,
                params: 10,
              }]}
              maxLength={10}
            />
            <Link to={this.nudeSizeUrls.aboutNude} className={styles.nudeSizeLink}>{mySizeLabels.howToMeasure}</Link>
            <Text weight="bolder" className={styles.largeBottomMargin}>{mySizeLabels.basicSizesHeading}</Text>
            <InputGroup className={styles.largeBottomMargin}>
              <Input
                value={selected.height}
                onChange={this.createChangeEvent('height')}
                label={mySizeLabels.heightHint}
                unit={unit.centimeter}
                validations={[{ rule: 'decimalNumber', errorMessage: threeDigitsAndDecimalNumber }]}
              />
              <Input
                value={selected.weight}
                onChange={this.createChangeEvent('weight')}
                label={mySizeLabels.weightHint}
                unit={unit.kilo}
                validations={[{ rule: 'decimalNumber', errorMessage: threeDigitsAndDecimalNumber }]}
              />
            </InputGroup>
            <HeadingInfo text={mySizeLabels.topSizes} className={styles.largeBottomMargin} iconNavigation={this.nudeSizeUrls.topSizes} />
            <InputGroup className={styles.smallPlusMediumBottomMargin}>
              <Input
                value={selected.around_the_head}
                onChange={this.createChangeEvent('around_the_head')}
                label={mySizeLabels.head}
                unit={unit.centimeter}
                validations={[{ rule: 'decimalNumber', errorMessage: threeDigitsAndDecimalNumber }]}
              />
              <Input
                value={selected.around_the_neck}
                onChange={this.createChangeEvent('around_the_neck')}
                label={mySizeLabels.neck}
                unit={unit.centimeter}
                validations={[{ rule: 'decimalNumber', errorMessage: threeDigitsAndDecimalNumber }]}
              />
            </InputGroup>
            <InputGroup className={styles.smallPlusMediumBottomMargin}>
              <Input
                value={selected.shoulder_width}
                onChange={this.createChangeEvent('shoulder_width')}
                label={mySizeLabels.shoulder}
                unit={unit.centimeter}
                validations={[{ rule: 'decimalNumber', errorMessage: threeDigitsAndDecimalNumber }]}
              />
              <Input
                value={selected.dress_length}
                onChange={this.createChangeEvent('dress_length')}
                label={mySizeLabels.dressLength}
                unit={unit.centimeter}
                validations={[{ rule: 'decimalNumber', errorMessage: threeDigitsAndDecimalNumber }]}
              />
            </InputGroup>
            <InputGroup className={styles.smallPlusMediumBottomMargin}>
              <Input
                value={selected.sleeve}
                onChange={this.createChangeEvent('sleeve')}
                label={mySizeLabels.sleeve}
                unit={unit.centimeter}
                validations={[{ rule: 'decimalNumber', errorMessage: threeDigitsAndDecimalNumber }]}
              />
              <Input
                value={selected.sleeve_neck}
                onChange={this.createChangeEvent('sleeve_neck')}
                label={mySizeLabels.sleeveback}
                unit={unit.centimeter}
                validations={[{ rule: 'decimalNumber', errorMessage: threeDigitsAndDecimalNumber }]}
              />
            </InputGroup>
            <Input
              type="number"
              step="0.01"
              className={styles.largeBottomMargin}
              value={selected.bust_under}
              onChange={this.createChangeEvent('bust_under')}
              label={mySizeLabels.chest}
              unit={unit.centimeter}
              validations={[{ rule: 'decimalNumber', errorMessage: threeDigitsAndDecimalNumber }]}
            />
            <HeadingInfo text={mySizeLabels.womenSizes} className={styles.largeBottomMargin} iconNavigation={this.nudeSizeUrls.womenSizes} />
            <Input
              type="number"
              step="0.01"
              className={styles.smallPlusMediumBottomMargin}
              value={selected.bust}
              onChange={this.createChangeEvent('bust')}
              label={mySizeLabels.bust}
              unit={unit.centimeter}
              validations={[{ rule: 'decimalNumber', errorMessage: threeDigitsAndDecimalNumber }]}
            />
            <Input
              type="number"
              step="0.01"
              className={styles.smallPlusMediumBottomMargin}
              value={selected.bust_top}
              onChange={this.createChangeEvent('bust_top')}
              label={mySizeLabels.bustTop}
              unit={unit.centimeter}
              validations={[{ rule: 'decimalNumber', errorMessage: threeDigitsAndDecimalNumber }]}
            />
            <InputGroup className={styles.largeBottomMargin} label={mySizeLabels.cupSize}>
              <Select
                emptyOption
                values={cupValues}
                value={selected.cup}
                onChange={this.createChangeEvent('cup')}
              />
              <Select
                emptyOption
                values={cupUnderValues}
                value={selected.cup_int}
                onChange={this.createChangeEvent('cup_int')}
              />
            </InputGroup>
            <HeadingInfo text={mySizeLabels.bottomSizes} className={styles.largeBottomMargin} iconNavigation={this.nudeSizeUrls.bottomSizes} />
            <InputGroup className={styles.smallPlusMediumBottomMargin}>
              <Input
                value={selected.waist}
                onChange={this.createChangeEvent('waist')}
                label={mySizeLabels.waist}
                unit={unit.centimeter}
                validations={[{ rule: 'decimalNumber', errorMessage: threeDigitsAndDecimalNumber }]}
              />
              <Input
                value={selected.hip}
                onChange={this.createChangeEvent('hip')}
                label={mySizeLabels.hip}
                unit={unit.centimeter}
                validations={[{ rule: 'decimalNumber', errorMessage: threeDigitsAndDecimalNumber }]}
              />
            </InputGroup>
            <InputGroup className={styles.largeBottomMargin}>
              <Input
                value={selected.inseam}
                onChange={this.createChangeEvent('inseam')}
                label={mySizeLabels.rise}
                unit={unit.centimeter}
                validations={[{ rule: 'twoDigitsAndDecimalNumber', errorMessage: twoDigitsAndDecimalNumber }]}
              />
              <Input
                value={selected.foot}
                onChange={this.createChangeEvent('foot')}
                label={mySizeLabels.feetSize}
                unit={unit.centimeter}
                validations={[{ rule: 'twoDigitsAndDecimalNumber', errorMessage: twoDigitsAndDecimalNumber }]}
              />
            </InputGroup>
            <Button
              type={Button.type.default}
              disabled={!valid}
              onClick={this.goToConfirm}
              analyticsOn="Click"
              analyticsLabel="Next"
              analyticsCategory="Member Info"
            >
              {mySizeLabels.nextButton}
            </Button>
          </div>
        </div>
        <PurchaseHistory className={styles.largeBottomMargin} />
        <HowTo />
        <About />
      </div>
    );
  }
}
