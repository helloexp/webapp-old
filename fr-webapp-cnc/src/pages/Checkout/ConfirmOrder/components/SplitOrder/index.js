import React, { PureComponent, PropTypes } from 'react';
import classnames from 'classnames';
import Panel from 'components/Panel';
import styles from './styles.scss';

export default class SplitOrder extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    header: PropTypes.string,
  };

  state = {
    expanded: false,
  }

  onToggle = () => this.setState({ expanded: !this.state.expanded });

  render() {
    const { props: { children, header }, state: { expanded } } = this;
    const orderDetail = expanded && children;

    return (
      <Panel
        className={classnames(styles.panelStyle, { [styles.expanded]: expanded })}
        headerStyle={styles.panelHeader}
        title={header}
        toggleable
        onToggle={this.onToggle}
      >
        {orderDetail}
      </Panel>
    );
  }
}
