import React, { PureComponent, PropTypes } from 'react';
import Text from 'components/Atoms/Text';
import cx from 'classnames';
import sharedStyle from 'theme/shared.scss';
import spacing from 'theme/spacing.scss';

export default class PromotionalSpace extends PureComponent {
  static contextTypes = {
    i18n: PropTypes.object,
  };

  static generateParagraph(texts) {
    return texts.map((textObject, idx) => {
      const NodeType = textObject.isBold ? 'strong' : 'span';

      return (
        <NodeType className={cx({ [sharedStyle.colorBlueGreen]: textObject.isBlueGreen })} key={idx}>
          {textObject.text}
        </NodeType>
      );
    });
  }

  render() {
    const { i18n } = this.context;

    return (
      <div className={cx(sharedStyle.tile, spacing.MHM, spacing.PHM, spacing.MVS, spacing.PVSM)}>
        <Text type={Text.type.paragraph} size={-2}>
          { this.constructor.generateParagraph(i18n.cart.promotionalSpace)}
        </Text>
      </div>
    );
  }
}
