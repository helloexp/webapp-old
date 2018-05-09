import React, { PropTypes } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import styles from './styles.scss';
import ProductImageCell from './ProductImageCell.js';

const ProductImages = (props) => {
  const {
    dataArray,
    headingText,
    showCount,
  } = props;
  const heading = headingText
      ? <Text className="blockText">{headingText}</Text>
      : null;

  return (
    <Container>
      { heading }
      <div className={styles.productImageWrap}>
        { dataArray.map((item, id) =>
          <ProductImageCell
            count={item.count && parseInt(item.count, 10)}
            image={item.image}
            key={id}
            showCount={showCount}
          />
      )}
      </div>
    </Container>
  );
};

const { array, string, bool } = PropTypes;

ProductImages.propTypes = {
  dataArray: array,
  headingText: string,
  showCount: bool,
  review: bool,
};

ProductImages.defaultProps = {
  showCount: false,
};

export default ProductImages;
