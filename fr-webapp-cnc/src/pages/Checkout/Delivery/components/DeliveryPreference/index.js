import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { setDeliveryPreference as setPreference } from 'redux/modules/checkout/delivery';
import {
  isGroupDeliveryAvailable as checkIfGroupDeliveryAvailable,
  isSplitDeliverySelected as checkIfSplitDeliverySelected,
  isGroupDeliverySelected as checkIfGroupDeliverySelected,
} from 'redux/modules/checkout/delivery/selectors';
import If from 'components/uniqlo-ui/If';
import Container from 'components/uniqlo-ui/core/Container';
import RadioSelector from 'components/Selector';
import Panel from 'components/Panel';
import constants from 'config/site/default';
import { multilineMessage } from 'utils/format';
import styles from './styles.scss';

const { bool, func, object } = PropTypes;
const { SPLIT_DELIVERY, GROUP_DELIVERY } = constants.deliveryPreferences;

@connect(state => ({
  isGroupDeliveryAvailable: checkIfGroupDeliveryAvailable(state),
  isSplitDeliverySelected: checkIfSplitDeliverySelected(state),
  isGroupDeliverySelected: checkIfGroupDeliverySelected(state),
}), {
  setDeliveryPreference: setPreference,
})
export default class DeliveryPreference extends PureComponent {
  static propTypes = {
    isGroupDeliveryAvailable: bool,
    isSplitDeliverySelected: bool,
    isGroupDeliverySelected: bool,
    setDeliveryPreference: func,
  };

  static contextTypes = {
    i18n: object,
  };

  render() {
    const {
      isSplitDeliverySelected,
      isGroupDeliveryAvailable,
      isGroupDeliverySelected,
      setDeliveryPreference,
    } = this.props;
    const { delivery: { splitDelivery, groupDelivery, splitOnlyDeliveryTitle, splitOnlyDelivery, deliveryPreferenceTitle } } = this.context.i18n;
    const splitDeliveryDescription = (<div>{multilineMessage(splitOnlyDelivery)}</div>);

    return (
      <Panel
        className={classNames(styles.deliveryPreferenceWrap, styles.preferenceContainer)}
        lighterBoxShadow
        frame
        title={deliveryPreferenceTitle}
        spacingTitle
        headerStyle={styles.titleStyle}
      >
        <Container>
          <If if={!isGroupDeliveryAvailable}>
            <div className={styles.subTitleStyle}>
              {splitOnlyDeliveryTitle}
            </div>
            {splitDeliveryDescription}
          </If>
          <If if={isGroupDeliveryAvailable}>
            <RadioSelector
              checked={isGroupDeliverySelected}
              label={groupDelivery}
              labelStyle={styles.labelStyle}
              name="preference"
              onChange={setDeliveryPreference}
              value={GROUP_DELIVERY}
            />
            <RadioSelector
              checked={isSplitDeliverySelected}
              description={splitDeliveryDescription}
              label={splitDelivery}
              labelStyle={styles.lastLabelStyle}
              name="preference"
              onChange={setDeliveryPreference}
              value={SPLIT_DELIVERY}
            />
          </If>
        </Container>
      </Panel>
    );
  }
}
