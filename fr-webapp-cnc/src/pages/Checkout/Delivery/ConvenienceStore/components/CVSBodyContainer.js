import React, { PropTypes, Component } from 'react';
import If from 'components/uniqlo-ui/If';
import { connect } from 'react-redux';
import { deleteCVSUserAddress } from 'redux/modules/account/userInfo';
import noop from 'utils/noop';
import { isDeliveryTypeCvs, getCvsStoreAddresses } from 'redux/modules/checkout/delivery/selectors';
import Container from 'components/uniqlo-ui/core/Container';
import MessageBox from 'components/MessageBox';
import CVSBody from './CVSBody';

const { func, bool, object } = PropTypes;

@connect(state => ({
  isCvsDeliveryType: isDeliveryTypeCvs(state),
  showCvsNavigationModal: state.delivery.showCvsNavigationModal,
  storeAddress: getCvsStoreAddresses(state),
}), {
  deleteCVSUserAddress,
})

export default class CVSBodyContainer extends Component {

  static propTypes = {
    isCvsDeliveryType: bool,
    deleteCVSUserAddress: func,
    removeCvsAddress: func,
    storeAddress: object,
    showCvsNavigationModal: bool,
  };

  static defaultProps = {
    deleteCVSUserAddress: noop,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
    isRemoveCvs: false,
  };

  onRemoveConfirmed = (actionType) => {
    if (actionType === 'yes') {
      this.props.deleteCVSUserAddress(this.state.cvsBrand);
    }
    this.removeCvsAddress();
  };

  removeCvsAddress = (cvsBrand = '') => {
    this.setState(prevState => ({
      isRemoveCvs: !prevState.isRemoveCvs,
      cvsBrand,
    }));
  };

  render() {
    const {
      props: {
        isCvsDeliveryType,
        storeAddress,
        showCvsNavigationModal,
      },
      state: {
        isRemoveCvs,
        cvsBrand,
      },
      context: {
        i18n: {
          delivery: {
            confirmLabel,
            cvsRemoveMessage,
            rejectLabel,
          },
        },
      },
      onRemoveConfirmed,
      removeCvsAddress,
    } = this;

    return (
      <Container>
        <If
          if={isCvsDeliveryType && !showCvsNavigationModal}
          removeCvsAddress={removeCvsAddress}
          then={CVSBody}
        />
        <If
          confirmLabel={confirmLabel}
          if={storeAddress[cvsBrand] && isRemoveCvs}
          message={cvsRemoveMessage}
          onAction={onRemoveConfirmed}
          rejectLabel={rejectLabel}
          stickyBox
          then={MessageBox}
          variation="confirm"
        />
      </Container>
    );
  }
}
