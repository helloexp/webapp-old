import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadAllSizes } from 'redux/modules/mySize';
import { getSelectedSize } from 'redux/modules/mySize/selectors';
import ViewSize from './ViewSize';
import SizeList from './SizeList';
import About from '../Common/About';
import HowTo from '../Common/HowTo';
import ToMySize from '../Common/ToMySize';
import ConfirmDelete from './ConfirmDelete';
import PurchaseHistory from '../Common/PurchaseHistory';

@connect(state => ({
  selected: getSelectedSize(state),
}), {
  loadAllSizes,
})
export default class ViewMySize extends PureComponent {
  static propTypes = {
    loadAllSizes: PropTypes.func,
  };

  componentDidMount() {
    this.props.loadAllSizes();
  }

  render() {
    return (
      <div>
        <ViewSize />
        <SizeList />
        <PurchaseHistory />
        <HowTo />
        <About />
        <ConfirmDelete />
        <ToMySize />
      </div>
    );
  }
}
