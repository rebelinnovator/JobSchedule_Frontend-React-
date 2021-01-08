import moment from 'moment';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { JobType } from '../../Constants/job';
import { EROLES } from '../../Constants/user';
import UserButtonAdd from '../../Images/users-button-add.png';
import { JobItem } from '../../Models/jobItem';
import { JobWorker } from '../../Models/jobListItem';
import { LocationItem } from '../../Models/locationItem';
import authStore from '../../Stores/authStore';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import MapSelect from '../Components/Controls/MapSelect';
import MunicipalitysAsyncSearch from '../Components/Controls/MunicipalitysAsyncSearch';
import { UsersAsyncSearch } from '../Components/Controls/UsersAsyncSearch';
import DateComponent from '../Components/Date/Date.Component';
import ImageUpload from '../Components/ImageUpload/ImageUpload';
import JobAssign from './JobWorkers/JobAssign';

const date = new Date();

interface Props {
  onJobFormChange: (idx: number, name: string, value: any) => void;
  index: number;
  job: JobItem;
  errors: any;
  values: any;
  match: any;
}

class JobFormComponent extends Component<Props | any> {
  times: any = {};
  state: any = {
    assign: false
  };

  toggleAssign = () => {
    if (this.state.assign) {
      alert('Assignment saved successfully');
    }
    this.handleChangeFieldValue('assignForm', !this.state.assign);
    this.setState((state: any) => ({ assign: !state.assign }));
  };

  onChangeLocations = (locations: LocationItem[] = []) =>
    this.handleChangeFieldValue('locations', locations);

  getErrorMessage = key => {
    const jobs = this.props.errors.jobs;
    if (!jobs || !Array.isArray(jobs) || !jobs[this.props.index]) {
      return null;
    }

    return jobs[this.props.index][key];
  };

  assignWorkers = (workers: JobWorker[]) => {
    this.handleChangeFieldValue('workers', workers);
  };

  removeWorker = (_worker: any) => {
    let workers = this.props.job.workers;
    workers = workers.filter(worker => worker.id !== _worker.id);
    this.handleChangeFieldValue('workers', workers);
  };

  delay = (ms: number) => new Promise(res => setTimeout(() => res(ms), ms));

  getTime = date => {
    const valid = (number: number) => {
      const time = `${number}`;
      return time.length > 1 ? time : `0${time}`;
    };
    const _date = moment(date);
    const time = `${valid(_date.hours())}:${valid(_date.minutes())}`;
    return time;
  };

  handleChangeField = event => {
    const {
      currentTarget: { name, value, type, dataset }
    } = event;
    if (type === 'number' || dataset.type === 'number') {
      return this.handleChangeFieldValue(name, Number(value));
    }
    return this.handleChangeFieldValue(name, value);
  };

  handleChangeFieldValue = (name, value) => {
    this.props.onJobFormChange(this.props.index, name, value);
  };

  render() {
    const { job } = this.props;    
    return (
      <>
        {!this.state.assign ? (
          <>
            <div className="box-item">
              <div className="box-item-header d-flex align-items-center">
                Job # {this.props.index + 1}
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
                        className={`btn ${this.props.job.jobType === JobType.Flagging
                          ? 'active'
                          : 'btn-outline-secondary'
                          }`}
                        value={JobType.Flagging}
                        data-type="number"
                        name={'jobType'}
                        onClick={this.handleChangeField}
                      >
                        Flagging
                      </button>
                      <button
                        type="button"
                        data-type="number"
                        name={'jobType'}
                        className={`btn ${this.props.job.jobType === JobType.Parking
                          ? 'active'
                          : 'btn-outline-secondary'
                          }`}
                        value={JobType.Parking}
                        onClick={this.handleChangeField}
                      >
                        Parking
                      </button>
                      <button
                        type="button"
                        data-type="number"
                        name={'jobType'}
                        className={`btn ${this.props.job.jobType === JobType.Signage
                          ? 'active'
                          : 'btn-outline-secondary'
                          }`}
                        value={JobType.Signage}
                        onClick={this.handleChangeField}
                      >
                        Signage
                      </button>
                    </div>
                    <p className="error">{this.getErrorMessage('jobType')}</p>
                  </div>

                  <div className="col-lg-4 col-6 form-group">
                    <label className="d-block">Request Date</label>
                    <DateComponent
                      showTimeSelect
                      minDate={date}
                      ref={date => (this.times.requestDate = date)}
                      date={job.requestTime ? new Date(job.requestTime) : null}
                      maxDate={job.endTime ? new Date(job.endTime) : null}
                      onChange={date =>
                        this.handleChangeFieldValue(
                          'requestTime',
                          date ? date : null
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
                      clearIcon={job.endTime}
                      minDate={
                        job.requestTime ? new Date(job.requestTime) : date
                      }
                      ref={date => (this.times.endDate = date)}
                      date={job.endTime ? new Date(job.endTime) : null}
                      onChange={date =>
                        this.handleChangeFieldValue(
                          'endTime',
                          date ? date : null
                        )
                      }
                    />
                    <p className="error">{this.getErrorMessage('endTime')}</p>
                  </div>
                </div>
              </div>

              <div className="box-item-body">
                <div className="row">
                  <div className="form-group col-sm-4">
                    <label className="d-block">Requestor</label>
                    <UsersAsyncSearch creatable
                      value={
                        job.requestor
                          ? {
                            label: job.requestor.name,
                            value: job.requestor
                          }
                          : null
                      }
                      defaultValue={
                        job.requestor
                          ? {
                            label: job.requestor.name,
                            value: job.requestor
                          }
                          : null
                      }
                      searchParams={{
                        roles: [EROLES.requestor]
                      }}
                      onSelect={item => {

                        this.handleChangeFieldValue(
                          'requestor',
                          item ? item.value : null
                        );
                      }}
                    />
                    <p className="error">{this.getErrorMessage('requestor')}</p>
                  </div>
                  <div className="form-group col-sm-4">
                    <label className="d-block">Supervisor</label>
                    <UsersAsyncSearch
                      creatable
                      value={
                        job.supervisor
                          ? {
                            label: job.supervisor.name,
                            value: job.supervisor
                          }
                          : null
                      }
                      defaultValue={
                        job.supervisor
                          ? {
                            label: job.supervisor.name,
                            value: job.supervisor
                          }
                          : null
                      }
                      searchParams={{
                        roles: [
                          EROLES.coned_field_supervisor
                        ]
                      }}
                      onSelect={item => {
                        this.handleChangeFieldValue(
                          'supervisor',
                          item ? item.value : null
                        );
                      }}
                    />
                    <p className="error">
                      {this.getErrorMessage('supervisor')}
                    </p>
                  </div>
                  <div className="form-group col-sm-4">
                    <label className="d-block">CC User</label>
                    <UsersAsyncSearch
                      triggerReloadKey={
                        JSON.stringify(job.requestor) +
                        JSON.stringify(job.supervisor)
                      }
                      usersNotAvailable={[
                        job.supervisor ? job.supervisor.id : null,
                        job.requestor ? job.requestor.id : null,
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
                        job.ccUser
                          ? {
                            label: job.ccUser.label,
                            value: job.ccUser,
                          }
                          : null
                      }
                      onSelect={(item) => {
                        this.handleChangeFieldValue(
                          'ccUser',
                          item ? item : null
                        );
                      }}
                    />
                    <p className="error">{this.getErrorMessage('ccUser')}</p>
                  </div>
                  <div className="form-group col-sm-4">
                    <label className="d-block">Department</label>
                    <DepartmentAsyncSearch
                      defaultValue={
                        job.department
                          ? {
                            label: job.department.name,
                            value: job.department
                          }
                          : null
                      }
                      onSelect={item =>
                        this.handleChangeFieldValue(
                          'department',
                          item ? item.value : null
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
                      name={'section'}
                      defaultValue={job.section}
                      onChange={this.handleChangeField}
                    />
                    <p className="error">{this.getErrorMessage('section')}</p>
                  </div>
                  <div className="form-group col-sm-4">
                    <label className="d-block">Municipality</label>
                    <MunicipalitysAsyncSearch
                      defaultValue={
                        job.municipality
                          ? {
                            label: job.municipality.label,
                            value: job.municipality
                          }
                          : null
                      }
                      onSelect={item =>
                        this.handleChangeFieldValue(
                          'municipality',
                          item ? item : null
                        )
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
                      defaultValue={job.po}
                      name={'po'}
                      onChange={this.handleChangeField}
                    />
                    <p className="error">{this.getErrorMessage('po')}</p>
                  </div>
                  <div className="form-group col-sm-3">
                    <label className="d-block">Feeder #</label>
                    <input
                      className="ce-form-control"
                      placeholder="00001"
                      data-type={'number'}
                      name={'feeder'}
                      defaultValue={job.feeder}
                      onChange={this.handleChangeField}
                    />
                    <p className="error">{this.getErrorMessage('feeder')}</p>
                  </div>

                  <div className="form-group col-sm-3">
                    <label className="d-block">Account #</label>
                    <input
                      className="ce-form-control"
                      placeholder="00001"
                      data-type={'number'}
                      defaultValue={job.account}
                      name={'account'}
                      onChange={this.handleChangeField}
                    />
                    <p className="error">{this.getErrorMessage('account')}</p>
                  </div>

                  <div className="form-group col-sm-3">
                    <label className="d-block">Max Workers</label>
                    <input
                      className="ce-form-control"
                      placeholder="1"
                      data-type={'number'}
                      defaultValue={job.maxWorkers}
                      name={'maxWorkers'}
                      onChange={this.handleChangeField}
                    />
                    <p className="error">
                      {this.getErrorMessage('maxWorkers')}
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-sm-3">
                    <label className="d-block">Work Request #</label>
                    <input
                      className="ce-form-control"
                      placeholder="00001"
                      data-type={'number'}
                      defaultValue={job.wr}
                      name={'wr'}
                      onChange={this.handleChangeField}
                    />
                  </div>
                  <div className="form-group col-sm-3">
                    <label className="d-block">Requisition #</label>
                    <input
                      className="ce-form-control"
                      placeholder="00001"
                      data-type={'number'}
                      name={'requisition'}
                      defaultValue={job.requisition}
                      onChange={this.handleChangeField}
                    />
                  </div>
                </div>
              </div>

              <MapSelect
                hasEdit={false}
                locations={job.locations}
                onChangeLocations={this.onChangeLocations}
                error={this.getErrorMessage('locations')}
              />

              {Array.isArray(job.workers) && job.workers.length > 0 ? (
                <div className="box-item-body-none">
                  <div className="form-group">
                    {job.workers.map(_worker => {
                      const user = _worker.worker || {};
                      return (
                        <div
                          className="worker ce-flex worker-edit"
                          onClick={() => this.removeWorker(_worker)}
                        >
                          <img
                            className="worker-img avatar mr-3"
                            src={_worker.thumbnail}
                          ></img>
                          <div>
                            <div className="ce-title">
                              <span>
                                {user.firstName} {user.lastName}
                              </span>
                            </div>
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
                    onChangeImage={(images) => this.handleChangeFieldValue('images', images)}
                  />
                </div>
              </div>

              <div className="box-item-body-none">
                <div className="form-group">
                  <label className="d-block">Comments</label>
                  <textarea
                    rows={5}
                    className="ce-form-control"
                    defaultValue={job.comment}
                    name={'comment'}
                    onChange={this.handleChangeField}
                  />
                  <p className="error">{this.getErrorMessage('comment')}</p>
                </div>

                {authStore.canAssignWorker() && <div className="create-job-assign-worker">
                  <div className=" btn-assign-workers w-100">
                    <span
                      className="d-flex align-items-center justify-content-center pointer"
                      onClick={this.toggleAssign}
                    >
                      <img className="mr-2" src={UserButtonAdd} />
                      Assign Workers{' '}
                      {Array.isArray(this.props.job.workers) &&
                        this.props.job.workers.length}
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
            buttonTitle={'Save and continue'}
            job={this.props.job}
            onAssign={this.assignWorkers}
            onSave={this.toggleAssign}
            workers={this.props.job.workers}

          />
        ) : null}
      </>
    );
  }
}

export default withRouter(JobFormComponent);
