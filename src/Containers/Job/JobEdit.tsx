import { withFormik } from 'formik';
import { createBrowserHistory } from 'history';
import { observer } from 'mobx-react';
import * as mobx from 'mobx';
import moment from 'moment';
import React from 'react';
import Geocode from 'react-geocode';
import { JobType, JOB_STATUSES } from '../../Constants/job';
import { EROLES } from '../../Constants/user';
import UserButtonAdd from '../../Images/users-button-add.png';
import { JobWorker } from '../../Models/jobListItem';
import { LocationItem } from '../../Models/locationItem';
import { jobAPI } from '../../Services/API';
import jobStore from '../../Stores/jobStore';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import MapSelect from '../Components/Controls/MapSelect';
import MunicipalitysAsyncSearch from '../Components/Controls/MunicipalitysAsyncSearch';
import { UsersAsyncSearch } from '../Components/Controls/UsersAsyncSearch';
import DateComponent from '../Components/Date/Date.Component';
import './JobCreate.scss';
import { JobEditValidation } from './JobCreateValidation';
import ImageUpload from '../Components/ImageUpload/ImageUpload';
import JobAssign from './JobWorkers/JobAssign';
import Gallery from '../Components/ImageUpload/Gallery';
import authStore from '../../Stores/authStore';

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_AIP_KEY);
Geocode.enableDebug();

const date = new Date();
@observer
export class JobEdit extends React.Component<any, any> {
  state: any;
  times: any = {};

  constructor(props) {
    super(props);
    this.state = {
      assign: false
    };
  }

  toggleAssign = () => {
    this.setState(state => ({ assign: !state.assign }));
  };

  componentDidMount = () => {
    const { id } = this.props.match.params;
    const workers = localStorage.getItem(`temp-assign-${id}`);
    if (id) {
      jobStore.getJob(id);
    }
  };

  onChangeLocations = (locations: LocationItem[] = []) => {
    jobStore.updateLocalJob('locations', locations);
    this.props.setFieldValue('locations', locations, false);
  };

  getErrorMessage = key => {
    const jobs = this.props.errors.jobs;
    if (!jobs || !Array.isArray(jobs)) {
      return null;
    }
    return jobs[key];
  };

  handleChangeField(name) {
    return event => {
      let {
        currentTarget: { value, type, dataset }
      } = event;
      if (type === 'number' || dataset.type === 'number') {
        return this.props.setFieldValue(name, Number(value), false);
      }
      return this.props.setFieldValue(name, value, false);
    };
  }

  handleChangeSelect(name) {
    return item => {
      return this.props.setFieldValue(name, item.value, false);
    };
  }

  removeWorker = (_worker: any) => {

    let workers = this.filedValue('workers');
    workers = workers.filter(worker => worker.id !== _worker.id);
    this.assignWorkers(workers);
  }

  assignWorkers = (workers: JobWorker[]) => {
    jobStore.assignWorkersToJob(workers);
    this.props.setFieldValue('workers', workers, false);
  };

  delay = (ms: number) => new Promise(res => setTimeout(() => res(ms), ms));

  // onDateSelect = async (idx) => {
  //   await this.delay(200);
  //   const _date = moment(this.times.requestDate.date);
  //   const [start, end] =
  //     [
  //       this.times.startTime.date.split(':'),
  //       this.times.endTime.date.split(':')].map(
  //         ([hours, minutes], idx) => !idx ?
  //           _date.hour(hours).minute(minutes).toISOString() : `${hours}:${minutes}`);

  //   this.props.setFieldValue('requestTime', start, false);
  //   this.props.setFieldValue('endTime', end, false);
  // }

  onDateSelect = async idx => {
    await this.delay(200);
    const requestTime = moment(this.times.requestDate.date);
    const endDate = moment(this.times.endDate.date);

    const [start, end] = [
      this.times.startTime.date.split(':'),
      this.times.endTime.date.split(':')
    ].map(([hours, minutes], idx) =>
      !idx
        ? requestTime
          .hour(hours)
          .minute(minutes)
          .toISOString()
        : endDate
          .hour(hours)
          .minute(minutes)
          .toISOString()
    );

    this.props.setFieldValue('requestTime', start);
    this.props.setFieldValue('endTime', end);
  };

  getTime = date => {
    const valid = (number: number) => {
      const time = `${number}`;
      return time.length > 1 ? time : `0${time}`;
    };
    const _date = moment(date);
    const time = `${valid(_date.hours())}:${valid(_date.minutes())}`;
    return time;
  };

  filedValue(name: string): any {
    return this.props.values[name] || jobStore.job[name];
  }

  save = event => {
    if (this.state.assign) {
      alert(
        `Worker assignment saved successfully. Don't forget to save your job state`
      );
    }
    this.props.handleSubmit(event);
  };

  public render() {    
    const { errors, handleSubmit } = this.props;
    if (!jobStore.job.id) {
      return 'Loading...';
    }
    return (
      <form onSubmit={handleSubmit} className="container job-create-page mt-4">
        <div className="box-item-header">Edit Job</div>
        {!this.state.assign ? (
          <>
            <div className="box-item">
              <div className="box-item-header d-flex align-items-center">
                Project PO: {jobStore.job.totalPo}
              </div>
              <div className="box-item-body">
                <div className="row">
                  <div className="col-12 col-lg-5 col-xl-4 form-group">
                    <label className="d-block">Job type</label>
                    <div
                      className="btn-group group-job-type w-100"
                      role="group"
                    >
                      <button
                        type="button"
                        data-type="number"
                        className={`btn ${this.filedValue('jobType') === JobType.Flagging
                          ? 'active'
                          : 'btn-outline-secondary'
                          }`}
                        value={JobType.Flagging}
                        onClick={this.handleChangeField('jobType')}
                      >
                        Flagging
                      </button>
                      <button
                        type="button"
                        data-type="number"
                        className={`btn ${this.filedValue('jobType') === JobType.Parking
                          ? 'active'
                          : 'btn-outline-secondary'
                          }`}
                        value={JobType.Parking}
                        onClick={this.handleChangeField('jobType')}
                      >
                        Parking
                      </button>
                      <button
                        type="button"
                        data-type="number"
                        className={`btn ${this.filedValue('jobType') === JobType.Signage
                          ? 'active'
                          : 'btn-outline-secondary'
                          }`}
                        value={JobType.Signage}
                        onClick={this.handleChangeField('jobType')}
                      >
                        Signage
                      </button>
                    </div>
                    <p className="error">{this.getErrorMessage('jobType')}</p>
                  </div>

                  {/* <div className="col-lg-3 col-6 form-group">
                  <label className="d-block">Request Date</label>
                  <DateComponent
                    showTimeSelect
                    format="date"
                    minDate={date}
                    ref={date => this.times.requestDate = date}
                    date={new Date(this.filedValue('requestTime'))}
                    onChange={this.onDateSelect}
                  />
                  <p className="error">{this.getErrorMessage('requestTime')}</p>
                </div>

                <div className="col-lg-2 col-4 form-group">
                  <label className="d-block">Start Time</label>
                  <DateComponent
                    showTimeSelect
                    format="time"
                    ref={time => this.times.startTime = time}
                    date={
                      this.getTime(new Date(this.filedValue('requestTime')))}
                    onChange={this.onDateSelect}
                  />
                </div>

                <div className="col-lg-2 col-4 form-group">
                  <label className="d-block">End Time</label>
                  <DateComponent
                    showTimeSelect
                    format="time"
                    ref={time => this.times.endTime = time}

                    date={this.filedValue('endTime')}
                    onChange={this.onDateSelect}
                  />
                  <p className="error">{this.getErrorMessage('endTime')}</p>
                </div>

                new */}

                  <div className="col-lg-4 col-6 form-group">
                    <label className="d-block">Request Date</label>
                    <DateComponent
                      showTimeSelect
                      // minDate={date}
                      ref={date => (this.times.requestDate = date)}
                      date={new Date(this.filedValue('requestTime'))}
                      maxDate={
                        this.filedValue('endTime')
                          ? new Date(this.filedValue('endTime'))
                          : null
                      }
                      onChange={date =>
                        this.props.setFieldValue(
                          'requestTime',
                          date ? date : null,
                          false
                        )
                      }
                    />
                    <p className="error">
                      {this.getErrorMessage('requestTime')}
                    </p>
                  </div>

                  <div className="col-lg-4 col-6 form-group">
                    <label className="d-block">End Date</label>
                    <DateComponent
                      showTimeSelect
                      minDate={new Date(this.filedValue('requestTime'))}
                      ref={date => (this.times.requestDate = date)}
                      date={
                        this.filedValue('endTime')
                          ? new Date(this.filedValue('endTime'))
                          : null
                      }
                      onChange={date =>
                        this.props.setFieldValue(
                          'endTime',
                          date ? date : null,
                          false
                        )
                      }
                    />
                    <p className="error">{this.getErrorMessage('endTime')}</p>
                  </div>

                  {/* 
                <div className="col-lg-2 col-6 form-group">
                  <label className="d-block">End Date</label>
                  <DateComponent
                    showTimeSelect
                    minDate={date}
                    ref={date => this.times.requestDate = date}
                    minTime={new Date(this.filedValue('requestTime'))}
                    date={new Date(this.filedValue('requestTime'))}
                    maxDate={new Date(this.filedValue('endTime'))}
                    onChange={this.onDateSelect}
                  />
                  <p className="error">{this.getErrorMessage('requestTime')}</p>
                </div>

                <div className="col-lg-2 col-4 form-group">
                  <label className="d-block">Start Time</label>
                  <DateComponent
                    showTimeSelect
                    format="time"
                    ref={time => this.times.startTime = time}
                    date={
                      this.getTime(new Date(this.filedValue('requestTime')))
                    }
                    onChange={this.onDateSelect}
                  />
                </div>

                <div className="col-lg-2 col-6 form-group">
                  <label className="d-block">End Date</label>
                  <DateComponent
                    showTimeSelect
                    format="date"
                    minDate={new Date(this.filedValue('requestTime'))}
                    ref={date => this.times.endDate = date}
                    date={new Date(this.filedValue('endTime'))}
                    onChange={this.onDateSelect}
                  />
                  <p className="error">{this.getErrorMessage('endTime')}</p>
                </div>

                <div className="col-lg-2 col-4 form-group">
                  <label className="d-block">End Time</label>
                  <DateComponent
                    showTimeSelect
                    format="time"
                    ref={time => this.times.endTime = time}
                    date={this.getTime(new Date(this.filedValue('endTime')))}
                    onChange={this.onDateSelect}
                  />
                  <p className="error">{this.getErrorMessage('endTime')}</p>
                </div> */}
                </div>
              </div>
              <div className="box-item-body">
                <div className="row">
                  <div className="form-group col-sm-4">
                    <label className="d-block">Requestor</label>
                    <UsersAsyncSearch
                      defaultValue={
                        typeof this.filedValue('requestor') !== 'object'
                          ? {
                            label: this.filedValue('requestorName'),
                            value: this.filedValue('requestor')
                          }
                          : {
                            label: this.filedValue('requestor').name,
                            value: this.filedValue('requestor').id
                          }
                      }
                      searchParams={{
                        roles: [EROLES.requestor]
                      }}
                      onSelect={item =>
                        this.props.setFieldValue(
                          'requestor',
                          item ? item.value : null,
                          false
                        )
                      }
                    />
                    <p className="error">{this.getErrorMessage('requestor')}</p>
                  </div>
                  <div className="form-group col-sm-4">
                    <label className="d-block">Supervisor</label>
                    <UsersAsyncSearch
                      defaultValue={
                        typeof this.filedValue('supervisor') !== 'object'
                          ? {
                            label: this.filedValue('supervisorName'),
                            value: this.filedValue('supervisor')
                          }
                          : {
                            label: this.filedValue('supervisor').name,
                            value: this.filedValue('supervisor').id
                          }
                      }
                      searchParams={{
                        roles: [
                          EROLES.coned_field_supervisor
                        ]
                      }}
                      onSelect={item =>
                        this.props.setFieldValue(
                          'supervisor',
                          item ? item.value : null,
                          false
                        )
                      }
                    />
                    <p className="error">
                      {this.getErrorMessage('supervisor')}
                    </p>
                  </div>
                  
                  <div className="form-group col-sm-4">
                    <label className="d-block">CC User</label>
                    <UsersAsyncSearch
                      triggerReloadKey={
                        JSON.stringify(this.filedValue('supervisor')) +
                        JSON.stringify(this.filedValue('requestor')) 
                      }
                      usersNotAvailable={[
                        this.filedValue('supervisor') ? this.filedValue('supervisor').id: null,
                        this.filedValue('requestor') ? this.filedValue('requestor').id : null,
                        !this.props.values.supervisor ? mobx.toJS(jobStore.job).supervisor : null ,
                        !this.props.values.requestor ? mobx.toJS(jobStore.job).requestor : null
                      ]}
                      searchParams={{
                        roles: [
                          EROLES.requestor,
                          EROLES.department_supervisor,
                          EROLES.coned_field_supervisor,
                          EROLES.coned_billing_admin,
                        ],
                        isApproved: 1,
                      }}
                      defaultValue={
                        typeof this.filedValue('ccUser') !== 'object'
                        ? {
                          label: this.filedValue('ccUserName'),
                          value: this.filedValue('ccUser')
                        }
                        : {
                          label: this.filedValue('ccUser').name,
                          value: this.filedValue('ccUser').id
                        }
                      }
                      onSelect={item =>
                        this.props.setFieldValue(
                          'ccUser',
                          item ? item.value.id : null,
                          false
                        )
                      }
                    />
                    <p className="error">{this.getErrorMessage('ccUser')}</p>
                  </div>
                  
                  <div className="form-group col-sm-4">
                    <label className="d-block">Department</label>
                    <DepartmentAsyncSearch
                      defaultValue={
                        typeof this.filedValue('department') !== 'object'
                          ? {
                            label: this.filedValue('departmentName'),
                            value: this.filedValue('department')
                          }
                          : {
                            label: this.filedValue('department').name,
                            value: this.filedValue('department').id
                          }
                      }
                      onSelect={item =>
                        this.props.setFieldValue(
                          'department',
                          item ? item.value : null,
                          false
                        )
                      }
                      onlyOwnDept={authStore.canAccessLimitDept()}
                    />
                    <p className="error">
                      {this.getErrorMessage('department')}
                    </p>
                  </div>
                  <div className="form-group col-sm-4">
                    <label className="d-block">Section</label>
                    <input
                      className="ce-form-control"
                      placeholder="Section Name"
                      defaultValue={this.filedValue('section')}
                      onChange={this.handleChangeField('section')}
                    />
                    <p className="error">{this.getErrorMessage('section')}</p>
                  </div>
                  <div className="form-group col-sm-4">
                    <label className="d-block">Municipality</label>
                    <MunicipalitysAsyncSearch
                      defaultValue={this.filedValue('municipality')}
                      onSelect={item =>
                        this.handleChangeSelect('municipality')({ value: item })
                      }
                    />
                    <p className="error">
                      {this.getErrorMessage('municipality')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="box-item-body">
                <div className="row">
                  <div className="form-group col-sm-3">
                    <label className="d-block">PO #</label>
                    <input
                      className="ce-form-control"
                      placeholder="0125698"
                      data-type={'number'}
                      defaultValue={`${this.filedValue('po')}`}
                      onChange={this.handleChangeField('po')}
                    />
                    <p className="error">{this.getErrorMessage('po')}</p>
                  </div>
                  <div className="form-group col-sm-3">
                    <label className="d-block">Feeder #</label>
                    <input
                      className="ce-form-control"
                      placeholder="00001"
                      data-type={'number'}
                      defaultValue={`${this.filedValue('feeder')}`}
                      onChange={this.handleChangeField('feeder')}
                    />
                    <p className="error">{this.getErrorMessage('feeder')}</p>
                  </div>

                  <div className="form-group col-sm-3">
                    <label className="d-block">Account #</label>
                    <input
                      className="ce-form-control"
                      placeholder="00001"
                      data-type={'number'}
                      defaultValue={this.filedValue('account') ? `${this.filedValue('account')}` : ''}
                      onChange={this.handleChangeField('account')}
                    />
                    <p className="error">{this.getErrorMessage('account')}</p>
                  </div>

                  <div className="form-group col-sm-3">
                    <label className="d-block">Max Workers</label>
                    <input
                      className="ce-form-control"
                      placeholder="1"
                      data-type={'number'}
                      defaultValue={this.filedValue('maxWorkers')}
                      onChange={this.handleChangeField('maxWorkers')}
                    />
                    <p className="error">{this.getErrorMessage('maxWorkers')}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-sm-3">
                    <label className="d-block">Work Request #</label>
                    <input
                      className="ce-form-control"
                      placeholder="0125698"
                      data-type={'number'}
                      defaultValue={this.filedValue('wr')}
                      onChange={this.handleChangeField('wr')}
                    />
                  </div>
                  <div className="form-group col-sm-3">
                    <label className="d-block">Requisition #</label>
                    <input
                      className="ce-form-control"
                      placeholder="00001"
                      data-type={'number'}
                      defaultValue={this.filedValue('requisition')}
                      onChange={this.handleChangeField('requisition')}
                    />
                  </div>

                </div>
              </div>

              <MapSelect
                hasEdit={true}
                locations={this.filedValue('locations')}
                onChangeLocations={this.onChangeLocations}
                error={this.getErrorMessage('address')}
              />

              {Array.isArray(this.filedValue('workers')) ? (
                <div className="box-item-body-none">
                  <div className="form-group">
                    {this.filedValue('workers').map(_worker => {
                      const user = _worker.worker || {};
                      // return <div>WORKER</div>
                      return (
                        <div className="worker ce-flex worker-edit" onClick={() => this.removeWorker(_worker)}>
                          <img
                            className="worker-img avatar mr-3"
                            src={_worker.thumbnail}
                          ></img>
                          <div>
                            <div className="ce-title">
                              <span>{user.firstName} {user.lastName}</span>
                            </div>
                            {/* <div className="ce-sub-tilte">
                              <span>
                                Apointed by {this.selectedWorker.assignerName}
                              </span>
                            </div> */}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}


              <div className="box-item-body-none">
                <div className="form-group">
                  <label className="d-block">Photos</label>
                  <ImageUpload
                    onChangeImage={(images) => this.props.setFieldValue('images', images, false)}
                    defaultImages={jobStore.job.jobImages}
                  />
                </div>
              </div>

              <div className="box-item-body-none">
                <div className="form-group">
                  <label className="d-block">Comments</label>
                  <textarea
                    rows={5}
                    className="ce-form-control"
                    onChange={this.handleChangeField('comment')}
                    defaultValue={this.filedValue('comment')}
                  />
                  <p className="error">{this.getErrorMessage('comment')}</p>
                </div>

                {authStore.canAssignWorker() && <div className="create-job-assign-worker">
                  <div className=" btn-assign-workers w-100">
                    <span
                      className="d-flex align-items-center justify-content-center pointer"
                      onClick={this.toggleAssign}
                    >
                      <img className="mr-2" src={UserButtonAdd}></img>
                      Assign Workers{' '}
                      {Array.isArray(jobStore.job.workers) &&
                        Array.isArray(jobStore.job.workers.length)}
                    </span>
                  </div>
                </div>
                }
              </div>
            </div>
          </>
        ) : null}
        {this.state.assign ? (
          <JobAssign
            job={jobStore.job}
            onAssign={this.assignWorkers}
            onSave={this.toggleAssign}
            buttonTitle="Save and continue"
            disabled={jobStore.jobDetail.jobStatus === JOB_STATUSES.InProgress}
            workers={jobStore.job.workers}
          />
        ) : null}
        {!this.state.assign ?
          (<div className="d-flex justify-content-between flex-mobile mt-4 mb-5">
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-outline-secondary btn-font-bold px-4 mr-2"
                onClick={() => {
                  if (this.state.assign) {
                    this.toggleAssign();
                    return;
                  }
                  jobStore.clearTempJobs();
                  createBrowserHistory({ forceRefresh: true }).push('/job');
                }}
              >
                Cancel
            </button>
              <button
                className="btn btn-success btn-add"
                type="button"
                onClick={this.save}
              >
                Save
            </button>
            </div>
          </div>) : <div className="d-flex justify-content-between flex-mobile mt-4 mb-5"></div>}
      </form>
    );
  }
}

const formatter = (item: any) => {
  if (item.requestor) {
    item.requestor = item.requestor.id;
  }
  if (item.supervisor) {
    item.supervisor = item.supervisor.id;
  }
  if (item.department) {
    item.department = item.department.id;
  }
  return item;
};

export default withFormik({
  mapPropsToValues: (props: any) => {
    return {};
  },
  validationSchema: JobEditValidation,
  handleSubmit: async (values: any, { props }) => {
    if (values.images && values.images.length > 0) {
      let newImagesUrl = [];
      const newImages = values.images.filter((image) => typeof image !== 'string');
      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((image) => {
          formData.append('images', image);
        });
        newImagesUrl = (await jobAPI.uploadImages(formData)).data;
      }
      const oldImage = values.images.filter((image) => typeof image === 'string');
      values.jobImages = [...oldImage, ...newImagesUrl];
    } else {
      values.jobImages = [];
    }
    jobAPI.update(jobStore.job.id, formatter(values) as any).then(res => {
      if (res.status < 300) {
        createBrowserHistory({ forceRefresh: true }).push(
          `/job/${jobStore.job.id}`
        );
      }
    });
  }
})(JobEdit);
