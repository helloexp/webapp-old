import React, { PropTypes, PureComponent } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Image from 'components/uniqlo-ui/Image';
import MembershipDrawer from './MembershipDrawer';
import styles from './styles.scss';
import appDisconnect from '../images/appDisconnect.png';

const { object, func } = PropTypes;

export default class ReleaseConnectionDrawer extends PureComponent {

  static propTypes = {
    acceptRelease: func,
    cancelRelease: func,
  };

  static contextTypes = {
    i18n: object,
  };

  render() {
    const { acceptRelease, cancelRelease } = this.props;
    const { membershipInfo: { releaseMessage, releaseHeading } } = this.context.i18n;

    return (
      <MembershipDrawer accept={acceptRelease} cancel={cancelRelease} title={releaseHeading}>
        <div className={styles.modalContentConfirmation}>
          <Text content={releaseMessage} />
        </div>
        <Image source={appDisconnect} />
      </MembershipDrawer>
    );
  }
}
