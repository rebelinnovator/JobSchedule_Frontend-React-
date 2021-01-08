import React, { Component } from 'react';
import SelectAsync, { ISelectItem } from './AsyncSelect';
import { requestorAPI } from '../../../Services/API';

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
}

export class RequestorAsyncSearch extends Component<Props> {

  static defaultProps = {
    onSelect: undefined,
    onClear: undefined,
    isClearable: true,
    filterFunc: (item: any) => true,
    searchParams: {},
  };

  find = async (value = '') => {
    const response: any = await requestorAPI.loadRequestors({
      ...this.props.searchParams,
      firstName: value,
    });
    if (response.data) {
      const requestors = response.data.results.map((requestors) => ({
        label: requestors.name,
        value: requestors,
      }));
      return requestors;
    }
    return [];
  };

  render() {
    return (
      <SelectAsync
        defaultValue={this.props.defaultValue}
        defaultInputValue={this.props.defaultInputValue}
        isMulti={this.props.isMulti}
        onClear={this.props.onClear}
        isClearable={this.props.isClearable}
        promiseOptions={this.find}
        onSelect={this.props.onSelect}/>
    );
  }
}