import { Marker } from 'react-google-maps';
import { createBrowserHistory } from 'history';
import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { JobType, JOB_STATUSES } from '../../Constants/job';
import CloseIcon from '../../Images/close-regular.png';
import HelpIcon from '../../Images/help-circle.png';
import { JobLocation, JobWorker } from '../../Models/jobListItem';
import { jobAPI } from '../../Services/API';
import jobStore from '../../Stores/jobStore';
import * as CEIcon from '../../Utils/Icon';
import Gallery from '../Components/ImageUpload/Gallery';
import ImageView from '../Components/ImageView';
import CEModal from '../Components/Modal/Modal.Component';
import qs from 'query-string';
import JobHistoryComponent from './JobHistory';
import JobMenuItemComponent from './JobMenuItem';
import JobAssign from './JobWorkers/JobAssign';
import MapContainer from '../Components/Map/MapContainer';
import mapStore from '../../Stores/mapStore';
import { JobListItem } from '../../Models/jobListItem';
import { Location } from '../../Models/jobItem';
import WorkerGroup from './RerouteWorker/WorkerGroup';

import './JobDetails.scss';
import authStore from '../../Stores/authStore';

enum TabContent {
  TabDetails = 1,
  TabSchedule,
  TabHistory,
}

const MIN_TRACKING_HOURS = 4;

@observer
export class JobDetailsComponent extends React.Component<any, any> {
  tab = TabContent.TabDetails;
  previewImage: string;
  isToggleModal: boolean;
  isToggleInfoModal: boolean;
  timerID: any;
  map: any;
  trackingHours = MIN_TRACKING_HOURS;

  constructor(props) {
    super(props);
    this.state = {
      zoom: 11,
      workerId: '',
    };
  }

  componentDidMount = async () => {
    const params = qs.parse(this.props.location.search);
    if (!params.workerId) {
      await jobStore.fetchJobDetail(this.props.match.params.id);
    } else {
      this.setState({ workerId: params.workerId });
      await jobStore.fetchJobDetail(this.props.match.params.id, {
        workerId: params.workerId,
      });
    }
  };

  componentWillUnmount = () => {
    mapStore.selectJob(null);
  };

  fetchNewData = async () => {
    const params = qs.parse(this.props.location.search);
    if (!params.workerId) {
      await jobStore.fetchJobDetail(this.props.match.params.id);
    } else {
      await jobStore.fetchJobDetail(this.props.match.params.id, {
        workerId: params.workerId,
      });
    }
  };

  showFullImage(url) {
    this.previewImage = url;
    this.setState({ change: true });
  }

  closeFullImage = () => {
    this.previewImage = '';
    this.setState({ change: true });
  };

  changeTab(tab) {
    this.tab = tab;
    this.setState({ change: true });
  }

  showModal(show) {
    this.isToggleModal = show;
    if (show && jobStore.jobDetail.jobStatus === JOB_STATUSES.InProgress) {
      const trackingOffset =
        new Date().getTime() -
        new Date(jobStore.jobDetail.requestTime).getTime();

      if (
        jobStore.jobDetail.jobType !== JobType.Flagging ||
        trackingOffset > MIN_TRACKING_HOURS * 60 * 60 * 1000
      ) {
        this.trackingHours = Math.floor(trackingOffset / (1000 * 60 * 60));
      }
    }
    this.setState({ change: true });
  }

  showInfoModal(show) {
    this.isToggleInfoModal = show;
    this.setState({ change: true });
  }

  onZoomChanged = () => {
    this.setState({ zoom: 11 });
  };

  renderPoint = (jobItem: JobListItem) => {
    return jobItem.locations.map((location: Location, idx) => (
      <Marker
        key={String(idx + location.lat)}
        position={{
          lat: location.lat,
          lng: location.lng,
        }}
      ></Marker>
    ));
  };

  filterWorkerByLocation = (locations = [], workers = []) => {
    let result = [];
    let temp = [...workers];
    if (!this.state.workerId) {
      // Filter worker by job location
      for (let j = 0; j < locations.length; j++) {
        const wks = temp.filter(
          (item) =>
            item.location &&
            locations[j] &&
            item.location.address === locations[j].address
        );
        temp = temp.filter(
          (item) =>
            item.location &&
            locations[j] &&
            item.location.address !== locations[j].address
        );
        result.push({ location: locations[j], workers: wks });
      }

      // Filter worker without location
      const wokerWithoutLocation = temp.filter(
        (item) => !item.location.address
      );
      if (wokerWithoutLocation.length > 0) {
        result.push({
          location: { location: '' },
          workers: wokerWithoutLocation,
        });
        temp = temp.filter((item) => item.location.address);
      }

      // Filter worker with same location
      for (let i = 0; i < temp.length; i++) {
        const wks = temp.filter(
          (item) => item.location.address === temp[i].location.address
        );
        if (wks.length > 1) {
          result.push({ location: temp[i].location, workers: wks });
          temp = temp.filter(
            (item) => item.location.address !== temp[i].location.address
          );
        }
      }
      for (let i = 0; i < temp.length; i++) {
        result.push({ location: temp[i].location, workers: [temp[i]] });
      }
      return result;
    } else {
      // Filter worker without location
      const wokerWithoutLocation = temp.filter(
        (item) => !item.location.address
      );
      if (wokerWithoutLocation.length > 0) {
        result.push({
          location: { location: '' },
          workers: wokerWithoutLocation,
        });
        temp = temp.filter((item) => item.location.address);
      }

      // Filter worker with same location
      for (let i = 0; i < temp.length; i++) {
        const wks = temp.filter(
          (item) => item.location.address === temp[i].location.address
        );
        if (wks.length > 1) {
          result.push({ location: temp[i].location, workers: wks });
          temp = temp.filter(
            (item) => item.location.address !== temp[i].location.address
          );
        }
      }
      for (let i = 0; i < temp.length; i++) {
        result.push({ location: temp[i].location, workers: [temp[i]] });
      }
      return result;
    }
  };

  renderMenu() {
    const disabledCancel =
      authStore.currentUser.id !== jobStore.jobDetail.creatorId &&
      !authStore.canCancelJob();

    return (
      <ul className="nav d-flex justify-content-between">
        <div className="d-flex">
          <li
            className={`nav-item ${
              this.tab === TabContent.TabDetails ? 'active' : ''
            }`}
            onClick={() => this.changeTab(TabContent.TabDetails)}
          >
            <a className="nav-link" href="javascript:;">
              Job Details
            </a>
          </li>
          <li
            className={`nav-item ${
              this.tab === TabContent.TabSchedule ? 'active' : ''
            }`}
            onClick={() => this.changeTab(TabContent.TabSchedule)}
          >
            <a className="nav-link" href="javascript:;">
              Schedule
            </a>
          </li>
          <li
            className={`nav-item ${
              this.tab === TabContent.TabHistory ? 'active' : ''
            }`}
            onClick={() => this.changeTab(TabContent.TabHistory)}
          >
            <a className="nav-link" href="javascript:;">
              History
            </a>
          </li>
        </div>
        {authStore.canDoJobAction() &&
          (!this.state.workerId ? (
            <div className="nav-action-mobile">
              <div className="d-flex align-items-center">
                <a
                  className="nav-link"
                  href={`/job/${jobStore.jobDetail.id}/copy`}
                >
                  <i className="fa fa-copy mr-1"></i>Copy Job
                </a>
                {(authStore.isSuperAdmin() ||
                  jobStore.jobDetail.jobStatus !== JOB_STATUSES.Cancelled) && (
                  <a
                    className="nav-link"
                    href={`/job/${jobStore.jobDetail.id}/edit`}
                  >
                    <i className="fa fa-pencil mr-1"></i>Edit Job
                  </a>
                )}
                {jobStore.jobDetail.jobStatus !== JOB_STATUSES.Cancelled && (
                  <a
                    className={`nav-link ${
                      disabledCancel ? 'button-disabled' : ''
                    }`}
                    href="#"
                    onClick={() =>
                      !disabledCancel ? this.showModal(true) : undefined
                    }
                  >
                    <i className="fa fa-times mr-1"></i>Cancel Job
                  </a>
                )}
              </div>
            </div>
          ) : null)}
      </ul>
    );
  }

  renderComponentJobDetails() {
    return (
      <div className="">
        <div className="box-item">
          <div className="box-item-body">
            <div className="job-item d-flex justify-content-between align-items-start">
              <div className="w-23">
                <div className=" label">Requestor</div>
                <div>{jobStore.jobDetail.requestorName}</div>
                {jobStore.jobDetail.requestorObj && (
                  <>
                    <p
                      className="showNameEmail"
                      style={{ margin: 0 }}
                      title={jobStore.jobDetail.requestorObj.phoneNumber || ''}
                    >
                      {jobStore.jobDetail.requestorObj.phoneNumber || ''}
                    </p>
                    <p
                      className="showNameEmail"
                      style={{ margin: 0 }}
                      title={jobStore.jobDetail.requestorObj.email || ''}
                    >
                      {jobStore.jobDetail.requestorObj.email || ''}
                    </p>
                  </>
                )}
              </div>
              <div className="w-23">
                <div className="label">Supervisor</div>
                <div>{jobStore.jobDetail.supervisorName}</div>
                {jobStore.jobDetail.supervisorObj && (
                  <>
                    <p
                      className="showNameEmail"
                      style={{ margin: 0 }}
                      title={jobStore.jobDetail.supervisorObj.phoneNumber || ''}
                    >
                      {jobStore.jobDetail.supervisorObj.phoneNumber || ''}
                    </p>
                    <p
                      className="showNameEmail"
                      style={{ margin: 0 }}
                      title={jobStore.jobDetail.supervisorObj.email || ''}
                    >
                      {jobStore.jobDetail.supervisorObj.email || ''}
                    </p>
                  </>
                )}
              </div>
              <div className="w-18">
                <div className="label">Municipality</div>
                <div>
                  {jobStore.jobDetail.municipality
                    ? jobStore.jobDetail.municipality.label
                    : `---`}
                </div>
              </div>
              <div className="w-20">
                <div className="label">Department</div>
                <div>{jobStore.jobDetail.departmentName}</div>
              </div>
              <div className="w-16">
                <div className="label">Section</div>
                <div>{jobStore.jobDetail.section}</div>
              </div>
            </div>
          </div>
          <div className="box-item-body">
            <div className="job-item d-flex justify-content-between align-items-center">
              <div className="w-20">
                <div className="label">Confirmation #</div>
                <div>{jobStore.jobDetail.confirmationNumber}</div>
              </div>
              <div className="w-20">
                <div className="label">PO #</div>
                <div>{jobStore.jobDetail.po}</div>
              </div>
              <div className="w-20">
                <div className="label">Feeder #</div>
                <div>{jobStore.jobDetail.feeder}</div>
              </div>
              <div className="w-20">
                <div className="label">Account #</div>
                <div>{jobStore.jobDetail.account}</div>
              </div>
            </div>

            <div className="job-item d-flex justify-content-between align-items-center">
              <div className="w-20">
                <div className="label">Work Request #</div>
                <div>{jobStore.jobDetail.wr || `---`}</div>
              </div>
              <div className="w-20">
                <div className="label">Requisition #</div>
                <div>{jobStore.jobDetail.requisition || `---`}</div>
              </div>
              <div className="w-20">
                <div className="label">Max Workers</div>
                <div>{jobStore.jobDetail.maxWorkers || `---`}</div>
              </div>
              <div className="w-20"></div>
            </div>
          </div>
          <div className="box-item-body">
            {jobStore.jobDetail &&
              jobStore.jobDetail.locations &&
              jobStore.jobDetail.workers && (
                <WorkerGroup
                  groups={this.filterWorkerByLocation(
                    jobStore.jobDetail.locations,
                    jobStore.jobDetail.workers
                  )}
                  jobId={jobStore.jobDetail.id}
                  onSaveSuccess={this.fetchNewData}
                  jobDetail={jobStore.jobDetail}
                />
              )}
          </div>
          <div className="mb-10 d-flex justify-content-between flex-mobile">
            <div className="col-split-2">
              <div className="box-item-body">
                <div className="job-item job-item-comment">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="w-50">
                      <div className="label">Request Date/Time</div>
                      <div>
                        {moment(jobStore.jobDetail.requestTime).format(
                          'MM/DD/YY hh:mm'
                        )}
                      </div>
                    </div>
                    <div className="w-50">
                      <div className="label">Total Hours</div>
                      <div>{jobStore.jobDetail.totalHours | 0}h</div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="w-50">
                      <div className="label">Regular Hours</div>
                      <div>{jobStore.jobDetail.regularHours | 0}h</div>
                    </div>
                    <div className="w-50">
                      <div className="label">Overtime Hours</div>
                      <div>{jobStore.jobDetail.overtimeHours | 0}h</div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="w-50">
                      <div className="label">Holiday Hours</div>
                      <div>{jobStore.jobDetail.holidayHours | 0}h</div>
                    </div>
                    <div className="w-50">
                      <div className="label">1/2 Hour Break</div>
                      <div>No</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-split-2">
              <div className="box-item-body">
                <div className="job-item job-item-comment">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="w-50">
                      <div className="label">Billed</div>
                      <div>
                        {jobStore.jobDetail.jobStatus === JOB_STATUSES.Billed
                          ? `Yes`
                          : `No`}
                      </div>
                    </div>
                    <div className="w-50">
                      <div className="label">Timesheet Received</div>
                      <div>
                        <a
                          className="color-body view-timesheet-action"
                          href={`/timesheets?jobId=${this.props.match.params.id}`}
                        >
                          View Timesheets
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="label">Comments</div>
                    <div>{jobStore.jobDetail.comment}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between  flex-mobile">
            <div className="col-split-2">
              <div className="box-item-body">
                {this.state.workerId ? (
                  <div className="p-4">
                    <div style={{ height: 180, width: '100%' }}>
                      <MapContainer
                        onZoomChanged={this.onZoomChanged}
                        zoom={this.state.zoom}
                        defaultZoom={this.state.zoom}
                        reference={(map) => (this.map = map)}
                        jobLocation={jobStore.jobDetail.locations[0]}
                      >
                        {this.renderPoint(jobStore.jobDetail)}
                      </MapContainer>
                    </div>
                  </div>
                ) : (
                  <div className="job-item d-flex justify-content-between">
                    <div>
                      {jobStore.jobDetail.locations.map(
                        (location: JobLocation) => (
                          <div className="mb-2 d-flex align-items-center">
                            <CEIcon.MapMarkerAltSolidIcon className="mr-2"></CEIcon.MapMarkerAltSolidIcon>
                            <span>
                              {location.address}
                              {location.structure ? (
                                <>
                                  <span className="label">
                                    {' - STRUCTURE: '}
                                  </span>
                                  <span>{location.structure}</span>
                                </>
                              ) : (
                                ''
                              )}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                    <div className="google-map-in-job-details ml-2">
                      <div className="col-right no-margin p-0">
                        <div style={{ height: 180, width: '100%' }}>
                          <MapContainer
                            onZoomChanged={this.onZoomChanged}
                            zoom={this.state.zoom}
                            defaultZoom={this.state.zoom}
                            reference={(map) => (this.map = map)}
                            jobLocation={jobStore.jobDetail.locations[0]}
                          >
                            {this.renderPoint(jobStore.jobDetail)}
                          </MapContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-split-2">
              <div className="box-item-body">
                <div className="job-item d-flex">
                  {jobStore.jobDetail.jobImages && (
                    <Gallery images={jobStore.jobDetail.jobImages} />
                  )}
                </div>
              </div>
              <ImageView
                url={this.previewImage}
                closeScreen={() => this.closeFullImage()}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  updateWorkers = async () => {
    const response = await jobStore.updateJob(jobStore.jobDetail.id, {
      workers: jobStore.jobDetail.workers,
    });
    if (response.status === 200) {
      this.isToggleInfoModal = true;
      this.setState({ change: true });
    }
  };

  assignWorkers = (workers: JobWorker[]) => {
    jobStore.assignWorkersToDetailJob([...workers]);
  };

  renderContent(tab) {
    switch (tab) {
      case TabContent.TabDetails:
        return this.renderComponentJobDetails();
      case TabContent.TabSchedule:
        return (
          <JobAssign
            job={jobStore.jobDetail}
            workers={jobStore.jobDetail.workers}
            onAssign={this.assignWorkers}
            onSave={this.updateWorkers}
            disabled={
              (jobStore.jobDetail.jobStatus === JOB_STATUSES.InProgress ||
                jobStore.jobDetail.jobStatus === JOB_STATUSES.Cancelled ||
                jobStore.jobDetail.jobStatus === JOB_STATUSES.Completed) &&
              !authStore.isSuperAdmin()
            }
            buttonTitle={'Save Changes'}
          />
        );
      case TabContent.TabHistory:
        return (
          <JobHistoryComponent job={jobStore.jobDetail}></JobHistoryComponent>
        );
    }
  }

  cancelJob = async (lateCancel: boolean) => {
    const response = await jobAPI.update(this.props.match.params.id, {
      jobStatus: JOB_STATUSES.Cancelled,
      trackingHours: lateCancel
        ? this.trackingHours
        : Math.floor(
            (new Date().getTime() -
              new Date(jobStore.jobDetail.requestTime).getTime()) /
              (1000 * 60 * 60)
          ),
    });
    createBrowserHistory({ forceRefresh: true }).push(`/job`);
  };

  renderCancelModal() {
    return (
      <CEModal
        show={this.isToggleModal}
        onClose={() => this.showModal(false)}
        size="ce-modal-content modal-lg"
      >
        <div>
          <div className="ce-flex-right">
            <a
              className="pull-right"
              onClick={() => {
                this.showModal(false);
              }}
            >
              <img src={CloseIcon} />
            </a>
          </div>
          <div className="text-center">
            <img src={HelpIcon}></img>
            <div className="m-3">
              <span>
                {jobStore.jobDetail.jobStatus === JOB_STATUSES.InProgress
                  ? `This job has already started, cancelling would invoke a ${this.trackingHours} Hour Charge. Would you like to:`
                  : 'Are you sure?'}
              </span>
            </div>
            <div className="d-flex justify-content-between mx-2 mt-40 mb-25">
              <a
                className="btn ce-btn-modal-cancel"
                onClick={() => {
                  this.showModal(false);
                }}
              >
                <span>Don’t Cancel</span>
              </a>
              {this.trackingHours < MIN_TRACKING_HOURS ? (
                <>
                  <a
                    className="btn ce-btn-modal-save"
                    onClick={() => this.cancelJob(true)}
                  >
                    <span>Accept Late Cancel</span>
                  </a>
                  <a
                    className="btn ce-btn-modal-save"
                    onClick={() => this.cancelJob(false)}
                  >
                    <span>Cancel w/out Min</span>
                  </a>
                </>
              ) : (
                <a
                  className="btn ce-btn-modal-save"
                  onClick={() => this.cancelJob(false)}
                >
                  <span>Cancel Job</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </CEModal>
    );
  }

  public render() {
    return (
      <div className="d-flex App-content job-details-page">
        <div className="col-left">
          <JobMenuItemComponent />
        </div>
        <div className="col-right p-4">
          {this.renderMenu()}
          <div className="border-menu mb-3"></div>
          {this.renderContent(this.tab)}
        </div>
        {this.renderCancelModal()}
        <CEModal
          show={this.isToggleInfoModal}
          onClose={() => this.showInfoModal(false)}
          size="ce-modal-content"
        >
          <div className="modal-header">
            <span> Worker Schedule Updated Successfully!</span>
            <div className="ce-flex-right">
              <a
                className="pull-right"
                onClick={() => {
                  this.showInfoModal(false);
                }}
              >
                <CEIcon.Close />
              </a>
            </div>
          </div>
        </CEModal>
      </div>
    );
  }
}

export default JobDetailsComponent;
