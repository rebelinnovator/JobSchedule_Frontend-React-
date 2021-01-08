import GoogleMapReact from 'google-map-react';
import React, { Component } from 'react';
import { LocationItem } from '../../../Models/locationItem';
import * as CeIcon from '../../../Utils/Icon';
import Point from '../../Maps/Point';
import LocationsAsyncSearch from '../../Components/Controls/LocationsAsyncSearch';
import mapStore from '../../../Stores/mapStore';
import { CurrentLocation } from '../../../Models/geoLocation';

interface IProps {
  withMap?: Boolean;
  location: LocationItem;
  onChangeLocations: (locations: LocationItem) => void;
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

    const locations = { ...this.selectedLocation };
    this.props.onChangeLocations(locations);
  };

  removeLocation() {
    this.props.onChangeLocations({} as LocationItem);
  }

  get mapCenter() {
    if (this.selectedLocation) {
      return {
        lat: this.selectedLocation.lat,
        lng: this.selectedLocation.lng,
      };
    }

    if (this.props.location) {
      const last = this.props.location;
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

  addStructure = e => {
    const _location = this.props.location
    _location.structure = Number(e.target.value)
    this.props.onChangeLocations(_location)
  }

  render() {
    const { location } = this.props;
    return (
      <div className="">
        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label className="d-block">Location Address</label>
              <div className="d-flex mb-4">
                <div className="d-block mr-2" style={{ width: '100%' }}>
                  <LocationsAsyncSearch
                    onSelect={this.selectLocation}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-success btn-add height-42"
                  onClick={this.addLocation}
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
                    {location.lat &&
                      [location].map((item, idx) => (
                      <Point
                        key={idx}
                        lat={item.lat}
                        lng={item.lng}
                      >
                        {1}
                      </Point>
                      ))}
                  </GoogleMapReact>
                </div>
              ) : null}
            </div>
          </div>
          <div className="col-sm-6 address-list-select">
            {location.address && (
              <div className="border-bottom px2 py-2 row d-flex align-items-center">
                <div className="col-sm-10 text-bold">Location</div>
                <div className="col-sm-2">
                  Structure
                </div>
              </div>
            )}
            {location.address && <div className="border-bottom px2 py-2 row d-flex align-items-center">
              <div className="col-sm-7">{location.address}</div>
              <div className="col-sm-3">
                    <input
                      className="ce-form-control"
                      placeholder="00001"
                      data-type={'number'}
                      defaultValue={location.structure as unknown as string}
                      name={'structure'}
                      onChange={this.addStructure}
                    />
                  </div>
              <div className="col-sm-2">
                <span onClick={() => this.removeLocation()}>
                  <CeIcon.CloseSolidIcon className="cursor-pointer" />
                </span>
              </div>
            </div>}
          </div>
        </div>
      </div>
    );
  }
}
