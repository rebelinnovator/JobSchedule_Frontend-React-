import * as React from 'react';
import './style.scss';
import DateComponent from '../Components/Date/Date.Component';
import ChexboxComponent from '../Components/Controls/Checkbox.Component';
import CETSearchRadiusComponent from '../Components/Controls/SearchRadius.Component';
import CETextInputComponent from '../Components/Controls/TextInput.Component';
import { JOB_STATUSES, JobType } from '../../Constants/job';
import { observer } from 'mobx-react';

import search from '../../Images/search.png';
import './searchstyle.scss';
import * as CeIcon from '../../Utils/Icon';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import LocationsAsyncSearch from '../Components/Controls/LocationsAsyncSearch';
import MunicipalitysAsyncSearch from '../Components/Controls/MunicipalitysAsyncSearch';
import { WorkerAsyncSearch } from '../Components/Controls/WorkerAsyncSearch';
import { RequestorAsyncSearch } from '../Components/Controls/RequestorAsyncSearch';
import CheckboxComponent from '../Components/Controls/Checkbox.Component';

interface Props {
  hasJobType?: boolean;
  hasJobStatus?: boolean;
  hasRequestDate?: boolean;
  hasDepartment?: boolean;
  hasRequestor?: boolean;
  hasWorker?: boolean;
  hasAdress?: boolean;
  hasFieldSupervisor?: boolean;
  hasBorough?: boolean;
  hasNumber?: boolean;
  hasFilter?: boolean;
  hasSort?: boolean;
  showFilter?: boolean;
  onFilter?: Function;
  onFilterPress?: (event) => void;
  search: (params: any) => void;
  onFilterByLocation?: (location, radius, radiusType) => void;
}
const date = new Date();
const initialState = {
  search: {
    jobType: [],
    jobStatus: [],
    requestDate: {},
  },
  showSort: false,
};

export class FilterComponent extends React.Component<Props> {
  state: any;
  constructor(props) {
    super(props);
    this.state = {
      // ...initialState,
      search: {
        jobType: [],
        jobStatus: [],
        requestDate: {},
      },
      showFilter: props.showFilter,
    };
  }

  componentDidMount = () => {
    this.onFilterChanged(initialState);
  };

  handleChangeSeort = (name, dir = 'asc') => {
    this.setState({ showSort: false });
    this.handleChangeFilter('sort', name, { dir });
  };

  toggleFilterView = () => {
    this.setState((state: any) => ({ showFilter: !state.showFilter }));
  };

  toggleSortView = () => {
    this.setState((state: any) => ({ showSort: !state.showSort }));
  };

  static defaultProps = {
    onFilterPress: (event: any) => {},
  };

  clearFilters = () => {
    this.setState(initialState);
    this.setState((state: any) => initialState, this.onFilterChanged);
    this.forceUpdate();
  };

  onFilterChanged = (filters? : any) => {
    if (filters) {
      this.props.search(filters.search);
    } else {
      this.props.search(this.state.search);
    }
  };

  handleChangeJobType = (name) => (checked) => {
    if (name === 'all') {
      this.setState(
        (state: any) => ({
          search: {
            ...state.search,
            jobType: checked
              ? [JobType.Parking, JobType.Flagging, JobType.Signage]
              : [],
          },
        }),
        this.onFilterChanged
      );
      return;
    }

    this.setState(
      (state: any) => ({
        search: {
          ...state.search,
          jobType: checked
            ? [...state.search.jobType, name]
            : state.search.jobType.filter((type) => type !== name),
        },
      }),
      this.onFilterChanged
    );
  };

  handleChangeJobStatus = (name) => (checked) => {
    if (name === 'all') {
      this.handleChangeFilter(
        'jobStatus',
        checked
          ? [
              JOB_STATUSES.New,
              JOB_STATUSES.InProgress,
              JOB_STATUSES.Completed,
              JOB_STATUSES.Billed,
              JOB_STATUSES.Paid,
            ]
          : []
      );
      return;
    }

    this.setState(
      (state: any) => ({
        search: {
          ...state.search,
          jobStatus: checked
            ? [...state.search.jobStatus, name]
            : state.search.jobStatus.filter((type) => type !== name),
        },
      }),
      this.onFilterChanged
    );
  };

  handleChangeFilter = (name, value, fields = {}) => {
    this.setState(
      (state: any) => ({
        search: {
          ...state.search,
          [name]: value,
          ...fields,
        },
      }),
      () => {
        if (name === 'location' || name === 'radius' || name === 'radiusType') {
          if (
            this.state.search.location &&
            this.state.search.radius &&
            !isNaN(Number(this.state.search.radius)) &&
            this.state.search.radiusType
          ) {
            if (this.props.onFilterByLocation) {
              this.props.onFilterByLocation(
                this.state.search.location,
                Number(this.state.search.radius),
                this.state.search.radiusType
              );
            } else {
              this.props.onFilterByLocation(null, null, null);
            }
          }
        } else {
          this.onFilterChanged();
        }
      }
    );
  };

  handleChangeInput = (event) => {
    const {
      currentTarget: { name, value },
    } = event;
    this.handleChangeFilter(name, value);
  };

  onKeyUpSearch = (event) => {
    if (event.keyCode === 13) {
      const {
        currentTarget: { name, value },
      } = event;
      this.handleChangeFilter(name, value);
    }
  };

  renderHeader = () => {
    return (
      <div className="left-item">
        <div className="left-item-body d-flex">
          <div className="form-control-search mr-2 w-100">
            <img src={search} />
            <input
              className="ce-form-control "
              placeholder="Search"
              name="search"
              onBlur={this.handleChangeInput}
              onKeyUp={this.onKeyUpSearch}
            />
          </div>

          <div className="btn-group">
            {this.props.hasFilter ? (
              <button
                onClick={this.toggleFilterView}
                className={`btn border d-flex align-items-center p-relative ${
                  this.state.showFilter ? 'sort-active' : ''
                }`}
                type="button"
              >
                {this.state.showFilter ? (
                  <CeIcon.FilterWhiteIcon />
                ) : (
                  <CeIcon.FilterIcon />
                )}
              </button>
            ) : null}
            {this.props.hasSort && (
              <button
                data-popup
                onClick={this.toggleSortView}
                className={`btn border d-flex align-items-center p-relative ${
                  this.state.showSort ? 'sort-active' : ''
                }`}
                type="button"
              >
                {this.state.showSort ? (
                  <CeIcon.SortSolidWhiteIcon />
                ) : (
                  <CeIcon.SortSolidIcon />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  renderBody = () => {
    return (
      <div className="filter-box">
        <div className="left-item">
          <div className="job-type">
            <div className="left-item-header text-uppercase">
              <span>Job type</span>
            </div>
            <div className="left-item-body">
              <ChexboxComponent
                id="chkAll"
                className="mb-10"
                hasTitle="All"
                checked={this.state.search.jobType.length === 3}
                onChange={this.handleChangeJobType('all')}
              />

              <div className="content">
                <ChexboxComponent
                  id="chkParking"
                  className="mb-10"
                  hasTitle="Parking"
                  checked={this.state.search.jobType.includes(JobType.Parking)}
                  onChange={this.handleChangeJobType(JobType.Parking)}
                />

                <ChexboxComponent
                  id="chkFlagging"
                  className="mb-10"
                  hasTitle="Flagging"
                  checked={this.state.search.jobType.includes(JobType.Flagging)}
                  onChange={this.handleChangeJobType(JobType.Flagging)}
                ></ChexboxComponent>
                <ChexboxComponent
                  id="chkSignage"
                  className="mb-10"
                  hasTitle="Signage"
                  checked={this.state.search.jobType.includes(JobType.Signage)}
                  onChange={this.handleChangeJobType(JobType.Signage)}
                ></ChexboxComponent>
              </div>
            </div>
          </div>
          {this.props.hasJobStatus && (
            <div className="job-status">
              <div className="left-item-header text-uppercase">
                <span>Job Status</span>
              </div>
              <div className="left-item-body">
                <div className="header ">
                  <ChexboxComponent
                    id="chkStAll"
                    className="mb-10"
                    hasTitle="All"
                    checked={this.state.search.jobStatus.length === 5}
                    onChange={this.handleChangeJobStatus('all')}
                  />
                </div>
                <div className="content">
                  <div className="ce-content-box ce-padding-15">
                    <div>
                      <ChexboxComponent
                        id="chkNew"
                        className="mb-10"
                        hasTitle="New"
                        checked={this.state.search.jobStatus.includes(
                          JOB_STATUSES.New
                        )}
                        onChange={this.handleChangeJobStatus(JOB_STATUSES.New)}
                      />
                      <ChexboxComponent
                        id="chkInProgres"
                        className="mb-10"
                        hasTitle="InProgress"
                        checked={this.state.search.jobStatus.includes(
                          JOB_STATUSES.InProgress
                        )}
                        onChange={this.handleChangeJobStatus(
                          JOB_STATUSES.InProgress
                        )}
                      />
                      <ChexboxComponent
                        id="chkCompleted"
                        className="mb-10"
                        hasTitle="Completed"
                        checked={this.state.search.jobStatus.includes(
                          JOB_STATUSES.Completed
                        )}
                        onChange={this.handleChangeJobStatus(
                          JOB_STATUSES.Completed
                        )}
                      />
                    </div>
                  </div>
                  <div className="ce-content-box">
                    <ChexboxComponent
                      className="mb-10"
                      id="chkBilled"
                      hasTitle="Billed"
                      checked={this.state.search.jobStatus.includes(
                        JOB_STATUSES.Billed
                      )}
                      onChange={this.handleChangeJobStatus(JOB_STATUSES.Billed)}
                    />

                    <ChexboxComponent
                      id="chkPaid"
                      className="mb-10"
                      hasTitle="Paid"
                      checked={this.state.search.jobStatus.includes(
                        JOB_STATUSES.Paid
                      )}
                      onChange={this.handleChangeJobStatus(JOB_STATUSES.Paid)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="schedule">
            <div className="ce-content-box ">
              <ChexboxComponent
                checked={this.state.search.schedules_needed}
                onChange={(checked) =>
                  this.handleChangeFilter('schedules_needed', checked)
                }
                id="chkSchedule"
                className="mb-10"
                hasTitle="Schedules Needed"
              />
              <ChexboxComponent
                checked={this.state.search.late_workers}
                onChange={(checked) =>
                  this.handleChangeFilter('late_workers', checked)
                }
                id="chklateWork"
                className="mb-10"
                hasTitle="Late Workers"
              />
            </div>
            <div className="ce-content-box">
              <ChexboxComponent
                id="chkCanceled"
                className="mb-10"
                hasTitle="Canceled Jobs"
                checked={this.state.search.canceled_job}
                onChange={(checked) =>
                  this.handleChangeFilter('canceled_job', checked)
                }
              />
              <ChexboxComponent
                id="chkUnassigned"
                className="mb-10"
                hasTitle="Unassigned"
                checked={this.state.search.unassigned}
                onChange={(checked) =>
                  this.handleChangeFilter('unassigned', checked)
                }
              />
            </div>
          </div>
          {this.props.hasRequestDate && (
            <div className="request-date">
              <div className="left-item-header text-uppercase">
                <span>Request date</span>
              </div>
              <div className="left-item-body d-flex">
                <div className="request-date-content">
                  <DateComponent
                    maxDate={this.state.search.requestDate.to}
                    date={this.state.search.requestDate.from}
                    onChange={(date) =>
                      this.handleChangeFilter('requestDate', {
                        ...this.state.search.requestDate,
                        from: date,
                      })
                    }
                  />
                  <div className="separater-date"></div>
                  <DateComponent
                    minDate={this.state.search.requestDate.from}
                    date={this.state.search.requestDate.to}
                    onChange={(date) =>
                      this.handleChangeFilter('requestDate', {
                        ...this.state.search.requestDate,
                        to: date,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          {this.props.hasDepartment && (
            <div>
              <div className="left-item-header text-uppercase">
                <span>Department</span>
              </div>
              <div className="m-3">
                <DepartmentAsyncSearch
                  onSelect={(item) =>
                    this.handleChangeFilter(
                      'department',
                      item ? Number(item.value.id) : null
                    )
                  }
                />
              </div>
            </div>
          )}
          {this.props.hasRequestor && (
            <div>
              <div className="left-item-header text-uppercase">
                <span>Requestor</span>
              </div>
              <div className="m-3">
                <RequestorAsyncSearch
                  onSelect={(item) =>
                    this.handleChangeFilter(
                      'requestor',
                      item ? item.value.id : null
                    )
                  }
                />
              </div>
            </div>
          )}
          {this.props.hasFieldSupervisor && (
            <div className="field-supervisor">
              <div className="left-item-header text-uppercase">
                <span>Field Supervisor</span>
              </div>
              <div className="left-item-body">
                <CheckboxComponent
                  checked={this.state.search.field_supervisor}
                  onChange={(checked) =>
                    this.handleChangeFilter('field_supervisor', checked)
                  }
                  id="field_supervisor"
                  className="mb-10"
                  hasTitle="View All Dept Jobs"
                />
              </div>
            </div>
          )}
          {this.props.hasWorker && (
            <div>
              <div className="left-item-header text-uppercase">
                <span>Worker</span>
              </div>
              <div className="m-3">
                <WorkerAsyncSearch
                  onSelect={(item) =>
                    this.handleChangeFilter(
                      'workerId',
                      item && item.value ? item.value.id : null
                    )
                  }
                />
              </div>
            </div>
          )}
          {this.props.hasAdress && (
            <div>
              <div className="left-item-header text-uppercase">
                <span>Adress</span>
              </div>
              <div className="left-item-body">
                <LocationsAsyncSearch
                  onSelect={(item) =>
                    this.handleChangeFilter(
                      'location',
                      item ? item.value : null
                    )
                  }
                />
              </div>
              <div className="left-item-body">
                <CETSearchRadiusComponent
                  onChange={(value) => this.handleChangeFilter('radius', value)}
                  onChangeType={(value) =>
                    this.handleChangeFilter('radiusType', value)
                  }
                  value={this.state.search.radius}
                  title="Search Radius"
                />
              </div>
            </div>
          )}
          {this.props.hasBorough && (
            <div className="borought-box">
              <div className="left-item-header text-uppercase">
                <span>Borough</span>
              </div>
              <div className="left-item-body d-flex">
                <div className="d-block w-100">
                  <MunicipalitysAsyncSearch
                    isMulti
                    onSelect={(items: any) =>
                      this.handleChangeFilter(
                        'municipality',
                        items.map((item) => item.value.id)
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}
          {this.props.hasNumber && (
            <div>
              <div className="left-item-header text-uppercase">
                <span>Numbers</span>
              </div>
              <div className="left-item-body">
                <CETextInputComponent
                  onChange={this.handleChangeInput}
                  name={'structure'}
                  className="ce-pd-bottom-20"
                  title="Structure Number"
                />
                <CETextInputComponent
                  onChange={this.handleChangeInput}
                  name={'purchase'}
                  className="ce-pd-bottom-20"
                  title="Purchase Order Number"
                />
                <CETextInputComponent
                  onChange={this.handleChangeInput}
                  name={'worker_number'}
                  className="ce-pd-bottom-20"
                  title="Worker Request Number"
                />
              </div>
            </div>
          )}

          <div>
            <div className="left-item-body">
              <button className="btn filter-button" onClick={this.clearFilters}>
                Clear filters
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  public render() {
    return (
      <>
        {this.renderHeader()}
        <div className={this.state.showFilter ? '' : 'hidden'}>
          {this.renderBody()}
        </div>

        <div
          className={`d-inline-block w-100 ${
            this.state.showFilter ? 'hidden' : ''
          }`}
        >
          {this.props.children}
        </div>
      </>
    );
  }
}

export default observer(FilterComponent);
