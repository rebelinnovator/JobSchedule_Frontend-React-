import React from 'react';
import { AssignWorker } from '../../../Models';
import { LocationItem } from '../../../Models/locationItem';
import mainStore from '../../../Stores/mainStore';
import * as CeIcon from '../../../Utils/Icon';
import { AssignWorkersValidation } from '../../Workers/WorkerValidation';
import { CalendarItem } from '../Calendars/CalendarItem';
import { ISelectItem } from '../Controls/AsyncSelect';
import CheckboxComponent from '../Controls/Checkbox.Component';
import SubcontractorAsyncSearch from '../Controls/SubcontractorAsyncSearch';
import { WorkerAsyncSearch } from '../Controls/WorkerAsyncSearch';
import DateComponent from '../Date/Date.Component';
import DropdownComponent from '../Dropdownlist/Dropdown.Component';
import './addworkerslide.scss';
import { observer } from 'mobx-react';



interface Props {
  showed: boolean;
  closeSlide: Function;
  selectedDate?: CalendarItem;
  getWorkers?: Function;
  updateWorkers?: Function;
  removeWorker?: Function;
  locations?: Array<LocationItem>;
}

@observer
export class AddWorkerSlideComponent extends React.Component<Props> {
  workers: Array<AssignWorker>;
  workersList: Array<any>;
  onlyAvailable: boolean;
  selectedDate: Date;
  wSelect: any;
  locations: Array<LocationItem>;
  subcontractor: any;
  errors: any;
  constructor(props: any) {
    super(props);
    this.init();
  }

  state = {
    subcontractorName: null,
    status: 'active'
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedDate && this.props.selectedDate !== nextProps.selectedDate) {
      this.selectedDate = this.parseDate(nextProps.selectedDate);
      this.workers = this.props.getWorkers(nextProps.selectedDate.id);
      if (!this.workers.length) {
        this.workers = new Array<AssignWorker>();
        const worker = new AssignWorker();
        worker.location = new LocationItem();
        worker.startDate = this.selectedDate;
        this.workers.push(worker);
      }
    }
    if (nextProps.locations && this.locations !== nextProps.locations) {
      this.locations = nextProps.locations;
    }
    if (nextProps.showed == false) {
      this.init();
    }
  }
  handleDateChange = (index: number, date: Date) => {
    this.workers[index] = {
      ...this.workers[index],
      startDate: date,
    };
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
        worker.location = location
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
        ...this.subcontractor != null && {
          workerIds: this.subcontractor.workerIds && this.subcontractor.workerIds.length > 0 ? this.subcontractor.workerIds : [-1]
        }
      });
    } else {
      this.setState({
        status: 'active',
        ...this.subcontractor != null && {
          workerIds: this.subcontractor.workerIds && this.subcontractor.workerIds.length > 0 ? this.subcontractor.workerIds : [-1]
        }
      })
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
    const worker = this.workers[index];
    this.workers.splice(index, 1);
    if (this.props.removeWorker) {
      this.props.removeWorker(worker);
    }
    if (!this.workers.length) {
      const worker = new AssignWorker();
      worker.startDate = this.selectedDate;
      worker.location = new LocationItem();
      this.workers.push(worker);
    }
  }

  transformErrors = (errors) => {
    if (!errors) return {};
    return errors.inner.reduce((errors: any, error) => {
      errors[error.path] = error.message;
      return errors;
    }, {});
  }

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
      this.errors = this.transformErrors(error);
    }

  };

  onSubcontractorClear = () => {

    this.setState({ subcontractorName: '', workerIds: null });
  }

  findSubcontractors = () => {
    if (this.wSelect) {
      this.wSelect.forceReload();
    }
  }

  onSubcontractorSelect = (item?: ISelectItem | undefined) => {
    if (item) {
      this.subcontractor = item.value;
      this.setState({ subcontractorName: item.value.name }, this.findSubcontractors);
    }
  }

  onWorkerSelect = (index: number, item?: ISelectItem | undefined) => {
    if (!item) {
      this.workers[index].workerId = null;
      this.workers[index].worker = '';

      return;
    }
    this.setState({
      subcontractorName: item.value.name, workerIds: this.subcontractor.workerIds && this.subcontractor.workerIds.length > 0 ? this.subcontractor.workerIds : [-1]
    }, this.findSubcontractors);

    const worker = {
      ...this.workers[index],
      workerId: item.value.id,
      worker: item.value,
    };

    if (this.state.subcontractorName && this.subcontractor) {
      worker.subcontractor = this.subcontractor;
      worker.subcontractorId = this.subcontractor.id;
    }


    this.workers[index] = worker;
  }

  getError = (pair: [number, string][]) => {
    const key = pair.reduce((errorKey: string, [idx, key]) => {
      errorKey += `[${idx}].${key}`;
      return errorKey;
    }, '');

    if (!this.errors) return null;
    return this.errors[key];
  }
  // selectSubcontractor
  public render() {
    return (
      <div className={'slide-container ' + (this.props.showed ? 'showed' : '')}>
        <div className="slide-content">
          <div className="slide-header d-flex align-items-center justify-content-between">
            <div className="slide-title">
              Add worker
            </div>
            <div className="cursor-pointer p-1">
              <CeIcon.Close onClick={() => { this.props.closeSlide(); }} />
            </div>

          </div>
          <div className="slide-body">
            {
              this.workers.map((item, index) => (
                <div className={index == this.workers.length - 1 ? 'worker-row-item-last' : 'worker-row-item'} key={`worker${index}`}>
                  <div className="ce-assign-worker ce-pd-20">
                    <div className="ce-assign-worker-action cursor-pointer" onClick={() => {
                      this.onRemove(index);
                    }}>
                      <img src={CeIcon.TrashIconB} width={12.6} height={14} className="ce-mr-10" />
                      <a className="cursor-pointer" >
                        Delete</a>
                    </div>
                    <div className="">
                      <span className="ce-title">Subcontractor</span>
                      {/* <DropdownComponent placeHolder="Select subcontractor" /> */}
                      <SubcontractorAsyncSearch onSelect={this.onSubcontractorSelect} onClear={this.onSubcontractorClear} />
                    </div>
                    <div className="ce-assign-worker-record mb-10">
                      <span className="ce-title">Worker</span>
                      {/* <DropdownComponent
                          onSelect={ values => this.selectWorkers(index, values) }
                          displayName={'name'}
                          displayValue={'id'}
                          placeHolder="Select Worker"
                          selected={item.id ? item : undefined}
                          sources={this.workersList}
                      /> */}

                      <WorkerAsyncSearch ref={wSelect => this.wSelect = wSelect} onSelect={(item) => this.onWorkerSelect(index, item)} searchParams={{ ...this.state }} />

                    </div>
                    <CheckboxComponent checked={this.onlyAvailable} className="" onChange={(checked) => this.searchWorkers(checked)} id="scheduleCheck" hasTitle="Show only available workers " />

                    <div className="ce-assign-worker-record work-time">
                      <div className="work-time-start-date">
                        <DateComponent
                          hasTitle="Start Date"
                          showTimeSelect
                          date={item.startDate ? new Date(item.startDate) : null}
                          onChange={(date: Date) => this.handleDateChange(index, date)}
                        />
                        <p>{this.getError([[index, 'locations'], [0, 'address']])}</p>
                      </div>
                      <div>
                        <span className="ce-title">Start Time</span>
                        <div className="work-time-start-time">

                          <div className="ce-form-control">

                            <input
                              className="ce-input-control"
                              value={item.startTime ? item.startTime : undefined}
                              type={'time'}
                              name={'startTime'}
                              onChange={event => this.handleInputChange(index, event)} />
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className="ce-assign-worker-record work-location-list">
                      {
                        item.location ?
                          <div key={`location${index}${item.location}`}>
                            {/* <span className="ce-title">Location #{litem.locationi + 1}</span> */}
                            <div className="work-time-start-time">
                              <DropdownComponent
                                onSelect={location =>
                                  this.selectLocation(index, 0, location)
                                }
                                displayName={'address'}
                                displayValue={'address'}
                                placeHolder="Select Location"
                                sources={this.locations}
                                selected={item.location.address !== undefined ? item.location : undefined}
                              />

                            </div>
                          </div> : null
                      }
                    </div>

                  </div>
                </div>
              ))
            }

            <div className="worker-action">
              <div className="ce-assign-worker-record">
                <a className="btn ce-btn-confirm cursor-pointer" onClick={() => {
                  const location = new LocationItem();
                  this.workers.push({
                    startDate: this.selectedDate,
                    location,
                  } as AssignWorker);
                }}>
                  <span >Add Another Worker</span>
                </a>
              </div>
              <div className="ce-assign-worker-record">
                <button className="btn ce-btn-success cursor-pointer" onClick={this.save}><span>Save</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
