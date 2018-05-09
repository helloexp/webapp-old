import React, { PropTypes, PureComponent } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Textarea from 'react-textarea-autosize';
import styles from './styles.scss';

const { func, string, object } = PropTypes;

export default class MessageTextArea extends PureComponent {
  static contextTypes = {
    i18n: object,
  };
  static propTypes = {
    onBlur: func,
    onChange: func,
    onFocus: func,
    id: string,
    className: string,
    name: string,
    value: string,
  };

  render() {
    const { gifting, address } = this.context.i18n;
    const { value, onChange, className, name, onFocus, onBlur } = this.props;

    return (
      <div>
        <Textarea
          value={value}
          onChange={onChange}
          className={className}
          minRows={4}
          name={name}
          onFocus={onBlur}
          onBlur={onFocus}
          wrap="soft"
        />
        <Text className={styles.textBoxCaption}>{gifting.textBoxCaption}</Text>
        <Text className={styles.textBoxDescription}>{gifting.textBoxDescription}</Text>
        <div className={styles.descriptionWrapper}>
          <Text>{address.requiredIndicator}</Text>
          <Text className={styles.textBoxDescriptionText}>{gifting.textBoxDescriptionText}</Text>
        </div>
      </div>
    );
  }
}
