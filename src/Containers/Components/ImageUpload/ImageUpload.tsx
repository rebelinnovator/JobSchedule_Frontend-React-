import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

import './ImageUpload.scss';
import PreviewImage from './PreviewImage';

interface Props {
  onChangeImage: (images) => void;
  defaultImages?: any;
}

const ImageUpload: React.FC<Props> = ({ defaultImages = [], onChangeImage }) => {
  const [images, setImages] = useState([...defaultImages]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      const newImages = [...images];
      setImages([...newImages, ...acceptedFiles]);
      onChangeImage([...newImages, ...acceptedFiles]);
    }
  });

  const removeImage = (idx) => {
    const newImages = [...images];
    if (idx > -1) {
      newImages.splice(idx, 1);
    }
    setImages(newImages);
    onChangeImage(newImages);
  };

  useEffect(() => () => {
    images.forEach((image) => {
      if (typeof image !== 'string') {
        URL.revokeObjectURL(image.preview);
      }
    });
  }, [images]);

  return (
    <>
      <div {...getRootProps({ className: 'dropzone mb-3' })}>
        <input {...getInputProps()} />
        <span>{images.length > 0 ? 'Select another images' : 'Drag \'n\' drop some job\'s image here, or click to select images'}</span>
      </div>
      <div className="d-flex flex-wrap">
        {images.map((image, index) => (
          typeof image === 'string' ? (
            <div key={String(index)} className="mr-3">
              <PreviewImage url={`${process.env.REACT_APP_API_ENDPOINT}${image}`} onRemove={() => removeImage(index)} />
            </div>
          ) : (
            <div key={String(index)} className="mr-3">
              <PreviewImage url={URL.createObjectURL(image)} onRemove={() => removeImage(index)} />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ImageUpload;