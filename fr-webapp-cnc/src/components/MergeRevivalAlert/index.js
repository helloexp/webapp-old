import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import MessageBox from 'components/MessageBox';
import If from 'components/uniqlo-ui/If';
import { isMergerRevivalVisible, removeCartMergerRevival } from 'redux/modules/app';

const { bool, func, number, object } = PropTypes;

@connect(state => ({
  mergedOrRevival: state.app.cmr,
  isPopUpVisible: isMergerRevivalVisible(state),
}), { removeCartMergerRevival })
export default class MergeRevivalAlert extends PureComponent {

  static propTypes = {
    mergedOrRevival: number,
    isPopUpVisible: bool,
    removeCartMergerRevival: func,
  };

  static contextTypes = {
    i18n: object,
  };

  onClosePopup = () => {
    this.props.removeCartMergerRevival();
  }

  render() {
    const { mergedOrRevival, isPopUpVisible } = this.props;
    const { i18n: { cart: { mergeRevival }, common } } = this.context;

    return (
      <If
        if={isPopUpVisible}
        then={MessageBox}
        rejectLabel={common.ok}
        variation="alert"
        title={mergeRevival[mergedOrRevival]}
        onAction={this.onClosePopup}
        onClose={this.onClosePopup}
      />
    );
  }
}
