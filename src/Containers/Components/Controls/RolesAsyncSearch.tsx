
import React, { Component } from 'react';
import SelectAsync, { ISelectItem } from './AsyncSelect';

import { userAPI } from '../../../Services/API';
import { EROLES } from '../../../Constants/user';


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
  onlyDispatcher?: boolean;
}

const toLowerCase = (value: any) => {
  return `${value}`.toLowerCase();
};
export default class RolesAsyncSearch extends Component<Props> {

  static defaultProps = {
    onSelect: undefined,
    onClear: undefined,
    isClearable: true,
    filterFunc: (keyword: string) => (item: any) => {
      return toLowerCase(item.label).includes(toLowerCase(keyword));
    },
    searchParams: {},
  };

  find = async (value) => {
    const response: any = await userAPI.roles();
    if (response.data) {
      let roles = response.data.map(role => ({
        label: role.name,
        value: role,
      })).filter(this.props.filterFunc(value));

      if (this.props.onlyDispatcher) {
        roles = roles.filter((item) => item.value.id === EROLES.dispatcher || item.value.id === EROLES.dispatcher_supervisor);
      }

      return roles;
    }
    return [];
  };

  render() {
    return (
      <SelectAsync
        onClear={this.props.onClear}
        isClearable={this.props.isClearable}
        placeholder={this.props.placeholder}
        promiseOptions={this.find}
        onSelect={this.props.onSelect}
        defaultValue={this.props.defaultValue}
        defaultInputValue={this.props.defaultInputValue}
        isMulti={this.props.isMulti} />
    );
  }
}
