import React, { Component } from 'react';
import pointImage from '../../Images/marker-gg.png';
import './Marker.css';

interface Props {
  lat?: number;
  lng?: number;
  children: any;
  onJobFocus?: () => void;
  onJobBlur?: () => void;
  po?: number;
  active?: number;
}

export default class Point extends Component<Props> {

  static defaultProps = {
    onJobFocus: () => { },
  };

  onJobFocus = () => {
    if (!this.props.onJobFocus) {
      return;
    }
    this.props.onJobFocus();
  };
  onJobBlur = () => {
    if (!this.props.onJobBlur) {
      return;
    }
    this.props.onJobBlur();
  };

  render() {
    return (
      <div
        style={{ backgroundImage: `url(${pointImage})` }}
        className={`map-point map-point-image ${
          this.props.active && this.props.po === this.props.active ? 'map-point-active' : ''
          }`}
        onMouseLeave={this.props.onJobBlur}
        onMouseEnter={this.onJobFocus}
      >
      </div>
    );
  }
}
