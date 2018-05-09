import React, { PropTypes, PureComponent } from 'react';
import Text from 'components/uniqlo-ui/Text';
import MembershipDrawer from './MembershipDrawer';
import styles from './styles.scss';

const { object, func } = PropTypes;

export default class ConfirmReleaseDrawer extends PureComponent {
  static propTypes = {
    acceptRelease: func,
    cancelRelease: func,
  };

  static contextTypes = {
    i18n: object,
  };

  render() {
    const { membershipInfo: { confirmRelease, releaseProblem } } = this.context.i18n;
    const { acceptRelease, cancelRelease } = this.props;

    return (
      <MembershipDrawer accept={acceptRelease} cancel={cancelRelease} >
        <div className={styles.modalContentConfirmation}>
          <Text className={styles.modalText} content={confirmRelease} />
        </div>
        <Text className={styles.modalText} content={releaseProblem} />
      </MembershipDrawer>
    );
  }
}
