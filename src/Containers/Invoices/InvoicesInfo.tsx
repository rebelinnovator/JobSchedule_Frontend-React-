import { observer } from 'mobx-react';
import React from 'react';
import { JobType } from '../../Constants/job';
import Right from '../../Images/chevron-right-12.png';
import invoiceStore from '../../Stores/invoiceStore';
import { formatDate } from '../../Utils/Date';
import '../Invoices/Invoices.css';
import { AddInvoiceSliderComponent } from './InvoiceCreateSlide';
import { DEPARTMENT_GROUPS } from '../../Constants/user';


const headers = {
  [DEPARTMENT_GROUPS.ELECTRIC_GROUP]: ['Invoice date', 'Departments', 'Job Type', 'Timesheet Amount', 'POs', 'Paid', 'Regular', 'Overtime', 'Holiday', 'Total Due'],
  [DEPARTMENT_GROUPS.CONSTRUCTION_SERVICE_GROUP]: ['Invoice date', 'Departments', 'Job Type', 'Timesheet Amount', 'POs', 'Paid', 'St Time', ' Ot $', 'Emr Time$', 'Total Invoice Amount'],
  [DEPARTMENT_GROUPS.TRANSMISSION_SERVICE]: ['Invoice date', 'Departments', 'Job Type', 'Timesheet Amount', 'POs', 'Paid', 'St Time', ' Ot $', 'Emr Time$', 'Total Invoice Amount'],
}
@observer
export class InvoicesInfo extends React.Component<any> {
  showedAddInvoice: boolean;
  searchEnable = false;

  state: any = {
    search: {},
  };

  getLink = (invoice) => {
    return `/invoices/${this.props.match.params.id}/timesheets/${invoice.jobType}`;
  }

  componentDidMount = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const create = urlParams.get('create');
    if (create) {
      this.showedAddInvoice = true;
      this.setState({ change: true });
    }

    this.fetchInvoices();
  }

  handleChangeSearch = (name, value) => {
    this.setState((state: any) =>
      ({ search: { ...state.search, [name]: value } }), this.fetchInvoices);
  }

  fetchInvoices = () => {
    invoiceStore.getSubList(this.props.match.params.id, { ...this.state.search, page: 1 });
  }

  onPaginationChange = (page: number) => {
    this.setState(
      (state: any) => ({ search: { ...state.search, page } }),
      this.fetchInvoices);
  };

  handleChangeSearchParams = (event) => {
    const { name, value } = event.target;
    this.handleChangeSearch(name, value);
  };

  addInvoice() {
    this.showedAddInvoice = true;
    this.setState({ change: true });
  }

  closeInvoice() {
    this.showedAddInvoice = false;
    this.setState({ change: true });
  }

  showFilter = () => {

  }

  render() {
    const thNoBorderLeft = {
      borderLeft: 'none',
    };
    const thNoBorderRight = {
      borderRight: 'none',
    };
    return (
      <div className="px-5 invoices-list-page">
        <div className="page-header d-flex justify-content-between align-items-center">
          <div className="page-title">Invoices</div>
          <button type="button" className="btn btn-success btn-add" onClick={() => this.addInvoice()}>Configure New
            Invoice</button>
        </div>
        <div className="table-invoices">
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th className="th-search">
                  <span>Invoice Date</span>
                  {/* <CETSearchInput
                    name={'invoiceDate'}
                    onChange={this.handleChangeSearchParams} /> */}
                </th>
                <th className="th-search">
                  <span>Departments</span>
                  {/* <CETSearchInput
                    name={'deparment'}
                    onChange={this.handleChangeSearchParams} /> */}
                </th>
                <th className="text-left th-search" style={thNoBorderRight}>
                  <span>Job Types</span>
                  {/* <CETSearchInput
                    name={'jobType'}
                    onChange={this.handleChangeSearchParams} /> */}
                </th>
                <th className="th-search">
                  <span>Timesheets Amount</span>
                  {/* <CETSearchInput
                    name={'timesheets_amount'}
                    onChange={this.handleChangeSearchParams} /> */}
                </th>
                <th className="th-search">
                  <span>POs</span>
                  {/* <CETSearchInput
                    name={'po'}
                    onChange={this.handleChangeSearchParams} /> */}
                </th>
                <th className="th-search ">
                  <span>Paid</span>
                  {/* <CETSearchInput
                    name={'paid'}
                    onChange={this.handleChangeSearchParams} /> */}

                </th>
                <th className="th-search">
                  <span>Regular</span>
                  {/* <CETSearchInput
                    name={'billingCycle'}
                    onChange={this.handleChangeSearchParams} /> */}
                </th>

                <th className="th-search">
                  <span>Overtime</span>
                  {/* <CETSearchInput
                    name={'billingCycle'}
                    onChange={this.handleChangeSearchParams} /> */}
                </th>

                <th className="th-search">
                  <span>Holiday</span>
                  {/* <CETSearchInput
                    name={'billingCycle'}
                    onChange={this.handleChangeSearchParams} /> */}
                </th>

                <th className="th-search">
                  <span>Total Due</span>
                  {/* <CETSearchInput
                    name={'billingCycle'}
                    onChange={this.handleChangeSearchParams} /> */}
                </th>


                <th className="text-right" style={thNoBorderLeft}>
                  {/* <img className="cursor-pointer" src={Search} /> */}
                </th>
              </tr>
            </thead>
            <tbody>
              {invoiceStore.sublist.map(invoice => {
                const link = this.getLink(invoice);

                return (<tr className={'cursor-pointer'} onClick={() => this.props.history.push(link)}>
                  {/* <td>{invoice.uid}</td> */}
                  <td>{formatDate(invoice.date)} - {formatDate(invoice.endDateTime)}</td>
                  <td>{invoice.departments.join(', ')}</td>
                  <td>{JobType[invoice.jobType]}</td>
                  <td>{invoice.totalAmount}</td>
                  <td>{invoice.po}</td>
                  <td>{invoice.paid}</td>
                  <td>{invoice.regular}</td>
                  <td>{invoice.overtime}</td>
                  <td>{invoice.holiday}</td>
                  <td>${invoice.total}</td>
                  <th className="text-right" style={thNoBorderLeft}>
                    <a href={link}><img src={Right} /></a>
                  </th>
                </tr>)
              }

              )}
            </tbody>
          </table>
        </div>
        {/* <div className="pagination-invoices">
          <PagingComponent
            totalItemsCount={invoiceStore.pagination.total}
            onChangePage={this.onPaginationChange} />
        </div> */}
        <AddInvoiceSliderComponent
          updateInvoices={this.fetchInvoices}
          showed={this.showedAddInvoice}
          closeSlide={() => this.closeInvoice()} />
      </div>
    );
  }
}

export default InvoicesInfo;
