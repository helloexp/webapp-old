import React, { PureComponent, PropTypes } from 'react';
import Grid from 'components/uniqlo-ui/core/Grid';
import GridCell from 'components/uniqlo-ui/core/GridCell';
import AccordionItem from 'components/uniqlo-ui/Accordion/AccordionItem';
import Button from 'components/Atoms/Button';
import Text from 'components/Atoms/Text';
import Link from 'components/Atoms/Link';
import cx from 'classnames';
import { MBS, MTZ, MBL } from 'theme/spacing.scss';
import sharedStyles from 'theme/shared.scss';
import HeadingInfo from '../HeadingInfo';
import { navigateMySize } from '../utils';
import styles from './Size.scss';

const { bool, object, number, func, string } = PropTypes;

const Definition = ({ hint, valueKey, savedSize }, { i18n }) => {
  const { mySize } = i18n;
  const value = savedSize && savedSize[valueKey];
  let unit;

  if (valueKey === 'cup') {
    unit = savedSize && savedSize.cup_int;
  } else if (valueKey === 'weight') {
    unit = mySize.unitKg;
  } else {
    unit = mySize.unitCm;
  }

  return (
    <div className={styles.definition}>
      <dt className={styles.definitionTerm}><Text type={Text.type.inline}>{mySize[hint]}</Text></dt>
      <dd className={styles.definitionData}>
        { value && parseInt(value, 10) !== 0
          ? <Text type={Text.type.inline} className={sharedStyles.colorText}>{`${value} ${unit}`}</Text>
          : <Text type={Text.type.inline} className={sharedStyles.colorTextGrey}>{mySize.notInputted}</Text>
        }
      </dd>
    </div>
  );
};

Definition.contextTypes = {
  i18n: object,
};

Definition.propTypes = {
  hint: string,
  valueKey: string,
  savedSize: object,
};

const SizeInner = ({ noEdit, size, edit }, { i18n }) => {
  const { mySize: mySizeLabels } = i18n;

  return (
    <div>
      <div className={cx(styles.editContainer, MBS)}>
        <Text weight="bolder">{mySizeLabels.basicSizesHeading}</Text>
        { !noEdit && (
          <Button
            type={Button.type.edit}
            onClick={edit}
            analyticsOn="Click"
            analyticsLabel="Change mysize info"
            analyticsCategory="Member Info"
          >
            <Text size={-1} weight="bolder" className={cx(sharedStyles.textUnderline, sharedStyles.colorText)}>{mySizeLabels.accept}</Text>
          </Button>
        )}
      </div>
      <dl className={cx(MTZ, MBL)}>
        <Definition hint="heightHint" valueKey="height" savedSize={size} />
        <Definition hint="weightHint" valueKey="weight" savedSize={size} />
      </dl>
      <HeadingInfo text={mySizeLabels.topSizes} className={MBS} />
      <dl className={cx(MTZ, MBL)}>
        <Definition hint="head" valueKey="around_the_head" savedSize={size} />
        <Definition hint="neck" valueKey="around_the_neck" savedSize={size} />
        <Definition hint="shoulder" valueKey="shoulder_width" savedSize={size} />
        <Definition hint="dressLength" valueKey="dress_length" savedSize={size} />
        <Definition hint="sleeve" valueKey="sleeve" savedSize={size} />
        <Definition hint="sleeveback" valueKey="sleeve_neck" savedSize={size} />
        <Definition hint="chest" valueKey="bust_under" savedSize={size} />
      </dl>
      <HeadingInfo text={mySizeLabels.womenSizes} className={MBS} />
      <dl className={cx(MTZ, MBL)}>
        <Definition hint="bust" valueKey="bust" savedSize={size} />
        <Definition hint="bustTop" valueKey="bust_top" savedSize={size} />
        <Definition hint="braCupSize" valueKey="cup" savedSize={size} />
      </dl>
      <HeadingInfo text={mySizeLabels.bottomSizes} className={MBS} />
      <dl className={cx(MTZ, MBL)}>
        <Definition hint="waist" valueKey="waist" savedSize={size} />
        <Definition hint="hip" valueKey="hip" savedSize={size} />
        <Definition hint="rise" valueKey="inseam" savedSize={size} />
        <Definition hint="feetSize" valueKey="foot" savedSize={size} />
      </dl>
    </div>
  );
};

SizeInner.propTypes = {
  size: object,
  infoClickHandler: func,
  edit: func,
  noEdit: bool,
};

SizeInner.defaultProps = {
  noEdit: false,
};

SizeInner.contextTypes = {
  i18n: object,
};

export default class Size extends PureComponent {
  static propTypes = {
    size: object,
    index: number,
    toggleHowToSection: func,
    deleteSize: func,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  componentWillMount() {
    const { config } = this.context;

    this.nudeSizeUrls = {
      aboutNude: config.mySize.aboutNude,
    };
  }

  editSize = () => {
    navigateMySize(`edit/${this.props.size.size_id}`);
  };

  deleteSize = () => {
    this.props.deleteSize(this.props.size.size_id);
  };

  render() {
    const { size, toggleHowToSection, index } = this.props;
    const { i18n } = this.context;

    const { mySize: mySizeLabels } = i18n;
    const sizeId = size.size_id;
    const sizeTitle = size.size_title;

    if (!sizeId) {
      return null;
    }

    return (
      <AccordionItem
        key={index}
        expanded={index === 0}
        headingText={sizeTitle || mySizeLabels.heightHint}
      >
        <div>
          <Link to={this.nudeSizeUrls.aboutNude} className={styles.nudeSizeLink}>{mySizeLabels.howToMeasure}</Link>

          <SizeInner size={size} infoClickHandler={toggleHowToSection} edit={this.editSize} />
          <Grid cellPadding={0} className={styles.footer}>
            <GridCell className={styles.footerItem} colSpan={6}>
              <Button className={styles.editButton} type={Button.type.edit} onClick={this.editSize}>{mySizeLabels.accept}</Button>
            </GridCell>
            <GridCell className={`${styles.footerItem} ${styles.noBorder}`} colSpan={6}>
              <Button className={styles.deleteButton} onClick={this.deleteSize} />
            </GridCell>
          </Grid>
        </div>
      </AccordionItem>
    );
  }
}

export {
  SizeInner,
};
