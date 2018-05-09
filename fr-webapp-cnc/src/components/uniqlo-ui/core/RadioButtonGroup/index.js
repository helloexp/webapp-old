import React, { PureComponent, PropTypes } from 'react';
import RadioButton from './RadioButton';

const {
  string,
  oneOf,
  func,
  node,
  } = PropTypes;

export default class RadioButtonGroup extends PureComponent {
  static propTypes = {
    children: node,
    labelPosition: oneOf(['left', 'right']),
    name: string.isRequired,
    onChange: func,
    valueSelected: string,
  };

  static defaultProps = {
    onChange: () => null,
  };

  state = {
    checkedCount: 0,
    selected: this.props.valueSelected || null,
  };

  componentWillMount = () => {
    this.setValuesWithProps(this.props);
  };

  componentWillReceiveProps = (nextProps) => {
    this.setValuesWithProps(nextProps);
  };

  onChange = (event, newSelection) => {
    this.updateRadioButtons(newSelection);

    if (this.state.checkedCount === 0) {
      this.props.onChange(event, newSelection);
    }
  };

  setValuesWithProps = (prop) => {
    let count = 0;

    React.Children.forEach(prop.children, (option) => {
      if (this.hasCheckAttribute(option)) count++;
    }, this);

    this.setState({
      checkedCount: count,
      selected: prop.valueSelected || null,
    });
  };

  hasCheckAttribute = radioButton =>
  radioButton.props.hasOwnProperty('checked') && radioButton.props.checked;

  updateRadioButtons = (newSelection) => {
    if (this.state.checkedCount === 0) {
      this.setState({ selected: newSelection });
    }
  };

  render() {
    const {
      children,
      labelPosition: propLabelPosition,
      } = this.props;

    const options = React.Children.map(children, (option) => {
      const {
        name,
        value,
        labelPosition,
        ...other
        } = option.props;

      return (
        <RadioButton
          {...other}
          checked={value === this.state.selected}
          key={value}
          labelPosition={propLabelPosition || labelPosition}
          name={name}
          onCheck={this.onChange}
          value={value}
        />
      );
    }, this);

    return (
      <div> {options} </div>
    );
  }
}
