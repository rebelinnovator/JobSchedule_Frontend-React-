import React, { Component } from 'react';
import SelectAsync, { ISelectItem } from './AsyncSelect';
import { subcontractorsAPI, userAPI } from '../../../Services/API';
import authStore from '../../../Stores/authStore';

interface Props {
  onSelect?: (item: ISelectItem) => void;
  onClear?: () => void;
  placeholder?: string;
  isClearable?: boolean;
  filterFunc?: (item: ISelectItem | ISelectItem[]) => boolean;
  searchParams?: any;
  defaultValue?: any;
  defaultInputValue?: string;
  isMulti?: boolean;
  disabled?: boolean;
  onlyOwnDept?: boolean;
}

const toLowerCase = (value: any) => {
  return `${value}`.toLowerCase();
};

export default class DepartmentAsyncSearch extends Component<Props> {

  static defaultProps = {
    onSelect: undefined,
    onClear: undefined,
    isClearable: true,
    onlyOwnDept: false,
    filterFunc: (keyword: string) => (item: any) => {
      return toLowerCase(item.label).includes(toLowerCase(keyword));
    },
    searchParams: {},
  };

  find = async (value) => {
    const response: any = await userAPI.departments();
    if (response.data) {
      let departments = response.data.map(department => ({
        label: department.name,
        value: department,
      }));

      if (this.props.onlyOwnDept) {
        const user = authStore.currentUser;
        departments = departments.filter((item) => user.departments.findIndex((item2) => item.label === item2.name) >= 0);
      }

      departments = departments.filter(this.props.filterFunc(value));
      return departments;
    }
    return [];
  };

  render() {
    return (
      <SelectAsync
        onClear={this.props.onClear}
        isClearable={this.props.isClearable}
        placeholder={'Select department'}
        promiseOptions={this.find}
        disabled={this.props.disabled}
        onSelect={this.props.onSelect}
        defaultValue={this.props.defaultValue}
        defaultInputValue={this.props.defaultInputValue}
        isMulti={this.props.isMulti} />
    );
  }
}
