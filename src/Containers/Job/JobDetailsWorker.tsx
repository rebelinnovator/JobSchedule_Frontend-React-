import GoogleMapReact from 'google-map-react';
import { createBrowserHistory } from 'history';
import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { JOB_STATUSES } from '../../Constants/job';
import CloseIcon from '../../Images/close-regular.png';
import HelpIcon from '../../Images/help-circle.png';
import { JobLocation, JobWorker } from '../../Models/jobListItem';
import { jobAPI } from '../../Services/API';
import jobStore from '../../Stores/jobStore';
import * as CEIcon from '../../Utils/Icon';
import Gallery from '../Components/ImageUpload/Gallery';
import ImageView from '../Components/ImageView';
import CEModal from '../Components/Modal/Modal.Component';
import Point from '../Maps/Point';
import WorkerMarker from '../Maps/WorkerMaker/WorkerMarker';
import './JobDetails.scss';
import JobHistoryComponent from './JobHistory';
import JobMenuItemComponent from './JobMenuItem';
import JobAssign from './JobWorkers/JobAssign';
import WorkerGroup from './RerouteWorker/WorkerGroup';

enum TabContent {
  TabDetails = 1,
  TabSchedule,
  TabHistory
}

@observer
export class JobDetailsComponent extends React.Component<any> {
  tab = TabContent.TabDetails;
  previewImage: string;
  isToggleModal: boolean;
  timerID: any;

  componentDidMount = async () => {
    await jobStore.fetchJobDetail(this.props.match.params.id);
  };

  componentWillUnmount = () => {
  }

  fetchNewData = async () => {
    await jobStore.fetchJobDetail(this.props.match.params.id);
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
    this.setState({ change: true });
  }

  filterWorkerByLocation = (locations = [], workers = []) => {
    let result = [];
    let temp = [...workers];
    // Filter worker by job location
    for (let j = 0; j < locations.length; j++) {
      const wks = temp.filter(item => item.location.address === locations[j].address);
      temp = temp.filter(item => item.location.address !== locations[j].address);
      result.push({ location: locations[j], workers: wks });
    }

    // Filter worker without location
    const wokerWithoutLocation = temp.filter(item => !item.location.address);
    if (wokerWithoutLocation.length > 0) {
      result.push({ location: { location: '' }, workers: wokerWithoutLocation });
      temp = temp.filter(item => item.location.address);
    }

    // Filter worker with same location
    for (let i = 0; i < temp.length; i++) {
      const wks = temp.filter(item => item.location.address === temp[i].location.address);
      if (wks.length > 1) {
        result.push({ location: temp[i].location, workers: wks });
        temp = temp.filter(item => item.location.address !== temp[i].location.address);
      }
    }
    for (let i = 0; i < temp.length; i++) {
      result.push({ location: temp[i].location, workers: [temp[i]] });
    }
    return result;

  }

  renderMenu() {
    return (
      <ul className="nav d-flex justify-content-between">
        <div className="d-flex">
          <li
            className={`nav-item ${this.tab === TabContent.TabDetails ? 'active' : ''
              }`}
            onClick={() => this.changeTab(TabContent.TabDetails)}
          >
            <a className="nav-link" href="javascript:;">
              Job Details
            </a>
          </li>
          <li
            className={`nav-item ${this.tab === TabContent.TabSchedule ? 'active' : ''
              }`}
            onClick={() => this.changeTab(TabContent.TabSchedule)}
          >
            <a className="nav-link" href="javascript:;">
              Schedule
            </a>
          </li>
          <li
            className={`nav-item ${this.tab === TabContent.TabHistory ? 'active' : ''
              }`}
            onClick={() => this.changeTab(TabContent.TabHistory)}
          >
            <a className="nav-link" href="javascript:;">
              History
            </a>
          </li>
        </div>
        <div className="nav-action-mobile">
          <div className="d-flex align-items-center">
            {/*<a className="nav-link" href="#"><img src={cloneSolid}></img> Duplicate</a>*/}
            <a className="nav-link" href={`/job/${jobStore.jobDetail.id}/edit`}>
              <i className="fa fa-pencil mr-1"></i>Edit Job
            </a>
            <a
              className="nav-link"
              href="#"
              onClick={() => this.showModal(true)}
            >
              <i className="fa fa-times mr-1"></i>Cancel Job
            </a>
          </div>
        </div>
      </ul>
    );
  }

  renderComponentJobDetails() {
    return (
      <div className="">
        <div className="box-item">
          <div className="box-item-body">
            <div className="job-item d-flex justify-content-between align-items-center">
              <div className="w-20">
                <div className=" label">Requestor</div>
                <div>{jobStore.jobDetail.requestorName}</div>
              </div>
              <div className="w-20">
                <div className="label">Supervisor</div>
                <div>{jobStore.jobDetail.supervisorName}</div>
              </div>
              <div className="w-20">
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
              <div className="w-20">
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
              <div className="w-20">
              </div>
            </div>
          </div>
          <div className="box-item-body">
            {jobStore.jobDetail && jobStore.jobDetail.locations && jobStore.jobDetail.workers && (
              <WorkerGroup
                groups={this.filterWorkerByLocation(jobStore.jobDetail.locations, jobStore.jobDetail.workers)}
                jobId={jobStore.jobDetail.id}
                onSaveSuccess={this.fetchNewData}
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
                <div className="job-item d-flex justify-content-between">
                  <div>
                    {jobStore.jobDetail.locations.map(
                      (location: JobLocation) => (
                        <div className="mb-2 d-flex align-items-center">
                          <CEIcon.MapMarkerAltSolidIcon className="mr-2"></CEIcon.MapMarkerAltSolidIcon>
                          <span>{location.address}{location.structure ? <><span className="label">{' - STRUCTURE: '}</span><span>{location.structure}</span></> : ''}</span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="google-map-in-job-details ml-2">
                    {Array.isArray(jobStore.jobDetail.locations) &&
                      jobStore.jobDetail.locations.length ? (
                        <GoogleMapReact
                          bootstrapURLKeys={{
                            key: process.env.REACT_APP_GOOGLE_MAP_AIP_KEY
                          }}
                          center={{
                            lat: jobStore.jobDetail.locations[0].lat,
                            lng: jobStore.jobDetail.locations[0].lng
                          }}
                          yesIWantToUseGoogleMapApiInternals
                          defaultZoom={11}
                        >
                          {jobStore.jobDetail.locations.map((location, idx) => (
                            <Point
                              key={`point${idx}`}
                              lat={location.lat}
                              lng={location.lng}
                            >
                              {idx + 1}
                            </Point>
                          ))}
                          {jobStore.jobDetail.workers.map((worker, idx) => (
                            <WorkerMarker
                              key={`point${idx}`}
                              lat={worker.location.lat}
                              lng={worker.location.lng}
                              worker={worker}
                            />
                          ))}
                        </GoogleMapReact>
                      ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-split-2">
              <div className="box-item-body">
                <div className="job-item d-flex">
                  {jobStore.jobDetail.jobImages && <Gallery images={jobStore.jobDetail.jobImages} />}
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

  updateWorkers = () => {
    jobStore.updateJob(jobStore.jobDetail.id, {
      workers: jobStore.jobDetail.workers
    });
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
            buttonTitle={'Save Changes'}
          />
        );
      case TabContent.TabHistory:
        return (
          <JobHistoryComponent job={jobStore.jobDetail}></JobHistoryComponent>
        );
    }
  }

  cancelJob = async () => {
    const response = await jobAPI.update(this.props.match.params.id, {
      jobStatus: JOB_STATUSES.Cancelled
    });
    createBrowserHistory({ forceRefresh: true }).push(`/job`);
  };

  renderCancelModal() {
    return (
      <CEModal
        show={this.isToggleModal}
        onClose={() => this.showModal(false)}
        size="ce-modal-content"
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
                  ? ` The Job has already started, if you close it now, you will be
                  charged for tracked hours.`
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
                <span>Close</span>
              </a>
              <a className="btn ce-btn-modal-save" onClick={this.cancelJob}>
                <span>Cancel Job</span>
              </a>
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
      </div>
    );
  }
}

export default JobDetailsComponent;
