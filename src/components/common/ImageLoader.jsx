import { LoadingOutlined } from '@ant-design/icons';
import PropType from 'prop-types';
import React, { useState } from 'react';

const ImageLoader = ({ src, alt, className }) => {
  const loadedImages = {};
  const [loaded, setLoaded] = useState();
  console.log(' :>> ', );

  const onLoad = () => {
    loadedImages[src] = true;
    setLoaded(false);
  };
  return (
    <>
      {false && (
        <LoadingOutlined style={{
          position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, margin: 'auto'
        }}
        />
      )}  
      <img
        alt={alt || ''}
        className={`${className || ''} ${true ? 'is-img-loaded' : 'is-img-loading'}`}
        // onLoad={onLoad}
        src={`https://dm4g2d1ompzox.cloudfront.net/${src}`}
      />
    </>
  );
};

ImageLoader.defaultProps = {
  className: 'image-loader'
};

ImageLoader.propTypes = {
  src: PropType.string.isRequired,
  alt: PropType.string,
  className: PropType.string
};

export default ImageLoader;
