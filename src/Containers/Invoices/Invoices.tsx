import { observer } from 'mobx-react';
import React from 'react';
import Select from 'react-select';
import { JobType } from '../../Constants/job';
import Right from '../../Images/chevron-right-12.png';
import { BILLING_CYCLE } from '../../Models/invoiceItem';
import invoiceStore from '../../Stores/invoiceStore';
import { formatDate } from '../../Utils/Date';
import { PagingComponent } from '../Components';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import CETSearchInput from '../Components/Controls/SearchInput.Component';
import '../Invoices/Invoices.css';
import { AddInvoiceSliderComponent } from './InvoiceCreateSlide';
import DateComponent from '../Components/Date/Date.Component';
const jobtypes = [
  {
    value: JobType.Flagging,
    label: JobType[JobType.Flagging],
  },
  {
    value: JobType.Parking,
    label: JobType[JobType.Parking],
  },
  {
    value: JobType.Signage,
    label: JobType[JobType.Signage],
  },
]


const execute = [18, 14, 13, 12, 11, 10]
@observer
export class Invoices extends React.Component<any> {
  showedAddInvoice: boolean;
  searchEnable = false;

  state: any = {
    search: {
      page: 1
    },
  };

  getLink = (invoice) => {
    if (invoice.departments.some(department => execute.includes(department))) {
      return `/invoices/${invoice.id}`;
    }

    return `/invoices/${invoice.id}/info`;
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
    invoiceStore.getList({ ...this.state.search });
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
                <th className="th-search">Id</th>
                <th className="th-search">
                  <span>Invoice Date</span>
                  <div style={{ marginTop: 13 }}>
                    <DateComponent
                      date={this.state.search.invoiceDate}
                      onChange={date => this.handleChangeSearch('invoiceDate', date)} />
                  </div>
                  {/* <CETSearchInput
                    name={'invoiceDate'}
                    onChange={this.handleChangeSearchParams} /> */}
                </th>
                <th className="th-search">
                  <span>Departments</span>
                  {/* <CETSearchInput
                    name={'deparment'}
                    onChange={this.handleChangeSearchParams} /> */}
                  <div style={{ marginTop: 13 }}>
                    <DepartmentAsyncSearch isMulti onSelect={(item: any) =>
                      item ? this.handleChangeSearch('departments', item.map(i => i.value.id)) :
                        this.handleChangeSearch('departments', null)} />
                  </div>

                </th>
                <th className="th-search">
                  <span>Timesheets Amount</span>
                  <CETSearchInput
                    name={'timesheets_amount'}
                    onChange={this.handleChangeSearchParams} />
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
                  <span>Billing Cycle</span>
                  <div style={{ marginTop: 13 }}>
                    <Select
                      isClearable
                      options={[
                        { value: BILLING_CYCLE.Daily, label: BILLING_CYCLE[BILLING_CYCLE.Daily] },
                        { value: BILLING_CYCLE.Weekly, label: BILLING_CYCLE[BILLING_CYCLE.Weekly] },
                        { value: BILLING_CYCLE.Monthly, label: BILLING_CYCLE[BILLING_CYCLE.Monthly] },
                      ]} placeholder={'Cycle'}
                      onChange={(item: any) =>
                        item ? this.handleChangeSearch('billingCycle', item.value) :
                          this.handleChangeSearch('billingCycle', null)} />
                  </div>
                </th>
                <th className="text-left th-search" style={thNoBorderRight}>
                  <span>Job Types</span>
                  <div style={{ marginTop: 13 }}>
                    <Select
                      isClearable
                      isMulti
                      options={jobtypes} placeholder={'Job Type'}
                      onChange={(item: any) =>
                        item ? this.handleChangeSearch('jobType', item.map(i => i.value)) :
                          this.handleChangeSearch('jobType', null)} />
                  </div>
                  {/* <DepartmentAsyncSearch isMulti onSelect={(item: any) =>
                    item ? this.handleChangeSearch('jobType', item.map(i => i.value.id)) :
                      this.handleChangeSearch('jobType', null)} /> */}
                  {/* </div> */}
                  {/* <CETSearchInput
                    name={'jobType'}
                    onChange={this.handleChangeSearchParams} /> */}
                </th>
                <th className="text-right" style={thNoBorderLeft}>
                  {/* <img className="cursor-pointer" src={Search} /> */}
                </th>
              </tr>
            </thead>
            <tbody>
              {invoiceStore.list.map(invoice => {
                const link = this.getLink(invoice);

                return (<tr onClick={() => this.props.history.push(link)} className="cursor-pointer">
                  <td>{invoice.uid}</td>
                  <td>{formatDate(invoice.date)} - {formatDate(invoice.endDate)}</td>
                  <td>{invoice.departmentNames.join(', ')}</td>
                  <td>{invoice.totalAmount}</td>
                  <td>{invoice.po}</td>
                  <td>{invoice.paid}</td>
                  <td>{BILLING_CYCLE[invoice.billingCycle]}</td>
                  <td className="text-left" style={thNoBorderRight}>
                    {invoice.pricing.map(price => JobType[price.jobType]).join(', ')}</td>
                  <th className="text-right" style={thNoBorderLeft}>
                    <a href={link}><img src={Right} /></a>
                  </th>
                </tr>)
              }

              )}
            </tbody>
          </table>
        </div>
        <div className="pagination-invoices">
          <PagingComponent
            totalItemsCount={invoiceStore.pagination.total}
            onChangePage={this.onPaginationChange} />
        </div>
        {
          this.showedAddInvoice ? <AddInvoiceSliderComponent
            updateInvoices={this.fetchInvoices}
            showed={this.showedAddInvoice}
            closeSlide={() => this.closeInvoice()} /> : null
        }

      </div >
    );
  }
}

export default Invoices;
