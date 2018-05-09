import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import noop from 'utils/noop';
import Button from 'components/uniqlo-ui/Button';
import { filterStoresByState, setLocationView } from 'redux/modules/checkout/delivery/store/actions';
import { getStateCodes } from 'redux/modules/checkout/delivery/store/selectors';
import classNames from 'classnames';
import styles from './styles.scss';

const { func, object, array } = PropTypes;
const storeBtnClass = classNames('default', 'medium', styles.state);

@connect(state => ({
  states: state.deliveryStore.states,
  stateCodes: getStateCodes(state),
}),
  { setLocationView, filterStoresByState }
)
export default class StoresStates extends Component {

  static propTypes = {
    stateCodes: array,
    states: object,
    filterStoresByState: func,
    setLocationView: func,
  };

  static contextTypes = {
    i18n: object,
  };

  static defaultProps = {
    filterStoresByState: noop,
  };

  onSelectPress = (stateCode) => {
    this.props.setLocationView('map');
    this.props.filterStoresByState(stateCode);
  };

  render() {
    const { states, stateCodes } = this.props;

    return (
      <div className={styles.storesStates}>
        {stateCodes.map((stateCode, index) => (
          <Button
            className={storeBtnClass}
            key={index}
            label={states[stateCode].name}
            labelClass={styles.state}
            onTouchTap={() => this.onSelectPress(stateCode)}
          />
        ))}
      </div>
    );
  }
}
