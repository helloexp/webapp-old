import React, { Component, PropTypes } from 'react';
import Button from 'components/Atoms/Button';
import Text from 'components/Atoms/Text';
import If from 'components/uniqlo-ui/If';
import ErrorMessage from 'components/ErrorMessage';
import { connect } from 'react-redux';
import ErrorHandler from 'containers/ErrorHandler';
import { getSelectedSize } from 'redux/modules/mySize/selectors';
import { saveNewMySize, updateSelectedSize } from 'redux/modules/mySize';
import cx from 'classnames';
import { horizontalGap, MTL, PTL, PBL, PHM, MBL, MTM } from 'theme/spacing.scss';
import sharedStyles from 'theme/shared.scss';
import { SizeInner } from '../ViewMySize/Size';
import HeadingInfo from '../HeadingInfo';
import { navigateMySize } from '../utils';

const { func, object, string } = PropTypes;

function redirectToCompleted() {
  navigateMySize('complete');
}

function redirectToCreate() {
  navigateMySize('create');
}

@connect(state => ({
  selected: getSelectedSize(state),
}), {
  saveNew: saveNewMySize,
  update: updateSelectedSize,
})
@ErrorHandler(['confirmSize'])
export default class ConfirmMySize extends Component {
  static propTypes = {
    selected: object,
    saveNew: func,
    update: func,
    error: string,
  };

  static contextTypes = {
    i18n: object,
  };

  componentWillMount() {
    if (!this.props.selected) {
      navigateMySize('view');
    }
  }

  confirmSizes = () => {
    const { selected, update, saveNew } = this.props;
    const sizeId = selected.size_id;

    if (sizeId) {
      return update(sizeId, selected).then(redirectToCompleted);
    }

    return saveNew(selected).then(redirectToCompleted);
  };

  render() {
    const {
      context: { i18n: { mySize: mySizeLabels } },
      props: { selected, error },
    } = this;

    return (
      <div className={cx(horizontalGap, PTL)}>
        <HeadingInfo text={mySizeLabels.headingConfirm} className={MBL} isPageHeading />
        <If
          if={error}
          then={ErrorMessage}
          message={error}
          rootClassName="mySizePageError"
        />
        <div className={cx(PTL, PBL, PHM, MBL, sharedStyles.tile)}>
          <Text className={MBL}>{(selected && selected.size_title) || mySizeLabels.nameHint}</Text>
          <SizeInner noEdit size={selected} />
          <Button
            type={Button.type.default}
            className={MTL}
            onClick={this.confirmSizes}
            analyticsOn="Click"
            analyticsLabel="Registration"
            analyticsCategory="Member Info"
          >
            {mySizeLabels.registrationButton}
          </Button>
          <Button
            type={Button.type.secondary}
            className={MTM}
            onClick={redirectToCreate}
          >
            {mySizeLabels.backButton}
          </Button>
        </div>
      </div>
    );
  }
}
