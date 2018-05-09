import React, { PropTypes } from 'react';
import { mergeClasses } from '../../helpers/utils/stylePropable';
import stylePropsParser from '../../helpers/utils/stylePropParser';
import Button from '../../Button';
import styles from './Modal.scss';

const { string, object, func, node, oneOf } = PropTypes;

const preventModalDialogClosure = (eventObj) => {
  eventObj.stopPropagation();
};

const Modal = (props) => {
  const {
    bodyClass,
    children,
    className,
    closeButtonClass,
    closeButtonText,
    closeButtonTextClass,
    dialogClass,
    headerClass,
    onDismiss,
    overlayClass,
    } = props;

  const buttonText = closeButtonText || 'X';

  const classNames = {
    container: mergeClasses(stylePropsParser(className, styles), styles.modal, stylePropsParser(overlayClass, styles)),
    closeButton: mergeClasses('closeButton', stylePropsParser(closeButtonClass, styles)),
    content: styles.content,
    labelStyle: mergeClasses('closeLabel', stylePropsParser(closeButtonTextClass, styles)),
    modalHeader: mergeClasses(styles.modalHeader, stylePropsParser(headerClass, styles)),
    modalDialog: mergeClasses(styles.modalDialog, stylePropsParser(dialogClass, styles)),
    modalBody: mergeClasses(styles.modalBody, stylePropsParser(bodyClass, styles)),
  };

  const modalCloseComponent = (
    <Button
      className={classNames.closeButton}
      label={buttonText}
      labelClass={classNames.labelStyle}
      onTouchTap={onDismiss}
    />
  );

  return (
    <div className={classNames.container} >
      <div className={classNames.modalDialog}>
        <div className={classNames.content}>
          <div className={classNames.modalHeader}>
            {modalCloseComponent}
          </div>
          <div
            className={classNames.modalBody}
            onClick={preventModalDialogClosure}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  bodyClass: string,
  children: node,
  className: string,
  closeButtonClass: string,
  closeButtonText: string,
  closeButtonTextClass: string,
  dialogClass: string,
  headerClass: string,
  onDismiss: func,
  overlayClass: string,
  variation: oneOf(['textOnly', 'imageLinks']),
};

Modal.contextTypes = {
  compConfig: object,
};

export default Modal;
