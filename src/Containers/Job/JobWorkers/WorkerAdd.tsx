import React from 'react';
import { AssignWorker } from '../../../Models';
import { LocationItem } from '../../../Models/locationItem';
import mainStore from '../../../Stores/mainStore';
import * as CeIcon from '../../../Utils/Icon';
import { AssignWorkersValidation } from '../../Workers/WorkerValidation';
import { CalendarItem } from '../../Components/Calendars/CalendarItem';
import { ISelectItem } from '../../Components/Controls/AsyncSelect';
import CheckboxComponent from '../../Components/Controls/Checkbox.Component';
import SubcontractorAsyncSearch from '../../Components/Controls/SubcontractorAsyncSearch';
import { WorkerAsyncSearch } from '../../Components/Controls/WorkerAsyncSearch';
import DateComponent from '../../Components/Date/Date.Component';
import DropdownComponent from '../../Components/Dropdownlist/Dropdown.Component';
import './addworkerslide.scss';
import { observer } from 'mobx-react';
import { JobItem } from '../../../Models/jobItem';
import { JobListItem } from '../../../Models/jobListItem';
import jobStore from '../../../Stores/jobStore';
import Select from 'react-select';
import moment from 'moment';

interface Props {
  showed: boolean;
  closeSlide: Function;
  selectedDate?: CalendarItem;
  getWorkers?: Function;
  updateWorkers?: Function;
  removeWorker?: Function;
  locations?: Array<LocationItem>;
  job?: JobListItem;
}

@observer
export class AddWorkerSlideComponent extends React.Component<Props> {
  workers: Array<AssignWorker>;
  workersList: Array<any>;
  onlyAvailable: boolean;
  selectedDate: Date;
  wSelect: WorkerAsyncSearch;
  locations: Array<LocationItem>;
  subcontractor: any;
  errors: any;
  job: JobListItem;
  subcontractors: object;

  constructor(props: any) {
    super(props);
    this.subcontractors = {};
    this.init();
  }

  state = {
    subcontractorName: null,
    status: 'active',
    workerTypes: [this.props.job.jobType],
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.selectedDate &&
      this.props.selectedDate !== nextProps.selectedDate
    ) {
      this.selectedDate = this.parseDate(nextProps.selectedDate);
      this.workers = this.props.getWorkers(nextProps.selectedDate.id);
      if (!this.workers.length) {
        this.workers = new Array<AssignWorker>();
        const worker = new AssignWorker();
        worker.location = new LocationItem();
        worker.startDate = moment
          .max([moment(new Date(this.props.job.requestTime)), moment()])
          .toDate();
        this.workers.push(worker);
      } else {
        this.forceUpdate();
      }
    }
    if (nextProps.locations && this.locations !== nextProps.locations) {
      this.locations = nextProps.locations;
    }
    if (nextProps.showed === false) {
      this.init();
    }
  }

  handleDateChange = (index: number, date: Date, endDate = false) => {
    if (endDate) {
      this.workers[index] = {
        ...this.workers[index],
        endDate: date,
      };
      this.setState({ change: true });
      return;
    }
    this.workers[index] = {
      ...this.workers[index],
      startDate: date,
    };
    this.setState({ change: true });
  };
  handleInputChange = (index, event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.workers[index] = {
      ...this.workers[index],
      [name]: value,
    };
  };

  init() {
    const location = new LocationItem();

    if (this.props.getWorkers && this.selectedDate) {
      this.workers = this.props.getWorkers(this.selectedDate);
      if (!this.workers.length) {
        this.workers = new Array<AssignWorker>();
        const worker = new AssignWorker();
        worker.startDate = this.selectedDate;
        worker.location = location;
        this.workers.push(worker);
      }
    } else {
      this.workers = new Array<AssignWorker>();
      this.workers.push({
        location,
        startDate: this.selectedDate,
      } as AssignWorker);
    }
    this.onlyAvailable = false;
    this.workersList = mainStore.workers;
  }

  searchWorkers(checked) {
    this.onlyAvailable = checked;
    if (checked) {
      this.setState({
        status: 'available',
      });
    } else {
      this.setState({
        status: 'active',
      });
    }

    if (this.wSelect) {
      this.wSelect.forceReload();
    }
  }

  parseDate<Date>(date: CalendarItem) {
    const year = date.id.substr(0, 4);
    const month = date.id.substr(4, 2);
    const day = date.id.substr(6, 2);
    return new Date(`${month}/${day}/${year}`);
  }

  selectWorkers = (index: number, workers: AssignWorker) => {
    this.workers[index] = { ...this.workers[index], ...workers };
    this.setState({ change: true });
  };
  selectLocation = (index: number, lIndex: number, location: LocationItem) => {
    this.workers[index] = { ...this.workers[index], location };
  };

  onRemove(index: number) {
    this.props.removeWorker(this.workers[index]);

    this.workers = this.workers.filter((worker, idx) => idx !== index);
    this.props.closeSlide();
  }

  transformErrors = (errors) => {
    if (!errors || !errors.inner) return {};
    return errors.inner.reduce((errors: any, error) => {
      errors[error.path] = error.message;
      return errors;
    }, {});
  };

  save = async () => {
    try {
      await AssignWorkersValidation.validate(this.workers, {
        abortEarly: false,
      });
      this.errors = {};
      if (this.props.updateWorkers) {
        this.props.updateWorkers(this.workers);
        this.props.closeSlide();
      }
    } catch (error) {
      console.log({ error });
      this.errors = this.transformErrors(error);
    }
  };

  onSubcontractorClear = () => {
    this.setState({ subcontractorName: '', workerIds: null });
  };

  findSubcontractors = () => {
    if (this.wSelect) {
      this.wSelect.forceReload();
    }
  };

  onSubcontractorSelect = (index: number, item?: ISelectItem | undefined) => {
    if (item && item.value) {
      this.subcontractors[index] = item.value;
      this.subcontractor = item.value;
      this.setState(
        {
          subcontractorName: item.value.name,
          workerIds:
            this.subcontractor.workerIds &&
            this.subcontractor.workerIds.length > 0
              ? this.subcontractor.workerIds
              : [-1],
        },
        this.findSubcontractors
      );
    } else {
      delete this.subcontractor;
      this.setState(
        { subcontractorName: null, workerIds: null },
        this.findSubcontractors
      );
      delete this.subcontractors[index];
    }
  };

  onWorkerSelect = (index: number, item?: ISelectItem | undefined) => {
    if (!item) {
      this.workers[index].workerId = null;
      this.workers[index].worker = '';

      this.setState({ subcontractorName: null }, this.findSubcontractors);
      return;
    }

    this.setState(
      { subcontractorName: item.value.subcontractorName || null },
      this.findSubcontractors
    );

    const worker = {
      ...this.workers[index],
      workerId: item.value.id,
      worker: item.value,
    };

    if (this.subcontractors[index]) {
      worker.subcontractor = this.subcontractors[index];
      worker.subcontractorId = this.subcontractors[index];
    }

    this.workers[index] = worker;
  };

  getError = (pair: [number, string][]) => {
    const key = pair.reduce((errorKey: string, [idx, key]) => {
      errorKey += `[${idx}].${key}`;
      return errorKey;
    }, '');
    if (!this.errors) return null;
    return this.errors[key];
  };

  addNewWorker = () => {
    this.workers = [
      ...this.workers,
      new AssignWorker({
        startDate: moment
          .max([moment(new Date(this.props.job.requestTime)), moment()])
          .toDate(),
      }),
    ];
    this.forceUpdate();
  };

  // selectSubcontractor
  public render() {
    return (
      <div className={`slide-container ${this.props.showed ? 'showed' : ''}`}>
        <div className="slide-content">
          <div className="slide-header d-flex align-items-center justify-content-between">
            <div className="slide-title">Add worker</div>
            <div className="cursor-pointer p-1">
              <CeIcon.Close
                onClick={() => {
                  this.props.closeSlide();
                }}
              />
            </div>
          </div>
          <div className="slide-body">
            {this.workers.map((item, index) => (
              <div
                className={
                  index === this.workers.length - 1
                    ? 'worker-row-item-last'
                    : 'worker-row-item'
                }
                key={`worker-${index}-${item.workerId}`}
              >
                <div className="ce-assign-worker ce-pd-20">
                  <div
                    className="ce-assign-worker-action cursor-pointer"
                    onClick={() => {
                      this.onRemove(index);
                    }}
                  >
                    <img
                      src={CeIcon.TrashIconB}
                      width={12.6}
                      height={14}
                      className="ce-mr-10"
                    />
                    <a className="cursor-pointer">Delete</a>
                  </div>
                  <>
                    <div className="">
                      <span className="ce-title">Subcontractor</span>
                      <SubcontractorAsyncSearch
                        defaultInputValue={this.state.subcontractorName}
                        defaultValue={
                          item.subcontractor
                            ? {
                                label: item.subcontractor.companyName,
                                value: item.subcontractor,
                              }
                            : null
                        }
                        onSelect={(item) =>
                          this.onSubcontractorSelect(index, item)
                        }
                        onClear={this.onSubcontractorClear}
                        withNone
                      />
                    </div>
                    <div className="ce-assign-worker-record mb-10">
                      <span className="ce-title">Worker</span>
                      <WorkerAsyncSearch
                        defaultValue={item.worker}
                        defaultInputValue={item.worker && item.worker.name}
                        ref={(wSelect) => (this.wSelect = wSelect)}
                        onSelect={(item) => this.onWorkerSelect(index, item)}
                        searchParams={{ ...this.state }}
                      />
                    </div>
                    <CheckboxComponent
                      className=""
                      checked={this.onlyAvailable}
                      onChange={(checked) => this.searchWorkers(checked)}
                      id="scheduleCheck"
                      hasTitle="Show only available workers "
                    />

                    <div className="ce-assign-worker-record work-time">
                      <div className="work-time-start-date">
                        <DateComponent
                          hasTitle="Start Date"
                          showTimeSelect
                          maxDate={
                            item.endDate
                              ? new Date(item.endDate)
                              : this.props.job.endTime
                              ? new Date(this.props.job.endTime)
                              : null
                          }
                          minDate={moment
                            .max([
                              moment(new Date(this.props.job.requestTime)),
                              moment(),
                            ])
                            .toDate()}
                          date={
                            item.startDate ? new Date(item.startDate) : null
                          }
                          onChange={(date: Date) =>
                            this.handleDateChange(index, date)
                          }
                          noDefault={true}
                        />
                        <p>{this.getError([[index, 'startDate']])}</p>
                      </div>
                      <div className="work-time-start-date">
                        <DateComponent
                          hasTitle="End Date"
                          showTimeSelect
                          maxDate={
                            this.props.job.endTime
                              ? new Date(this.props.job.endTime)
                              : null
                          }
                          minDate={
                            item.startDate
                              ? new Date(item.startDate)
                              : moment
                                  .max([
                                    moment(
                                      new Date(this.props.job.requestTime)
                                    ),
                                    moment(),
                                  ])
                                  .toDate()
                          }
                          date={item.endDate ? new Date(item.endDate) : null}
                          onChange={(date: Date) =>
                            this.handleDateChange(index, date, true)
                          }
                          noDefault={true}
                        />
                        <p>{this.getError([[index, 'startDate']])}</p>
                      </div>
                    </div>

                    {/* <div className="ce-assign-worker-record work-time">
                        <div className="work-time-start-date">
                          <DateComponent
                            hasTitle="End Date"
                            showTimeSelect
                            maxDate={new Date(this.props.job.requestTime)}
                            minDate={new Date(this.props.job.requestTime)}
                            date={item.startDate ? new Date(item.startDate) : null}
                            onChange={(date: Date) => this.handleDateChange(index, date)}
                          />
                          <p>{this.getError([[index, 'startDate']])}</p>
                        </div>
                      </div> */}

                    <div className="ce-assign-worker-record work-location-list">
                      {Array.isArray(this.props.locations) ? (
                        <div key={`location${index}${item.location}`}>
                          <div className="work-time-start-time">
                            <Select
                              onChange={(location: any) => {
                                this.selectLocation(index, 0, location.value);
                              }}
                              defaultInputValue={
                                item.location && item.location.address
                              }
                              placeholder="Select Location"
                              options={this.props.locations.map((location) => ({
                                label: location.address,
                                value: location,
                              }))}
                            />
                            <p>
                              {this.getError([[index, 'location.address']])}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </>
                  {/* : null} */}
                </div>
              </div>
            ))}

            <div className="worker-action">
              <div className="ce-assign-worker-record">
                <a
                  className="btn ce-btn-confirm cursor-pointer"
                  onClick={this.addNewWorker}
                >
                  <span>Add Another Worker</span>
                </a>
              </div>
              <div className="ce-assign-worker-record">
                <button
                  className="btn ce-btn-success cursor-pointer"
                  type={'button'}
                  onClick={this.save}
                >
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
