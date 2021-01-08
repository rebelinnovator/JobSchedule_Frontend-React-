import { observer } from 'mobx-react';
import React from 'react';
import { DEPARTMENT_GROUPS } from '../../Constants/user';
import { InvoiceItem } from '../../Models/invoiceItem';
import { invoiceAPI } from '../../Services/API';
import invoiceStore from '../../Stores/invoiceStore';
import { formatDate, FORMATES } from '../../Utils/Date';
import { PagingComponent } from '../Components';
import CheckboxComponent from '../Components/Controls/Checkbox.Component';
import '../Invoices/Invoices.css';
const thNoBorderLeft = {
  borderLeft: 'none'
};
const thNoBorderRight = {
  borderRight: 'none'
};

const headers = [
  {
    key: 'dateOfService',
    name: 'Date Of Service'
  },
  {
    key: 'department',
    name: 'Department'
  },
  {
    key: 'section',
    name: 'Section #'
  },
  {
    key: 'po',
    name: 'PO #'
  },
  {
    key: 'paid',
    name: 'Billed'
  },
  {
    key: 'billed',
    name: 'Billed'
  },
  {
    key: 'ticketNumber',
    name: 'Coned Ed Ticket #'
  },
  {
    key: 'ticketNum',
    name: 'CE Solutions JOB TICKET#'
  },
  {
    key: 'requestor',
    name: 'Requestor'
  },
  {
    key: 'requestTime',
    name: 'Request Time'
  },
  {
    key: 'tsReceived',
    name: 'T/S RECEIVED'
  },
  {
    key: 'supervisor',
    name: 'Supervisor'
  },
  {
    key: 'conedJobTicket',
    name: 'CE Solution Job Ticket #'
  },
  {
    key: 'muni',
    name: 'Muni'
  },
  {
    key: 'flaggerName',
    name: 'Flagger Name'
  },
  {
    key: 'flaggerEmploe',
    name: 'Flagger Emloyee #'
  },
  {
    key: 'startDateTime',
    name: 'Start Date/Time'
  },
  {
    key: 'endDateTime',
    name: 'End Date/Time'
  },
  {
    key: 'breakTaken',
    name: '1/2 Hour Break Taken'
  },
  {
    key: 'totalHours',
    name: 'Total HRS Worked'
  },
  {
    key: 'billableHours',
    name: 'Billable HRS'
  },
  {
    key: 'regularHours',
    name: 'Regular Hours'
  },
  // {
  // 	key: 'strTime',
  // 	name: 'Billable HRS',
  // },
  {
    key: 'strTime',
    name: 'Str Time'
  },
  {
    key: 'strTimeAmount',
    name: 'St Time$'
  },
  {
    key: 'overtimeHours',
    name: 'OT'
  },
  {
    key: 'overtimeAmount',
    name: 'Ot $'
  },
  {
    key: 'location',
    name: 'Location Address & Cross Street'
  },
  {
    key: 'holidayHours',
    name: 'Holiday Hours'
  },
  {
    key: 'totalAmount',
    name: 'Total Invoice Amount'
  },
  {
    key: 'confirmationNumber',
    name: 'CES ConfNo'
  },
  {
    key: 'requestDate',
    name: 'Job Request Date'
  },

  {
    key: 'emrTime',
    name: 'Emr Hrs'
  },
  {
    key: 'emrAmount',
    name: 'Emr Time $'
  },
  {
    key: 'totalAmount',
    name: 'TOTAL INVOICE AMOUNT'
  },

  {
    key: 'jobStartDate',
    name: 'Job Start Date'
  },
  {
    key: 'conedTicketNumber',
    name: 'Coned ticket #'
  },

  {
    key: 'confNumber',
    name: 'Conf No'
  },
  {
    key: 'requisition',
    name: 'Requisition #'
  },
  {
    key: 'order',
    name: 'Purchase Order #'
  },
  {
    key: 'receipted',
    name: 'Receipted'
  },

  {
    key: 'timesheetNum',
    name: 'Timesheet #'
  },
  {
    key: 'pa',
    name: 'PA'
  },
  {
    key: 'additionalLocations',
    name: 'Additional Locations'
  },
  {
    key: 'worker',
    name: 'Worker'
  },
  {
    key: 'remarks',
    name: 'Remarks'
  },
  {
    key: 'conedRemarks',
    name: 'Con Ed Remarks'
  },
  {
    key: 'serviceType',
    name: 'Service Type'
  }
];

const getHeaders = (
  departmentType = DEPARTMENT_GROUPS.CONSTRUCTION_SERVICE_GROUP
) => {
  if (departmentType === DEPARTMENT_GROUPS.CONSTRUCTION_SERVICE_GROUP) {
    return [
      'confirmationNumber',
      'startDateTime',
      'endDateTime',
      'requestDate',
      'requestor',
      'department',
      'po',
      'location',
      'totalHours',
      'billableHours',
      'strTime',
      'strTimeAmount',
      'overtimeHours',
      'overtimeAmount',
      'emrTime',
      'emrAmount',
      'totalAmount'
    ];
  } else if (departmentType === DEPARTMENT_GROUPS.ELECTRIC_GROUP) {
    return [
      'dateOfService',
      'department',
      'section',
      'po',
      'billed',
      'ticketNumber',
      'requestor',
      'requestTime',
      'supervisor',
      'ticketNum',
      'location',
      'muni',
      'flaggerName', // @ToDo change
      'flaggerEmploe', // @ToDo change
      'tsReceived', // @ToDo change
      'startDateTime',
      'endDateTime',
      'breakTaken',
      'totalHours',
      'regularHours',
      'overtimeHours',
      'holidayHours',
      'totalAmount'
    ];
  } else if (departmentType === DEPARTMENT_GROUPS.GAS_PRESSURE_CONTROL_GROUP) {
    return [
      'startDateTime',
      'endDateTime',
      'requestDate',
      'jobStartDate', // @ToDo change
      'department',
      'supervisor',
      'ticketNum', // @ToDo change
      'conedTicketNumber', // @ToDo change
      'confNumber',
      'requisition',
      'order',
      'receipted',
      'requestor',
      'timesheetNum',
      'pa',
      'location',
      'additionalLocations',
      'worker',
      'remarks',
      'conedRemarks',
      'totalHours',
      'billableHours',
      'strTime',
      'strTimeAmount',
      'overtimeHours',
      'overtimeAmount',
      'emrTime',
      'emrAmount',
      'totalAmount',
      'paid',
      'serviceType'
    ];
  } else if (departmentType === DEPARTMENT_GROUPS.TRANSMISSION_SERVICE) {
    return [
      'requestDate',
      'jobStartDate', // @ToDo change
      'department',
      'location',
      'emrNumber',
      'remarks',
      'totalHours',
      'billableHours',
      'strTime',
      'strTimeAmount',
      'overtimeHours',
      'overtimeAmount',
      'emrTime',
      'emrAmount',
      'totalAmount'
    ];
  }
};

@observer
class InvoiceDetailsFull extends React.Component<any> {
  state: any = {
    search: {}
  };

  componentDidMount = () => {
    this.fetchInvoice(1);
  };

  onPaginationChange = (page: number) => {
    this.fetchInvoice(page);
  };

  find = async () => {
    const { id } = this.props.match.params;
    await invoiceStore.getInvoice(id, this.state.search);
  };

  fetchInvoice = (page = 1) => {
    const { id } = this.props.match.params;
    if (!id) return;
    invoiceStore.getInvoice(id, { page }, this.props.match.params.jobType);
  };

  handleChangeFilter = (key: string, value: any) => {
    this.setState({ [key]: value }, this.find);
  };

  showFilter = () => { };

  renderInvoiceRow = (invoice: InvoiceItem, th: any[]) => {
    return (
      <tr onClick={() => this.props.history.push(`/job/${invoice.jobId}`)}>
        <td>
          <CheckboxComponent id="1" hasTitle="&nbsp;"></CheckboxComponent>
        </td>
        {th.map(header => {
          let text = '';
          switch (header.key) {
            case 'startDateTime':
              text = `${formatDate(invoice.startDateTime, FORMATES.datetime)}`;
              break;
            case 'endDateTime':
              text = `${formatDate(invoice.endDateTime, FORMATES.datetime)}`;
              break;
            case 'totalAmount':
              text = `$${invoice.total || invoice.totalAmount}`;
              break;
            case 'paid':
              text = invoice[header.key] ? 'Yes' : 'No';
              break;
            case 'muni':
              text = invoice.muni ? invoice.muni.label : 'None';
              break;
            case 'location':
              text = Array.isArray(invoice.location)
                ? invoice.location.map(location => location.address).join('; ')
                : invoice.location.address;
              break;

            default:
              const type = typeof invoice[header.key];
              text =
                type !== 'undefined' && type !== 'object'
                  ? invoice[header.key]
                  : 'None';
              break;
          }

          return <td>{`${text}`}</td>;
        })}
      </tr>
    );
  };

  download = async () => {
    const response = await invoiceAPI.download(this.props.match.params.id);

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'invoice.xlsx');
    document.body.appendChild(link);
    link.click();
  }

  render() {
    const headerKeys = getHeaders(invoiceStore.invoice.departmentType);
    const _headers: any[] = headerKeys.map(
      key => headers.find(header => header.key === key) || { name: '', key: '' }
    );
    return (
      <div className="px-5 invoice-details-page">
        <div className="page-header d-flex justify-content-between align-items-center">
          <div className="">
            {formatDate(invoiceStore.invoice.startDate)} -{' '}
            {formatDate(invoiceStore.invoice.endDate)}
          </div>
          <button
            onClick={this.download}
            className="btn-save-file"
          >
            <i className="fa fa-download mr-2"></i>
            Save to Excel
          </button>
        </div>
        <div className="table-invoices">
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th>
                  <CheckboxComponent
                    className="mb-0"
                    id="all"
                    hasTitle="&nbsp;"
                  ></CheckboxComponent>
                </th>
                {_headers.map(header => {
                  return <th>{`${header.name}`}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {invoiceStore.invoice.timesheets.map(timesheet =>
                this.renderInvoiceRow(timesheet, _headers)
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination-invoices">
          <PagingComponent
            totalItemsCount={invoiceStore.invoicePagination.total}
            onChangePage={this.onPaginationChange}
          />
        </div>
      </div>
    );
  }
}

export default InvoiceDetailsFull;
