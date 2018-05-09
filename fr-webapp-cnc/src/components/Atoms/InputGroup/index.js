import React, { PureComponent, PropTypes } from 'react';
import InputLabel from 'components/Atoms/InputLabel';
import cx from 'classnames';
import styles from './styles.scss';

const { oneOfType, arrayOf, node, string, bool } = PropTypes;

export default class InputGroup extends PureComponent {
  static propTypes = {
    children: oneOfType([arrayOf(node), node]),
    className: string,
    label: string,
    required: bool,
  };

  state = {
    focus: false,
  };

  /**
   * Catch event from child component to toggle group label focus
   * @param {Function} cb - child component event function
   * @param {*} event - child component event data
   * @param {Boolean} isFocused - flag which trigger group label focus or blur state
   */
  eventWrapper(cb, event, isFocused) {
    if (cb) {
      cb(event);
    }

    this.setState({ focus: isFocused });
  }

  /**
   * Wrap child component onFocus and onBlur events
   * @param child
   * @return {{onFocus: (function(Event)), onBlur: (function(Event))}}
   */
  wrapEvents(child) {
    return ({
      onFocus: event => this.eventWrapper(child.props.onFocus, event, true),
      onBlur: event => this.eventWrapper(child.props.onBlur, event, false),
    });
  }

  render() {
    const { label, className, children, required } = this.props;

    return (
      <div>
        { label && <InputLabel focus={this.state.focus} star={required}>{label}</InputLabel> }
        <div className={cx(styles.inputGroup, className)}>
          { React.Children.map(children, child =>
            React.cloneElement(child, this.wrapEvents(child)))
          }
        </div>
      </div>
    );
  }
}
