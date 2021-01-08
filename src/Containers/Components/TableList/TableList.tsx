import * as React from 'react';
import './tablelist.scss';
import CheckboxComponent from '../Controls/Checkbox.Component';
import { TableItem } from './TableItem';
import * as CeIcon from '../../../Utils/Icon';
import { InvoiceDetail } from '../../../Models/invoices/invoiceDetail';
import { ControlType } from '../../../Utils/ControlType';
import DropdownComponent from '../Dropdownlist/Dropdown.Component';

import mainStore from '../../../Stores/mainStore';
import CETSearchInput from '../Controls/SearchInput.Component';
import { InvoiceItem } from '../../../Models/invoiceItem';

interface Props {
  hasTitle?: string;
  onChange?: Function;
  checked?: boolean;
  className?: string;
  headers: Array<TableItem>;
  sources?: Array<InvoiceItem>;

}
export class TableList extends React.Component<Props> {
  checkAll: boolean = false;
  searchEnable: boolean;
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }
  // componentWillReceiveProps(nextProps) {
  //     this.checked = nextProps.checked;
  //     this.setState({ change: true })
  // }
  renderEditControl(columItem: TableItem, columnData: InvoiceDetail) {
    let item;
    switch (columItem.editType) {
      case ControlType.Dropdown:

        item = <DropdownComponent displayName="name" className="editing-control" sources={mainStore.subcontractors}></DropdownComponent>;
        break;
      case ControlType.TextInput:
        item = <CETSearchInput title={columnData[columItem.fieldName]} className="editing-control" />;
        break;
      default:
        item = <CETSearchInput title={columnData[columItem.fieldName]} className="editing-control" />;
        break;
    }
    return item;

  }

  public render() {
    return (
      <div className={'tbl-list ' + this.props.className}>

        <div className="tbl-list-left">
          <div className="tbl-list-header">
            <div className="tbl-list-row-header">
              <div className="tbl-columm-chk">
                <div className="tbl-column-chk-inner">
                  <CheckboxComponent
                    className="chk-control"
                    id="chkAll"
                    checked={this.checkAll}
                    onChange={() => {
                      this.checkAll = !this.checkAll;
                      //   this.props.sources.forEach((r) => {
                      //     r.checked = this.checkAll;
                      //   });
                      this.setState({ change: true });
                    }} />
                </div>
              </div>
              {
                this.props.headers.map((item, index) => (

                  !item.hidden && <div className="tbl-list-column">
                    <div className={this.searchEnable ? 'tbl-list-column-header-search ' : 'tbl-list-column-header '}>
                      <div>
                        <span>  {item.title}</span>
                        {
                          this.searchEnable &&
                          <CETSearchInput />
                        }
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="tbl-list-content" >
            {
              this.props.sources.map((source, i) => (
                <div className="tbl-list-content-row-container">
                  <div className={'tbl-list-content-row ' + '' + i}>
                    <div className="tbl-column-chk">
                      <div className="tbl-column-chk-inner">
                        <CheckboxComponent
                          className="chk-control" checked={false} id={'chkAll' + i}
                        // onChange={() => {
                        //     h.checked = !h.checked;
                        //     if (!h.checked) {
                        //         this.checkAll = false;
                        //         this.setState({ change: true });
                        //     }
                        // }} 
                        />
                      </div>
                    </div>

                    {
                      this.props.headers.map((item, index) => (
                        <div className="tbl-list-column">
                          <div className={'tbl-list-column-content table-responsive'}>
                            {
                                <span>{source[item.fieldName]}</span>
                            }
                          </div>
                        </div>
                      ))
                    }

                  </div>
                  {/* {
                                        h.edit &&
                                        <div className={'tbl-list-content-row'}>
                                            <div className="tbl-columm-comment">
                                                <div className="tbl-column-chk-inner">

                                                </div>
                                            </div>

                                            <div className="tbl-row-comment">
                                                <input type="text" />
                                                <CeIcon.SendButtonIcon onClick={() => {
                                                  h.edit = !h.edit;
                                                  this.setState({ change: true });
                                                }} />
                                            </div>

                                        </div>
                                    } */}
                </div>
              ))
            }
          </div>

        </div>
        <div className="tbl-list-right" >

          <div className={this.searchEnable ? 'tbl-list-column-header-right-search' : 'tbl-list-column-header-right'}>
            <CeIcon.PencilIcon className="search" onClick={() => {
              this.searchEnable = !this.searchEnable;
              this.setState({ change: true });
            }} /> </div>

          {
            this.props.sources.map((h, i) => (
              <div className="tbl-list-content-row">
                <div className={'tbl-list-column-content-right ' + i}>
                  {/* {
                                        !h.edit ?

                                            <span className="">
                                                <CeIcon.PencilIcon onClick={() => {
                                                  h.edit = !h.edit;
                                                  this.setState({ change: true });
                                                }} />
                                            </span> :
                                            <span className="ce-flex">
                                                <CeIcon.CheckSolidIcon className="ml-3" onClick={() => {
                                                  h.edit = !h.edit;
                                                  this.setState({ change: true });
                                                }} />
                                                <CeIcon.CloseSolidIcon onClick={() => {
                                                  h.edit = !h.edit;
                                                  this.setState({ change: true });
                                                }} />
                                            </span>
                                    } */}
                  <span className="ce-flex">
                    <CeIcon.CheckSolidIcon className="ml-3"
                    // onClick={() => {
                    //     h.edit = !h.edit;
                    //     this.setState({ change: true });
                    // }} 
                    />
                    <CeIcon.CloseSolidIcon
                    // onClick={() => {
                    //     h.edit = !h.edit;
                    //     this.setState({ change: true });
                    // }} 
                    />
                  </span>
                </div>
                {/* {
                                    h.edit && <div className="right-download">
                                        <span >
                                            <CeIcon.DownloadIcon onClick={() => {
                                              h.edit = !h.edit;
                                              this.setState({ change: true });
                                            }} />
                                        </span>
                                    </div>
                                } */}
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default TableList;
