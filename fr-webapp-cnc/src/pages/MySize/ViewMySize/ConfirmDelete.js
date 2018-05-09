import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import { toggleSection, loadAllSizes, deleteSelectedSize } from 'redux/modules/mySize';
import { getSections } from 'redux/modules/mySize/selectors';
import MessageBox from 'components/MessageBox';
import { navigateMySize } from '../utils';

const { object, func } = PropTypes;

@connect(state => ({
  sections: getSections(state),
}), {
  toggleSection,
  deleteSize: deleteSelectedSize,
  loadAll: loadAllSizes,
})
export default class ConfirmDelete extends PureComponent {
  static contextTypes = {
    i18n: object,
  };

  static propTypes = {
    sections: object,
    toggleSection: func,
    deleteSize: func,
    loadAll: func,
  };

  onCancel() {
    this.props.toggleSection('confirmDelete', false);
  }

  confirmDelete() {
    const { sections: { confirmDelete }, deleteSize, loadAll } = this.props;

    deleteSize(confirmDelete).then(() => {
      loadAll();
      navigateMySize('view');
    });
  }

  messageBoxResponse = (response) => {
    if (response === 'yes') {
      this.confirmDelete();
    } else {
      this.onCancel();
    }
  };

  render() {
    const { props: { sections }, context: { i18n: { mySize: mySizeLabels } } } = this;

    return sections.confirmDelete && (
      <MessageBox
        confirmLabel={mySizeLabels.acceptLabel}
        message={mySizeLabels.confirmDelete}
        onAction={this.messageBoxResponse}
        rejectLabel={mySizeLabels.cancelLabel}
        stickyBox
        variation="confirm"
        confirmProps={{
          analyticsOn: 'Click',
          analyticsLabel: 'Delete',
          analyticsCategory: 'Member Info',
        }}
      />
    );
  }
}
