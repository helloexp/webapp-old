import React, { PropTypes, PureComponent } from 'react';
import Text from 'components/uniqlo-ui/Text';
import MembershipDrawer from './MembershipDrawer';
import styles from './styles.scss';

const { object, func } = PropTypes;

export default class UnsubscribeDrawer extends PureComponent {
  static propTypes = {
    cancelRelease: func,
  };

  static contextTypes = {
    i18n: object,
  };

  render() {
    const { membershipInfo: { memberInfo } } = this.context.i18n;
    const { cancelRelease } = this.props;

    return (
      <MembershipDrawer cancel={cancelRelease} >
        <Text className={styles.modalContent} content={memberInfo} />
      </MembershipDrawer>
    );
  }
}
