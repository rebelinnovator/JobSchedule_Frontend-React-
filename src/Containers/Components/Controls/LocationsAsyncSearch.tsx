
import React, { Component } from 'react';
import SelectAsync, { ISelectItem } from './AsyncSelect';
import Geocode from 'react-geocode';


interface Props {
  onSelect?: (item: ISelectItem) => void;
  onClear?: () => void;
  placeholder?: string;
  isClearable?: boolean;
  filterFunc?: (item: ISelectItem) => boolean;
  searchParams?: any;
  defaultValue?: any;
  defaultInputValue?: string;
  isMulti?: boolean;
  disabled?: boolean;
}

export default class LocationsAsyncSearch extends Component<Props> {

  static defaultProps = {
    onSelect: undefined,
    onClear: undefined,
    isClearable: true,
    filterFunc: item => true,
    searchParams: {},
  };

  find = async (value) => {
    const response: any = await Geocode.fromAddress(value);
    if (Array.isArray(response.results)) {
      return response.results.map(location => ({
        label: location.formatted_address,
        value: {
          address: location.formatted_address,
          lat: location.geometry.location.lat,
          lng: location.geometry.location.lng,
        },
      }));
    }
    return [];
  }

  render() {
    return (
      <SelectAsync
        disabled={this.props.disabled}
        onClear={this.props.onClear}
        isClearable={this.props.isClearable}
        placeholder={'Find locations'}
        promiseOptions={this.find}
        onSelect={this.props.onSelect}
        defaultValue={this.props.defaultValue}
        defaultInputValue={this.props.defaultInputValue}
        isMulti={this.props.isMulti} />
    );
  }
}

//  Geocode.fromAddress(this.state.newLocation).then(
//       response => {
//         const { lat, lng } = response.results[0].geometry.location;
//         jobStore.jobsTemp[index].locations.push({
//           lat,
//           lng,
//           address: response.results[0].formatted_address,
//         } as LocationItem);
//         this.updateStoreJob(index, {
//           lat,
//           lng,
//           address: response.results[0].formatted_address,
//           locations: jobStore.jobsTemp[index].locations,
//         });
//         this.setState({ newLocation: '' });
//       },
//       error => {
//         this.setState({ newLocation: '' });
//         console.error(error);
//       }
//     );