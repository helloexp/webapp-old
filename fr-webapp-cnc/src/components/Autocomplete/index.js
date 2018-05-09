import React, { PropTypes, Component } from 'react';
import noop from 'utils/noop';
import { trackEvent } from 'utils/gtm';
import Text from 'components/uniqlo-ui/Text';
import styles from './styles.scss';

const { string, func } = PropTypes;

class Autocomplete extends Component {
  static propTypes = {
    data: PropTypes.array,
    query: string,
    labelField: string,
    hintText: string,
    onSelect: func,
    onChange: func,
    disabled: PropTypes.bool,
    selection: PropTypes.object,

    // GTM props
    analyticsOn: string,
    analyticsLabel: string,
    analyticsCategory: string,
  };

  static defaultProps = {
    onChange: noop,
    onSelect: noop,
  };

  state = {
    showList: true,
  };

  onChange = (event) => {
    const { value } = event.target;

    this.props.onChange(value);
    this.setState({
      showList: true,
    });
  };

  onSelect(item) {
    this.props.onSelect(item);
    this.setState({
      showList: false,
    });

    const {
      analyticsOn,
      analyticsLabel,
      analyticsCategory,
    } = this.props;

    if (analyticsOn) {
      trackEvent({
        action: analyticsOn,
        label: analyticsLabel,
        value: item,
        category: analyticsCategory,
      });
    }
  }

  renderItem(item, index) {
    const {
      labelField,
      selection,
    } = this.props;
    const selectionCls = selection && selection[labelField] === item[labelField]
      ? styles.selected
      : '';

    return (
      <Text
        className={`blockText ${styles.item} ${selectionCls}`}
        key={index}
        onPress={() => this.onSelect(item)}
      >
        {item[labelField]}
      </Text>
    );
  }

  renderList() {
    const {
      data,
    } = this.props;

    if (this.state.showList && data && data.length > 0) {
      return (
        <div className={styles.list}>
          { data.map((item, index) => this.renderItem(item, index)) }
        </div>
      );
    }

    return null;
  }

  render() {
    const {
      hintText,
      query,
      disabled,

      analyticsOn,
      analyticsLabel,
      analyticsCategory,
    } = this.props;

    const analyticsAttrs = {
      'analytics-on': analyticsOn,
      'analytics-label': analyticsLabel,
      'analytics-category': analyticsCategory,
    };

    return (
      <div className={styles.autocomplete} {...analyticsAttrs}>
        <input
          className={styles.field}
          disabled={disabled}
          placeholder={hintText}
          onChange={this.onChange}
          value={query}
        />
        {this.renderList()}
      </div>
    );
  }
}

export default Autocomplete;
