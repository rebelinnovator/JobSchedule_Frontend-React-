import React from 'react';
import LazyLoad from 'react-lazyload';
import closeRegular from '../../Images/close-regular.png';

interface Props {
  url: string;
  closeScreen: Function;
}

class ImageView extends React.Component<Props> {
  render() {
    if (!this.props.url) {
      return null;
    }
    return (
      <div className="image-full-screen">
        <div>
        <LazyLoad height={200}>
          <img className="image-url m-auto" src={this.props.url}></img>
        </LazyLoad>
        </div>
        <img className="cursor-pointer p-1 icon-close" onClick={() => { this.props.closeScreen(); }} src={closeRegular}></img>
      </div>
    );
  }
}

export default ImageView;
