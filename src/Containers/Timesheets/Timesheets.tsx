import React from 'react';

import Right from '../../Images/chevron-right-12.png';
import Search from '../../Images/search.png';
import { PagingComponent } from '../Components';
import DropdownComponent from '../Components/Dropdownlist/Dropdown.Component';

import InvoicIcon from '../../Images/icon_Invoices.png';
import FileDownloadIcon from '../../Images/file-download-solid.png';
import CheckboxComponent from '../Components/Controls/Checkbox.Component';
import CETSearchInput from '../Components/Controls/SearchInput.Component';
import AddWorkerIcon from '../../Images/worker.png';
import mainStore from '../../Stores/mainStore';
import { observer } from 'mobx-react';
import moment from 'moment';
import { formatDate } from '../../Utils/Date';
import { JOB_STATUSES } from '../../Constants/job';
import Select from 'react-select';
import { setReactionScheduler } from 'mobx/lib/internal';
import { WorkerAsyncSearch } from '../Components/Controls/WorkerAsyncSearch';
import authStore from '../../Stores/authStore';
import { timesheetAPI } from '../../Services/API';

const statuses = [
  {
    value: JOB_STATUSES.New,
    label: JOB_STATUSES[JOB_STATUSES.New]
  },
  {
    value: JOB_STATUSES.InProgress,
    label: JOB_STATUSES[JOB_STATUSES.InProgress]
  },
  {
    value: JOB_STATUSES.Completed,
    label: JOB_STATUSES[JOB_STATUSES.Completed]
  },
  {
    value: JOB_STATUSES.Billed,
    label: JOB_STATUSES[JOB_STATUSES.Billed]
  },
  {
    value: JOB_STATUSES.Cancelled,
    label: JOB_STATUSES[JOB_STATUSES.Cancelled]
  },
  {
    value: JOB_STATUSES.Paid,
    label: JOB_STATUSES[JOB_STATUSES.Paid]
  }
];

@observer
export class Timesheets extends React.Component<any, any> {
  isToggleModal: boolean;
  colSpan = 7;
  details = {} as any;
  searchEnable = false;
  timer = null;
  state = {
    searchParams: {},
    selected: [],
    withSearch: false
  };

  toggleAll = checked => {
    this.setState(state => ({
      selected: checked
        ? mainStore.timesheets.map(timesheets => timesheets.id)
        : []
    }));
  };

  toggleTimesheet = id => {
    const exist = this.state.selected.includes(id);
    this.setState(state => ({
      selected: exist
        ? state.selected.filter(_id => _id !== id)
        : [...state.selected, id]
    }));
  };

  showModal() {
    this.isToggleModal = true;
    this.setState({ change: true });
  }
  closeModal() {
    this.isToggleModal = false;
    this.setState({ change: true });
  }

  toggleDetails(name) {
    this.details[name] = !this.details[name];
    this.setState({ change: true });
  }

  toggleSearch = () => {
    this.setState(
      state => ({ withSearch: !state.withSearch }),
      this.loadTimesheetsWithDelay
    );
  };

  downloadSelected = event => {
    event.preventDefault();

    // function download(...urls) {
    //   urls.forEach(url => {
    //     let iframe = document.createElement('iframe');
    //     iframe.style.visibility = 'collapse';
    //     document.body.append(iframe);

    //     iframe.contentDocument.write(
    //       `<form action="${url.replace(/\"/g, '"')}" method="GET"></form>`
    //     );
    //     console.log('AAAAAaa')
    //     iframe.contentDocument.forms[0].submit();

    //     setTimeout(() => iframe.remove(), 2000);
    //   });
    // }

    // download(...this.state.selected)

    const link = document.createElement('a');

    link.setAttribute('download', null);
    link.setAttribute('target', '_blank');
    link.style.display = 'none';

    document.body.appendChild(link);

    this.state.selected.forEach(id => {
      link.setAttribute(
        'href',
        `${process.env.REACT_APP_API_ENDPOINT}/timesheets/${id}/pdf`
      );
      link.click();
    });

    document.body.removeChild(link);
  };

  renderDetailWorker(workers) {
    if (!workers || workers.length == 0) return '';
    return (
      <div className="row ml-0 mr-0">
        {workers.map((worker, index) => (
          <div className="view-name-worker">
            <span>{worker}</span>
          </div>
        ))}
      </div>
    );
  }

  handleChangeField(name) {
    return event => {
      const {
        currentTarget: { value }
      } = event;
      return this.props.setFieldValue(name, value);
    };
  }

  handleChangeSelectSearchParams = name => {
    return item => {
      this.setState(
        (state: any) => ({
          searchParams: {
            ...state.searchParams,
            [name]: item ? item.value : ''
          }
        }),
        this.loadTimesheetsWithDelay
      );
    };
  };

  handleChangeSearchParams = event => {
    const { name, value } = event.target;
    this.setState(
      (state: any) => ({
        searchParams: { ...state.searchParams, [name]: value }
      }),
      this.loadTimesheetsWithDelay
    );
  };

  loadTimesheetsWithDelay = () => {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(this.loadTimesheets, 700);
  };

  componentDidMount = () => {
    // if (this.props.match.params.id)
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('jobId');
    if (jobId) {
      this.setState(
        (state: any) => ({
          searchParams: { ...state.searchParams, jobId },
          withSearch: true
        }),
        this.loadTimesheets
      );
    } else {
      this.loadTimesheets();
    }
  };

  loadTimesheets = (params: any = this.state.searchParams) => {
    mainStore.loadTimeSheets(params);
  };

  onPaginationChange = (page: number) => {
    this.setState(
      (state: any) => ({ searchParams: { ...state.searchParams, page } }),
      this.loadTimesheetsWithDelay
    );
  };

  handleSubmit = (...props) => {
    this.props.handleSubmit(...props);
    this.closeModal();
  };

  downloadPdf = async (id: string) => {
    const response = await timesheetAPI.downloadPdf(id);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'timesheet.pdf');
    document.body.appendChild(link);
    link.click();
  }

  render() {
    const thNoBorderLeft = {
      borderLeft: 'none',
      width: '40px'
    };
    const thNoBorderRight = {
      borderRight: 'none'
    };
    const actionStyle = {
      display: 'flex'
    };
    const but = {
      border: '1px solid #dee2e6',
      backgroundColor: 'white',
      float: 'right'
    };
    return (
      <div className="container timesheet-list-page">
        <div className="page-header d-flex justify-content-between align-items-center">
          <div className="page-title">Timesheets</div>
          <div className="d-block" style={{ width: 180 }}>
            <Select
              isClearable
              options={statuses}
              placeholder={'Job Status'}
              onChange={this.handleChangeSelectSearchParams('jobStatus')}
            />
          </div>
        </div>
        <div className="table-invoices">
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th className="th-search">
                  <CheckboxComponent
                    onChange={this.toggleAll}
                    className="mb-0"
                    checked={
                      this.state.selected.length === mainStore.timesheets.length
                    }
                    id="all"
                    classNameIcon="m-auto"
                  />
                </th>
                <th className="th-search">
                  <span>Date</span>
                </th>
                <th className="th-search" style={{ minWidth: 170 }}>
                  <span>Worker</span>
                  {this.state.withSearch ? (
                    <div style={{ marginTop: 13 }}>
                      <WorkerAsyncSearch
                        onSelect={item =>
                          this.handleChangeSearchParams({
                            target: {
                              name: 'worker',
                              value: item ? item.value.id : null
                            }
                          })
                        }
                      />
                    </div>
                  ) : null}
                </th>
                <th className="th-search">
                  <span>Confirmation #</span>
                  {this.state.withSearch ? (
                    <CETSearchInput
                      name="confirmation"
                      onChange={this.handleChangeSearchParams}
                    />
                  ) : null}
                </th>
                <th className="th-search">
                  <span>PO #</span>
                  {this.state.withSearch ? (
                    <CETSearchInput
                      name="po"
                      onChange={this.handleChangeSearchParams}
                    />
                  ) : null}
                </th>
                <th className="th-search">
                  <span>Straight Hours</span>
                  {this.state.withSearch ? (
                    <CETSearchInput
                      name="straight_hr"
                      onChange={this.handleChangeSearchParams}
                    />
                  ) : null}
                </th>
                <th className="th-search">
                  <span>OverTime Hours</span>
                  {this.state.withSearch ? (
                    <CETSearchInput
                      name="overtime_hr"
                      onChange={this.handleChangeSearchParams}
                    />
                  ) : null}
                </th>
                <th style={thNoBorderRight} className="th-search">
                  <div className="ce-align-flex align-items-baseline">
                    <div>
                      <div>Holiday Hour</div>
                      {this.state.withSearch ? <CETSearchInput /> : null}
                    </div>
                    {this.state.selected.length ? (
                      <div className="d-flex">
                        <a
                          className="mx-3"
                          onClick={this.downloadSelected}
                        // href={`${process.env.REACT_APP_API_ENDPOINT}/timesheets/5da4a7cdf00c6757b81f927d/pdf`}
                        >
                          <img src={FileDownloadIcon} />
                        </a>
                        <a>
                          <img src={InvoicIcon} />
                        </a>
                      </div>
                    ) : null}
                  </div>
                </th>
                <th
                  style={{ ...thNoBorderLeft, cursor: 'pointer' }}
                  onClick={this.toggleSearch}
                  className="text-right"
                >
                  <img src={Search} />
                </th>
              </tr>
            </thead>
            <tbody
            // style={
            //   !Array.isArray(mainStore.timesheets) ||
            //   !mainStore.timesheets.length
            //     ? { minHeight: 100, display: 'flex' }
            //     : {}
            // }
            >
              {Array.isArray(mainStore.timesheets) &&
                mainStore.timesheets.map((item, index) => (
                  <tr
                    className="cursor-pointer"
                    onClick={() =>
                      this.props.history.push(`/timesheets/${item.id}/edit`)
                    }
                    key={`timesheet${index}`}
                  >
                    <td>
                      <CheckboxComponent
                        onChange={() => this.toggleTimesheet(item.id)}
                        className="mb-0"
                        checked={this.state.selected.includes(item.id)}
                        id={`item${index}`}
                        classNameIcon="m-auto"
                      />
                    </td>
                    <td>{formatDate(item.finishDate)}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-worker mr-3">
                          <img
                            alt="avatar"
                            className="avatar"
                            src={item.worker.avatar}
                          />
                        </div>{' '}
                        {item.worker.name}
                      </div>
                    </td>
                    <td>{item.confirmationNumber}</td>
                    <td>{item.po}</td>
                    <td>{item.regHours || 0}</td>
                    <td>{item.overtimeHours}</td>
                    <td style={thNoBorderRight}>
                      <div className="ce-align-flex">
                        <span>{item.holidayHours}</span>
                        <div>
                          <img className="mr-3 pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              this.downloadPdf(item.id)
                            }} src={FileDownloadIcon} />
                          {authStore.canDoTimesheetAction() && <a href="/invoices?create=true">
                            <img
                              src={InvoicIcon}
                              style={{ cursor: 'pointer' }}
                            />
                          </a>}
                        </div>
                      </div>
                    </td>
                    <td style={thNoBorderLeft}>
                      <a href={`/timesheets/${item.id}/edit`}>
                        <img src={Right} />
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-invoices">
          <PagingComponent
            totalItemsCount={mainStore.timesheetsLoader.total}
            onChangePage={this.onPaginationChange}
          />
        </div>
      </div>
    );
  }
}

export default Timesheets;
