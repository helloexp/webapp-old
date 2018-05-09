import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import Button from 'components/Atoms/Button';
import Input from 'components/Atoms/Input';
import Drawer from 'components/Drawer';
import Text from 'components/Atoms/Text';
import { toggleSection, setSelectedValue } from 'redux/modules/mySize';
import {
  getSections,
  getSelectedSize,
  getLoaded,
  areSizesAdded,
} from 'redux/modules/mySize/selectors';
import { redirect } from 'utils/routing';
import { MBL, MBS } from 'theme/spacing.scss';
import { checkUQNativeApp, checkGUNativeApp } from 'helpers/NativeAppHelper';
import { navigateMySize } from '../utils';

const { func, object, bool } = PropTypes;

function goToCreate() {
  navigateMySize('create');
}

@connect(state => ({
  selected: getSelectedSize(state),
  loaded: getLoaded(state),
  sections: getSections(state),
  areSizesAdded: areSizesAdded(state),
}), {
  toggleSection,
  setValue: setSelectedValue,
})
export default class ViewSize extends PureComponent {
  static propTypes = {
    setValue: func,
    toggleSection: func,
    selected: object,
    sections: object,
    loaded: bool,
    areSizesAdded: bool,
  };

  static contextTypes = {
    i18n: object,
  };

  static onCancel = () => {
    redirect('account');
  };

  componentWillMount() {
    // In UqNativeApp and GuNativeApp we do not need to show a close icon in the drawer modal view.
    // `isNativeApp` checks the same.
    this.isNativeApp = checkUQNativeApp() || checkGUNativeApp();
  }

  onInputChange = (event) => {
    this.props.setValue('size_title', event.target.value);
  };

  render() {
    const { selected, sections, loaded } = this.props;
    const { mySize: mySizeLabels } = this.context.i18n;

    return sections.create && loaded && !this.props.areSizesAdded && (
      <Drawer
        acceptLabel={mySizeLabels.createDefaultSize}
        onCancel={this.constructor.onCancel}
        title={mySizeLabels.createdMySize}
        variation="noFooter"
        hideCloseIcon={this.isNativeApp}
      >
        <Text className={MBS} type={Text.type.paragraph}>{mySizeLabels.createSizeMessage}</Text>
        <Text className={MBL} type={Text.type.paragraph}>{mySizeLabels.sizeExample}</Text>
        <Input
          className={MBL}
          value={selected.size_title}
          onChange={this.onInputChange}
          label={mySizeLabels.sizePlaceholder}
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
        <Button
          type={Button.type.default}
          disabled={!selected.size_title.trim()}
          onClick={goToCreate}
        >
          {mySizeLabels.acceptSize}
        </Button>
      </Drawer>
    );
  }
}
