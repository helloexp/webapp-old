import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import Drawer from 'components/Drawer';
import Button from 'components/Atoms/Button';
import Input from 'components/Atoms/Input';
import Text from 'components/Atoms/Text';
import { setSelectedValue, toggleSection } from 'redux/modules/mySize';
import { getSections, getSelectedSize } from 'redux/modules/mySize/selectors';
import { MBS, MBL } from 'theme/spacing.scss';
import { stripLeadingSpaces } from 'utils/format';
import { navigateMySize } from '../utils';

const { object, func } = PropTypes;

function goToCreate() {
  navigateMySize('create');
}

@connect(state => ({
  sections: getSections(state),
  selected: getSelectedSize(state),
}), {
  setValue: setSelectedValue,
  toggleSection,
})
export default class ToMySize extends PureComponent {
  static contextTypes = {
    i18n: object,
  };

  static propTypes = {
    sections: object,
    selected: object,
    setValue: func,
    toggleSection: func,
  };

  onInputChange = (key, value) => {
    this.props.setValue(key, value);
  };

  toggleMySizeScreen = () => {
    this.props.toggleSection('toMySize');
  };

  render() {
    const {
      props: { sections, selected },
      context: {
        i18n: { mySize: mySizeLabels },
      },
    } = this;

    return sections.toMySize && (
      <Drawer
        acceptLabel={mySizeLabels.createDefaultSize}
        onCancel={this.toggleMySizeScreen}
        title={mySizeLabels.addNewUser}
        variation="noFooter"
      >
        <Text className={MBS}>{mySizeLabels.nameInMyList}</Text>
        <Text className={MBL}>{mySizeLabels.sizeExample}</Text>
        <Input
          value={selected.size_title}
          label={mySizeLabels.sizePlaceholder}
          onChange={event => this.onInputChange('size_title', event.target.value)}
          className={MBL}
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
          disabled={!stripLeadingSpaces(selected.size_title)}
          onClick={goToCreate}
          className={MBL}
        >{mySizeLabels.acceptSize}</Button>
      </Drawer>
    );
  }
}
