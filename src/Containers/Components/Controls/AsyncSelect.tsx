import React, { Component } from 'react';

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
  triggerReloadKey?: string;
}

export default class SelectAsync extends Component<Props> {
  asyncSelect: React.RefObject<any>;

  constructor(props) {
    super(props);
    this.asyncSelect = React.createRef();
  }

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
  }

  forceReload = () => {
    if (this.asyncSelect && this.asyncSelect.current) {
      this.asyncSelect.current.loadOptions('');
    }
  }

  render() {
    return (
      <AsyncSelect
        key={JSON.stringify(this.props.triggerReloadKey)}
        ref={this.asyncSelect}
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
        isMulti={this.props.isMulti} />
    );
  }
}