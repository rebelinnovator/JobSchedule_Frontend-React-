import React, { Component } from 'react';
import Creatable from 'react-select/creatable';

import AsyncSelect from 'react-select/async';

export interface ISelectItem {
  value: any;
  label: string;
}

interface Props {
  promiseOptions: (inputValue: string) => Promise<Array<any>>;
  onSelect?: (item: ISelectItem) => void;
  onClear?: () => void;
  placeholder?: string;
  isClearable?: boolean;
  defaultValue?: any;
  defaultInputValue?: string;
  isMulti?: boolean;
  disabled?: boolean;
  value?: any;
}

export default class AsyncCreateOrSelect extends Component<Props> {
  static defaultProps = {
    onSelect: undefined,
    onClear: undefined,
    isClearable: true,
    promiseOptions: inputValue =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve([]);
        }, 1000);
      })
  };

  render() {
    return (
      <Creatable
        {...this.props}
        onClear={this.props.onClear}
        isClearable={this.props.isClearable}
        placeholder={this.props.placeholder}
        cacheOptions
        defaultOptions
        isDisabled={this.props.disabled}
        defaultValue={this.props.defaultValue}
        loadOptions={this.props.promiseOptions}
        onChange={this.props.onSelect}
        defaultInputValue={this.props.defaultInputValue}
        isMulti={this.props.isMulti}
      />
    );
  }
}
