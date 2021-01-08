import React from 'react';
import '../Invoices/Invoices.css';
import { PagingComponent } from '../Components';
import TableList from '../Components/TableList/TableList';
import invoiceStore from '../../Stores/invoiceStore';
import * as CeIcon from '../../Utils/Icon';

export class InvoiceDetails extends React.Component<any> {
  componentDidMount = () => {
    const { id } = this.props.match.params;
    if (!id) return;
    invoiceStore.getInvoice(id)
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
      <div className="px-5 invoice-details-page">
        <div className="page-header d-flex justify-content-between align-items-center">
          <div className="">04/04/19 - 04/12/19</div>
          <a target="_blank" href={`${process.env.REACT_APP_API_ENDPOINT}/invoices/${this.props.match.params.id}/xml`}
            className="btn-save-file d-flex align-items-center"
            style={{ cursor: 'pointer' }}>
            <CeIcon.DownloadIcon className="mr-2" />
            <span>Save to PDF</span>
          </a>
        </div>
        <div className="table-invoices">
          {/* <TableList sources={invoiceStore.invoice} headers={invoiceStore.headers} className="invoice-details-table" /> */}
        </div>
        <div className="pagination-invoices">
          <PagingComponent></PagingComponent>
        </div>
      </div>
    );
  }
}

export default InvoiceDetails;
