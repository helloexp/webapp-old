import React, { PropTypes } from 'react';
import Image from '../Image';

const { string } = PropTypes;

const CollageItem = (props) => {
  const {
    className,
    altText,
    imageSrc,
  } = props;

  return (
    <Image
      alternateText={altText}
      imageclassName={className}
      source={imageSrc}
    />
  );
};

CollageItem.propTypes = {
  imageSrc: string,
  className: string,
  altText: string,
};

export default CollageItem;
