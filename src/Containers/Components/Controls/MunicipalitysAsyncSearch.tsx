import React, { Component } from 'react';
import SelectAsync, { ISelectItem } from './AsyncSelect';
import { subcontractorsAPI, userAPI, jobAPI } from '../../../Services/API';
import { MUNICIPALITY } from '../../../Constants/job';

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

export default class MunicipalitysAsyncSearch extends Component<Props> {

  static defaultProps = {
    onSelect: undefined,
    onClear: undefined,
    isClearable: true,
    filterFunc: item => true,
    searchParams: {},
  };

  find = async () => {
    return MUNICIPALITY;
  };

  render() {
    return (
      <SelectAsync
        onClear={this.props.onClear}
        isClearable={this.props.isClearable}
        placeholder={'Select municipality'}
        promiseOptions={this.find}
        onSelect={this.props.onSelect}
        defaultValue={this.props.defaultValue}
        defaultInputValue={this.props.defaultInputValue}
        isMulti={this.props.isMulti}/>
    );
  }
}
