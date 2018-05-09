import React, { PureComponent, PropTypes } from 'react';
import noop from 'utils/noop';
import ReactDOM from 'react-dom';
import { trackEvent } from 'utils/gtm';
import stylePropsParser from '../../helpers/utils/stylePropParser';
import { mergeClasses } from '../../helpers/utils/stylePropable';
import Icon from '../Icon';
import styles from './Dropdown.scss';

const { oneOfType, number, string, node, func, bool } = PropTypes;

function renderChildren(me, defaultSelected) {
  const { selectedValue, children } = me.props;
  let selectedItem;
  let valueSelected = selectedValue || defaultSelected;
  const items = React.Children.map(children, (child, index) => {
    let selected = false;

    if (index === 0) {
      const { value, label } = child.props;

      valueSelected = valueSelected || value || label;
    }

    if (valueSelected === child.props.value || valueSelected === child.props.label) {
      selected = true;
      selectedItem = React.cloneElement(child, { selected, index: -1 });
    }

    return React.cloneElement(child, { onClick: me.onItemClick, index, selected });
  });

  return { items, selectedItem };
}

export default class Dropdown extends PureComponent {

  static propTypes = {
    children: node,
    className: string,
    variation: string,
    disabled: bool,
    name: string,
    selectedValue: oneOfType([string, number]),
    onChange: func,

    // GTM props
    analyticsOn: string,
    analyticsLabel: string,
    analyticsCategory: string,
  };

  static defaultProps = {
    variation: 'selectInput',
    onChange: noop,
  };

  state = {
    clicked: false,
    selectedValue: null,
    isPopup: false,
  };

  componentDidMount() {
    window.addEventListener('click', this.hideDropdown, true);
  }

  componentWillReceiveProps({ selectedValue }) {
    if (selectedValue !== this.props.selectedValue) {
      this.setState({ selectedValue });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.hideDropdown, true);
  }

  onItemClick = (selectedItem) => {
    this.props.onChange(selectedItem);
    this.setState({ clicked: false, selectedValue: selectedItem.value });

    const {
      analyticsOn,
      analyticsLabel,
      analyticsCategory,
    } = this.props;

    if (analyticsOn) {
      trackEvent({
        action: analyticsOn,
        label: analyticsLabel,
        value: selectedItem.value,
        category: analyticsCategory,
      });
    }
  };

  clickHandler = (event) => {
    const dropdownContainer = event.currentTarget || {};
    const position = dropdownContainer.getBoundingClientRect().top;
    const height = dropdownContainer.getBoundingClientRect().height;
    const menuHeight = parseInt(window.getComputedStyle(this.dropdownElement).getPropertyValue('max-height'), 10);
    const isPopup = position > menuHeight && window.innerHeight - position < height + menuHeight;

    this.setState({ clicked: !this.state.clicked, isPopup });
  };

  hideDropdown = (event) => {
    const rootElement = ReactDOM.findDOMNode(this.rootElement);

    if (rootElement && !rootElement.contains(event.target)) {
      this.setState({ clicked: false });
    }
  };

  render() {
    const {
      variation,
      className,
      disabled,

      analyticsOn,
      analyticsLabel,
      analyticsCategory,
    } = this.props;
    const getRootRefs = ref => (this.rootElement = ref);
    const getMenuRefs = ref => (this.dropdownElement = ref);

    const display = this.state.clicked ? styles.show : styles.hide;
    const containerClass = mergeClasses(styles.dropdown, styles[variation], stylePropsParser(className, styles), className);
    const itemListStyle = this.state.isPopup ? styles.itemListUp : styles.itemListDown;
    const menuClass = mergeClasses(display, itemListStyle);
    const { items, selectedItem } = renderChildren(this, this.state.selectedValue);

    const analyticsAttrs = {
      'analytics-on': analyticsOn,
      'analytics-label': analyticsLabel,
      'analytics-category': analyticsCategory,
    };

    return (
      <div className={containerClass} ref={getRootRefs} {...analyticsAttrs}>
        <div className={styles.selectedContainer} onClick={!disabled && this.clickHandler}>
          { selectedItem }
          <Icon className="iconDropdown" styleClass={styles.dropdownIcon} />
        </div>
        <div className={menuClass} ref={getMenuRefs}>{ items }</div>
      </div>
    );
  }
}
