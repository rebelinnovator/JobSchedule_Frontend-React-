import React, { Component } from 'react';
import SelectAsync, { ISelectItem } from './AsyncSelect';
import { subcontractorsAPI, workerAPI } from '../../../Services/API';

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

export class WorkerAsyncSearch extends Component<Props> {
  selectAsync: React.RefObject<SelectAsync>;

  static defaultProps = {
    onSelect: undefined,
    onClear: undefined,
    isClearable: true,
    filterFunc: (item: any) => true,
    searchParams: {},
  };

  constructor(props) {
    super(props);
    this.selectAsync = React.createRef();
  }

  forceReload = () => {
    if (this.selectAsync && this.selectAsync.current) {
      this.selectAsync.current.forceReload();
    }
  }

  find = async (value = '') => {
    console.log(this.props.searchParams);
    const response: any = await workerAPI.loadWorkers({
      ...this.props.searchParams,
      firstName: value,
    });
    if (response.data) {
      const workers = response.data.results.map((worker: any) => ({
        label: worker.name,
        value: worker,
      }));
      return workers;
    }
    return [];
  };

  render() {
    return (
      <SelectAsync
        key={JSON.stringify(this.props)}
        ref={this.selectAsync}
        defaultValue={this.props.defaultValue}
        defaultInputValue={this.props.defaultInputValue}
        isMulti={this.props.isMulti}
        onClear={this.props.onClear}
        isClearable={this.props.isClearable}
        promiseOptions={this.find}
        onSelect={this.props.onSelect} />
    )
  }
}
