import GoogleMapReact from 'google-map-react';
import React, { Component } from 'react';
import { LocationItem } from '../../../Models/locationItem';
import * as CeIcon from '../../../Utils/Icon';
import Point from '../../Maps/Point';
import LocationsAsyncSearch from './LocationsAsyncSearch';
import mapStore from '../../../Stores/mapStore';
import { CurrentLocation } from '../../../Models/geoLocation';

interface IProps {
  hasEdit: boolean;
  withMap?: Boolean;
  locations: LocationItem[];
  onChangeLocations: (locations: LocationItem[]) => void;
  error?: string | null;
}

export default class MapSelect extends Component<IProps> {
  selectedLocation: {
    address: string;
    lat: number;
    lng: number;
    structure: number;
  };

  static defaultProps = {
    withMap: true,
  };

  selectLocation = (item) => {
    this.selectedLocation = item ? item.value : null;
    this.forceUpdate();
  }

  addLocation = () => {
    if (!this.selectedLocation || !this.selectedLocation.address) return;

    const exist = this.props.locations.some(
      location => location.address === this.selectedLocation.address);
    if (exist) return;

    // const locations = [...this.props.locations, this.selectedLocation];
    const locations = [this.selectedLocation];
    this.props.onChangeLocations(locations);
  };

  removeLocation(idx: number) {
    const locations = this.props.locations.filter((location, index) => index !== idx);
    this.props.onChangeLocations(locations);
  }

  addStructure = (idx: number) => {
    return event => {
      let locations = [...this.props.locations];
      let currentLocation = this.props.locations.find((location, index) => index === idx);
      currentLocation = { ...currentLocation, structure: Number(event.target.value) };
      locations[idx] = { ...currentLocation };
      this.props.onChangeLocations(locations);
    };
  }

  get mapCenter() {
    if (this.selectedLocation) {
      return {
        lat: this.selectedLocation.lat,
        lng: this.selectedLocation.lng,
      };
    }

    if (this.props.locations) {
      const last = this.props.locations[this.props.locations.length - 1];
      if (last) {
        return {
          lat: last.lat,
          lng: last.lng,
        };
      }
    }
    const currentLocation = mapStore.currentLocation;
    if (currentLocation) {
      return {
        lat: Number(currentLocation.Latitude),
        lng: Number(currentLocation.Longtitude),
      };
    }
    else {
      navigator.geolocation.getCurrentPosition(function (position) {
        const currentLocation: CurrentLocation = {
          Longtitude: position.coords.longitude,
          Latitude: position.coords.latitude
        };
        mapStore.setCurrentLocation(currentLocation);
        return {
          lat: Number(position.coords.latitude),
          lng: Number(position.coords.longitude),
        };
      });
    }
  }

  render() {
    const { locations } = this.props;
    return (
      <div className="box-item-body">
        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label className="d-block">Location Address</label>
              <div className="d-flex mb-4">
                <div className="d-block mr-2" style={{ width: '100%' }}>
                  <LocationsAsyncSearch
                    onSelect={this.selectLocation}
                    disabled={this.props.hasEdit}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-success btn-add height-42"
                  onClick={this.addLocation}
                  disabled={this.props.hasEdit}
                >
                  Add </button>
              </div>
              <p className="error">{this.props.error}</p>
              {this.props.withMap ? (
                <div style={{ height: '200px', width: 'auto' }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: process.env.REACT_APP_GOOGLE_MAP_AIP_KEY,
                    }}
                    center={this.mapCenter}
                    defaultCenter={{
                      lat: Number(process.env.REACT_APP_MAP_CENTER_LAT),
                      lng: Number(process.env.REACT_APP_MAP_CENTER_LNG),
                    }}
                    yesIWantToUseGoogleMapApiInternals
                    defaultZoom={11}
                  >
                    {locations.map((location, idx) => (
                      <Point
                        key={`point${idx}`}
                        lat={location.lat}
                        lng={location.lng}
                      >
                        {idx + 1}
                      </Point>
                    ))}
                  </GoogleMapReact>
                </div>
              ) : null}
            </div>
          </div>
          <div className="col-sm-6 address-list-select">
            {locations.length > 0 && (
              <div className="border-bottom px2 py-2 row d-flex align-items-center">
                <div className="col-sm-7 text-bold">Location</div>
                <div className="col-sm-4 text-bold">
                  Structure
              </div>
                <div className="col-sm-1">
                </div>
              </div>
            )}
            {
              locations.map((location, index) => (
                <div className="border-bottom px2 py-2 row d-flex align-items-center" key={`location-${index}`}>
                  <div className="col-sm-7">{location.address}</div>
                  <div className="col-sm-4">
                    <input
                      className="ce-form-control"
                      placeholder="00001"
                      data-type={'number'}
                      defaultValue={location.structure as unknown as string}
                      name={'structure'}
                      onChange={this.addStructure(index)}
                    />
                  </div>
                  {
                    !this.props.hasEdit && <div className="col-sm-1">
                      <span onClick={() => this.removeLocation(index)}>
                        <CeIcon.CloseSolidIcon className="cursor-pointer" />
                      </span>
                    </div>
                  }
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}
