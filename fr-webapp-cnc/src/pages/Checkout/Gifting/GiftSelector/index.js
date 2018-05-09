import React, { PureComponent, PropTypes } from 'react';
import noop from 'utils/noop';
import Image from 'components/uniqlo-ui/Image';
import If from 'components/uniqlo-ui/If';
import BoxSelector from 'components/BoxSelector';
import MessageEditor from './MessageEditor';
import styles from './styles.scss';

const { string, bool, func, object } = PropTypes;

const GiftSelectorImg = ({ onClick, image }) => (
  <div className={styles.giftSelectorImg}>
    <Image
      onClick={onClick}
      source={image}
    />
  </div>
);

GiftSelectorImg.propTypes = {
  onClick: func,
  image: string,
};

export default class GiftSelector extends PureComponent {
  static propTypes = {
    id: string,
    title: string,
    name: string,
    description: string,
    price: string,
    image: string,
    checked: bool,
    onSelect: func,
    onCancelSelect: func,
    radioLabelStyle: string,
    enabled: bool,
  };

  static contextTypes = {
    i18n: object,
  };

  static defaultProps = {
    enabled: true,
    onSelect: noop,
    onCancelSelect: noop,
  };

  onSetValue = () => {
    const { onSelect, onCancelSelect, id, enabled, name } = this.props;

    if (enabled) {
      if (name === 'noBox' || name === 'noCard') {
        onCancelSelect();
      } else {
        onSelect(id);
      }
    }
  };

  render() {
    const { i18n: { gifting } } = this.context;
    const {
      props: {
        id,
        title,
        name,
        description,
        price,
        image,
        checked,
        radioLabelStyle,
        enabled,
      },
    } = this;

    const labelStyles = radioLabelStyle
      ? [styles.container, radioLabelStyle].join(' ')
      : styles.container;

    const toolTipElement = name === 'noCard' ? gifting.toolTipText : null;
    const toolTipTitle = name === 'noCard' ? gifting.toolTipTitle : null;
    const cardDescription = name === 'card' && !!checked ? description : null;
    const radioButtonDescription = name !== 'card' ? description : null;

    return (
      <div className={labelStyles}>
        <div className={styles.giftSelector}>
          <BoxSelector
            checked={!!checked}
            description={radioButtonDescription}
            enabled={enabled}
            label={title}
            labelStyle={styles.giftLabel}
            name={name}
            onChange={this.onSetValue}
            price={price}
            toolTipHeader={toolTipTitle}
            toolTiptext={toolTipElement}
            value={id}
            applyNoPriceStyle
          />
          <If
            if={image}
            then={GiftSelectorImg}
            onClick={this.onSetValue}
            image={image}
          />
        </div>
        {cardDescription}
        <If
          if={name === 'card' && checked}
          then={MessageEditor}
          id={id}
        />
      </div>
    );
  }
}
