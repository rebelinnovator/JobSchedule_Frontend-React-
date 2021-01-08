import React, { Component } from 'react';
import SelectAsync, { ISelectItem } from './AsyncSelect';
import { subcontractorsAPI, jobAPI } from '../../../Services/API';

interface Props {
  onSelect?: (item: ISelectItem) => void;
  onClear?: () => void;
  placeholder?: string;
  isClearable?: boolean;
  filterFunc?: (item: ISelectItem) => boolean;
  searchParams?: any;
  value?: any;
  defaultValue?: any;
  defaultInputValue?: string;
  isMulti?: boolean;
}

export default class JobsAsyncSearch extends Component<Props> {

  static defaultProps = {
    onSelect: undefined,
    onClear: undefined,
    isClearable: true,
    filterFunc: item => true,
    searchParams: {},
  };

  find = async (value) => {
    const response: any = await jobAPI.loadJobs(
      { ...this.props.searchParams, search: value });
    if (response.data) {
      const jobs = response.data.results.map(job => ({
        label: job.title || `Untitled ${job.uid}`,
        value: job,
      })).filter(this.props.filterFunc);
      return jobs;
    }
    return [];
  }

  render() {
    return (
      <SelectAsync
        {...this.props}
        onClear={this.props.onClear}
        isClearable={this.props.isClearable}
        placeholder={'Select Job'}
        promiseOptions={this.find}
        onSelect={this.props.onSelect}
        defaultValue={this.props.defaultValue}
        defaultInputValue={this.props.defaultInputValue}
        isMulti={this.props.isMulti}
      />
    );
  }
}
