import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import Text from 'components/uniqlo-ui/Text';
import Icon from 'components/uniqlo-ui/core/Icon';
import styles from './styles.scss';

const { string, func } = PropTypes;

export default class ConfirmationPopup extends PureComponent {

  static propTypes = {
    closePopup: func,
    message: string,
  };

  onCloseAction = () => {
    this.props.closePopup(false);
  }

  render() {
    return (
      <div className={styles.popupOverlay}>
        <div className={styles.popupContainer}>
          <Text className={classNames('blockText', styles.popupText)}>
            {this.props.message}
          </Text>
          <Icon className="iconClose" onClick={this.onCloseAction} styleClass={styles.closeIcon} />
        </div>
      </div>
    );
  }
}
