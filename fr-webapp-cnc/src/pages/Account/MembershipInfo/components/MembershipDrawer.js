import React, { PropTypes, PureComponent } from 'react';
import Drawer from 'components/Drawer';

const { any, func, object, string } = PropTypes;

export default class MembershipDrawer extends PureComponent {

  static propTypes = {
    children: any,
    accept: func,
    cancel: func,
    title: string,
  };

  static contextTypes = {
    i18n: object,
  };

  render() {
    const { accept, cancel, children, title } = this.props;
    const { membershipInfo: { releaseAccept, releaseCancel } } = this.context.i18n;

    return (
      <Drawer
        acceptLabel={releaseAccept}
        cancelLabel={releaseCancel}
        onAccept={accept}
        onCancel={cancel}
        title={title}
        variation="fixedHeightFooter"
        headerType="h2"
      >
        {children}
      </Drawer>
    );
  }
}
