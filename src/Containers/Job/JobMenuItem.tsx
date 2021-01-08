import * as React from 'react';

import './jobmenuitem.scss';
import { JobMenuItem } from '../../Models/jobMenuItem';

import AlertIcon from '../../Images/alert-circle.png';

import * as CeIcon from '../../Utils/Icon';
import CEModal from '../Components/Modal/Modal.Component';
import { Link } from 'react-router-dom';
import jobStore from '../../Stores/jobStore';
import { JOB_STATUSES, JobType, NOTIFIABLE_TYPES } from '../../Constants/job';
import { JobWorker, JobLocation, JobListItem } from '../../Models/jobListItem';
import notificationStore from '../../Stores/notificationStore';
import { observer } from 'mobx-react';

interface Props {
  item?: JobMenuItem;
}

@observer
export class JobMenuItemComponent extends React.Component<Props> {
  isToggleModal: boolean;
  isRoute: boolean;
  selectedWorker: any;
  hasWorker: boolean;
  hasTimeSheet: boolean;
  hasLocation: boolean;

  constructor(props) {
    super(props);
    this.hasWorker = true;
    this.hasTimeSheet = true;
    this.hasLocation = true;
  }

  closeOnRoute = () => {
    this.isRoute = false;
    this.setState({ change: true });
  };

  closeModal = () => {
    this.isToggleModal = false;
    this.setState({ change: true });
  };


  getTimeSheetsInfo = (): { paid: number, unpaid: number } => {
    const info = Array.isArray(jobStore.jobDetail.timesheets) ?
      jobStore.jobDetail.timesheets.reduce((obj: any, timesheet: any) => {

        if (timesheet.paid) {
          obj = {
            ...obj,
            paid: obj.paid + 1
          }
        } else {
          obj = {
            ...obj,
            unpaid: obj.unpaid + 1
          }
        }
        return obj
      }, { paid: 0, unpaid: 0 }) : { paid: 0, unpaid: 0 }

    return info
  }
  public render() {
    const notifcation = notificationStore.notification;
    let status = jobStore.jobDetail.jobStatus;
    if (notifcation) {
      switch (notifcation.notifiableType) {
        case NOTIFIABLE_TYPES.CREATE_JOB:
        case NOTIFIABLE_TYPES.CANCEL_JOB:
        case NOTIFIABLE_TYPES.ASSIGN_JOB:
        case NOTIFIABLE_TYPES.WORKER_EN_ROUTE:
        case NOTIFIABLE_TYPES.WORKER_ON_LOCATION:
        case NOTIFIABLE_TYPES.WORKER_SECURED_SITE:
        case NOTIFIABLE_TYPES.WORKER_UPLOAD_AN_IMAGE:
        case NOTIFIABLE_TYPES.WORKER_ENDED_SHIFT:
        case NOTIFIABLE_TYPES.EDIT_JOB:
        case NOTIFIABLE_TYPES.PO_NUMBER_HAS_BEEN_ADDED:
          if ((notifcation.notifiableRecord as JobListItem).id === jobStore.jobDetail.id) {
            status = Number((notifcation.notifiableRecord as JobListItem).jobStatus);
          }
          break;
        default:
          break;
      }
    }

    const timesheetsInfo = this.getTimeSheetsInfo()
    return (
      <div className="left-item">
        <div className="left-item-body">
          <div className="job-menu-item">
            <div className="menu-header">
              <div className="header-title">
                <span className="title">{JobType[jobStore.jobDetail.jobType]}</span>
                <div className={`circle-status circle-${JOB_STATUSES[status] ?
                  JOB_STATUSES[status].toLowerCase() :
                  ''}`}>
                </div>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    this.isRoute = true;
                    this.setState({ change: true });
                  }}
                >{JOB_STATUSES[status]}
                  <span className="pl-1">
                    <CeIcon.ChevronDownIcon />
                  </span>
                </span>
              </div>
              <span>{jobStore.jobDetail.uid}</span>
            </div>
            <div className="content">
              <div className="job-worker">
                <div className="left-item-header text-uppercase">
                  <div className="header">
                    <span>Workers</span>
                    <div>
                      <span className="mr-3">
                        {Array.isArray(jobStore.jobDetail.workers) ?
                          jobStore.jobDetail.workers.length :
                          null}
                      </span>
                      {this.hasWorker ? (
                        <CeIcon.ChevronUpIcon
                          onClick={() => {
                            this.hasWorker = !this.hasWorker;
                            this.setState({ change: true });
                          }}
                          className="cursor-pointer"
                        />
                      ) : (
                          <CeIcon.ChevronDownIcon
                            onClick={() => {
                              this.hasWorker = !this.hasWorker;
                              this.setState({ change: true });
                            }}
                            className="cursor-pointer"
                          />
                        )}
                    </div>
                  </div>
                </div>
                {this.hasWorker && (
                  <div className="job-worker-list">
                    {Array.isArray(jobStore.jobDetail.workers) &&
                      jobStore.jobDetail.workers.map((jobWorker: JobWorker, idx) => (
                        <div className="job-worker-list-item">
                          <div className="worker">
                            <img
                              alt="avatar"
                              className="worker-img avatar"
                              src={`${process.env.REACT_APP_API_ENDPOINT}${jobWorker.worker.avatar}`}
                            />
                            <div>
                              <div className="ce-title">
                                <span>{jobWorker.worker.name}</span>
                              </div>
                              <div className="ce-sub-tilte">
                                {jobWorker.assignerName && <span>Appointed by {jobWorker.assignerName}</span>}
                              </div>
                            </div>
                          </div>

                          {/*<div className="job-worker-icon" data-tip="OnLocation">
                          <CeIcon.EndRouteIcon
                            onClick={() => {
                              this.selectedWorker = jobWorker;
                              this.isRoute = true;
                              this.setState({ change: true });
                            }}
                            className="worker-img-status cursor-pointer"
                          />
                        </div>*/}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <div className="job-time-sheet">
                <div className="left-item-header text-uppercase">
                  <div className="header">
                    <span>TIMESHEETS</span>
                    <div>
                      <span className="mr-3">
                        {Array.isArray(jobStore.jobDetail.timesheets) ?
                          jobStore.jobDetail.timesheets.length :
                          0
                        }
                      </span>
                      {this.hasTimeSheet ? (
                        <CeIcon.ChevronUpIcon
                          className="cursor-pointer"
                          onClick={() => {
                            this.hasTimeSheet = !this.hasTimeSheet;
                            this.setState({ change: true });
                          }}
                        />
                      ) : (
                          <CeIcon.ChevronDownIcon
                            className="cursor-pointer"
                            onClick={() => {
                              this.hasTimeSheet = !this.hasTimeSheet;
                              this.setState({ change: true });
                            }}
                          />
                        )}
                    </div>
                  </div>
                </div>

                {this.hasTimeSheet && (
                  <div className="job-worker-list">
                    <div className="job-worker-list-item">
                      <span>
                        <div >Paid</div>
                      </span>
                      <span>
                        <div >{timesheetsInfo.paid}</div>
                      </span>
                    </div>

                    <div className="job-worker-list-item">
                      <span>
                        <div >Unpaid</div>
                      </span>
                      <span>
                        <div >{timesheetsInfo.unpaid}</div>
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="job-location">
                <div className="left-item-header text-uppercase">
                  <div className="header">
                    <span>LOCATIONS</span>
                    {jobStore.jobDetail.locations && (
                      <div>
                        <span className="mr-3">
                          {jobStore.jobDetail.locations.length}
                        </span>
                        {this.hasLocation ? (
                          <CeIcon.ChevronUpIcon
                            className="cursor-pointer"
                            onClick={() => {
                              this.hasLocation = !this.hasLocation;
                              this.setState({ change: true });
                            }}
                          />
                        ) : (
                            <CeIcon.ChevronDownIcon
                              className="cursor-pointer"
                              onClick={() => {
                                this.hasLocation = !this.hasLocation;
                                this.setState({ change: true });
                              }}
                            />
                          )}
                      </div>
                    )}
                  </div>
                </div>
                {this.hasLocation && (
                  <div className="job-worker-list">
                    {jobStore.jobDetail.locations &&
                      jobStore.jobDetail.locations.map((location: JobLocation, i) => (
                        <div className="job-worker-list-item">
                          <span>{location.address}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <CEModal
          show={this.isToggleModal}
          onClose={() => this.closeModal()}
          className="ce-route-modal-alert"
          size="ce-modal-content"
        >
          <div>
            <div className="ce-flex-right">
              <a
                className="pull-right"
                onClick={() => {
                  this.closeModal();
                }}
              >
                <CeIcon.Close />
              </a>
            </div>
            <div className="text-center">
              <div>
                <img src={AlertIcon} />
              </div>
              <div className="m-3 title-alert">
                <label>This job has already started,</label>
                <label>cancelling would invoke a 4 Hour Minimum</label>
              </div>
              <div className="group-button d-flex justify-content-between mx-2 mt-30 mb-25">
                <a
                  className="btn ce-btn-modal-cancel"
                  onClick={() => {
                    this.closeModal();
                  }}
                >
                  <span>Don't Cancel</span>
                </a>
                <a
                  className="btn ce-btn-modal-cancel"
                  onClick={() => {
                    this.closeModal();
                  }}
                >
                  <span>Cancel Without Min</span>
                </a>
                <a
                  className="btn ce-btn-modal-save"
                  onClick={() => {
                    // this.onListWorkers(true)
                  }}
                >
                  <span>Accept Late Cancel</span>
                </a>
              </div>
            </div>
          </div>
        </CEModal>
        <CEModal
          show={this.isRoute}
          onClose={() => this.closeOnRoute()}
          className="ce-route-modal"
          size="ce-modal-content"
        >
          <div className="ce-align-flex">
            {this.selectedWorker && (
              <div className="worker ce-flex">
                <img
                  className="worker-img avatar mr-3"
                  src={this.selectedWorker.thumbnail}
                ></img>
                <div>
                  <div className="ce-title">
                    <span>{this.selectedWorker.name}</span>
                  </div>
                  <div className="ce-sub-tilte">
                    <span>Appointed by {this.selectedWorker.assignerName}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="ce-flex-right">
              <a
                className="pull-right"
                onClick={() => {
                  this.closeOnRoute();
                }}
              >
                <CeIcon.Close />
              </a>
            </div>
          </div>

          <div className="route-container">
            <div className="router-container-in d-flex w-100">
              <div className="state-container">
                <div className="state-icon">
                  <CeIcon.OnrouteIcon className="cursor-pointer" />
                  <div className="route-dot"></div>
                </div>
                <div className="state-text">
                  <span className="text-bold">EnRoute</span>
                  <span className="text-time"></span>
                  <span className="text-time"></span>
                </div>
              </div>
              <div className="state-container">
                <div className="state-icon">
                  <CeIcon.EndRouteIcon className="cursor-pointer" />

                  <div className="route-dot"></div>
                </div>
                <div className="state-text">
                  <span className="text-bold">OnLocation</span>
                  <span className="text-time"></span>
                  <span className="text-time"></span>
                </div>
              </div>
              <div className="state-container">
                <div className="state-icon">
                  <CeIcon.ShieldCircelIcon
                    fill="#C3C3C3"
                    className="cursor-pointer"
                  />
                  <div className="route-dot"></div>
                </div>
                <div className="state-text">
                  <div className="ce-flex ce-mr-10">
                    {/*<CeIcon.CheckCircleIcon className="ce-mr-10"/>*/}
                    <span className="text-medium">Secured</span>
                  </div>
                  {/* <span>06/15/2019</span>
                            <span>09:00</span> */}
                </div>
              </div>
            </div>

            <div className="state-container-end">
              <div className="state-icon">
                <CeIcon.LeavingIcon className="cursor-pointer" />
              </div>
              <div className="state-text">
                <div className="ce-flex ce-mr-10">
                  {/*<CeIcon.CheckCircleIcon className="ce-mr-10"/>*/}
                  <span className="text-medium">Leaving</span>
                </div>
                {/* <span>06/15/2019</span><span>09:00</span> */}
              </div>
            </div>
          </div>
        </CEModal>
      </div>
    );
  }
}

export default JobMenuItemComponent;
