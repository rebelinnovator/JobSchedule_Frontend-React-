import { createBrowserHistory } from 'history';
import { observer } from 'mobx-react';
import * as React from 'react';
import { JobItem } from '../../Models/jobItem';
import './joblist.scss';
import { JobListItem } from '../../Models/jobListItem';
import { JobType, JOB_STATUSES, NOTIFIABLE_TYPES } from '../../Constants/job';
import moment from 'moment';
import authStore from '../../Stores/authStore';
import notificationStore from '../../Stores/notificationStore';

interface Props {
  jobs?: JobListItem[];
  items?: Array<JobItem>;
  onJobFocus: (po: number) => void;
  selectJob: (job: JobListItem) => void;
  onJobBlur: () => void;
  active: number;
  footer?: any;
  // selected: JobListItem;
}

@observer
export class JobListComponent extends React.Component<Props> {
  constructor(props: any) {
    super(props);
  }

  state: any = {
    selectedJobId: null,
  };

  timer = null;

  goDetail(projectId) {}

  onSingleClick = (job: JobListItem, fromMap: boolean) => {
    this.props.selectJob(job);
    this.setState({
      selectedJobId: job.id,
    });
    if (fromMap) {
      const element = document.getElementById(job.id);
      if (!this._isInViewport(element)) {
        element.scrollIntoView();
      }
    }
  };

  onDoubleClick = (job: JobListItem) => {
    createBrowserHistory({ forceRefresh: true }).push(`/job/${job.id}`);
  };

  onClick = (job: JobListItem, type = 'single', fromMap = false) => {
    if (this.timer) clearTimeout(this.timer);
    if (type === 'single') {
       this.timer = setTimeout(() => this.onSingleClick(job, fromMap), 300);
    } else {
      this.onDoubleClick(job);
    }
  };
  _isInViewport = (element: any) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  public render() {
    const { jobs } = this.props;
    const notifcation = notificationStore.notification;
    let jobIndex = null;
    let updatedJob = null;

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
          jobIndex = jobs.findIndex(
            (item) =>
              item.id === (notifcation.notifiableRecord as JobListItem).id
          );
          updatedJob = notifcation.notifiableRecord as JobListItem;
          break;
        default:
          break;
      }
    }

    return (
      <div className="job-list-box">
        <div className="left-item">
          <div className="left-item-wrap">
            <div className="left-item-child">
              {Array.isArray(jobs) &&
                jobs.map((job, index) => (
                  <div
                    id={job.id}
                    onDoubleClick={() => this.onClick(job, 'double')}
                    onClick={() => this.onClick(job)}
                    key={index}
                    // onDoubleClick={() => this.props.selectJob(job)}
                    // onClick={() => this.goDetail(job.id)}
                    onMouseLeave={this.props.onJobBlur}
                    onMouseEnter={() => this.props.onJobFocus(job.po)}
                    className={`job-item ${
                      this.state.selectedJobId === job.id ? 'job-active' : ''
                    }`}
                  >
                    <button className="job-component">
                      <div className="header">
                        <div className="header-title">
                          <span className="title">{JobType[job.jobType]}</span>
                          <div
                            className={`circle-${JOB_STATUSES[
                              index !== jobIndex || updatedJob == null
                                ? job.jobStatus
                                : updatedJob.jobStatus
                            ].toLowerCase()}`}
                          ></div>
                          <span>
                            {
                              JOB_STATUSES[
                                index !== jobIndex || updatedJob == null
                                  ? job.jobStatus
                                  : updatedJob.jobStatus
                              ]
                            }
                          </span>
                        </div>
                        <a style={{ color: '#3a3c3e' }} href={`/job/${job.id}`}>
                          {job.uid}
                        </a>
                      </div>

                      <div className="content">
                        <div
                          style={{
                            display: 'flex',
                            textAlign: 'left',
                            flexDirection: 'column',
                          }}
                        >
                          <div className="">
                            {Array.isArray(job.locations)
                              ? job.locations
                                  .map((loc) => loc.address)
                                  .join(', ')
                              : null}
                          </div>
                          <div>
                            <span className="request-date-time-title">
                              Request Date/Time
                            </span>
                            <div className="request-date-time">
                              <span>
                                {moment(job.requestTime).format(
                                  'DD MMM YY hh:mm'
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="job-worker ml-3">
                          {Array.isArray(job.workers) ? (
                            <div
                              className="worker-box"
                              style={{ zIndex: job.workers.length }}
                            >
                              <div className="worker-box-round">
                                <span className="worker-total">
                                  {' '}
                                  {job.workers.length}
                                </span>
                              </div>
                            </div>
                          ) : null}
                          {Array.isArray(job.workers) &&
                            job.workers.map((JobWorker, i) => (
                              <div
                                className="worker-box"
                                style={{ zIndex: job.workers.length - (i + 1) }}
                                key={i}
                              >
                                <img
                                  className="worker-img  avatar"
                                  alt="avatar"
                                  src={`${process.env.REACT_APP_API_ENDPOINT}${JobWorker.worker.avatar}`}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              {this.props.footer}
            </div>
          </div>
          {authStore.canDoJobAction() && (
            <div className="left-item-body">
              <div
                className={`create-job ${
                  window.navigator.platform === 'MacIntel' ? 'os-offset' : ''
                }`}
              >
                <a
                  style={{ textDecoration: 'none' }}
                  href="/job/create"
                  className="create-job-button"
                >
                  Create Job
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default JobListComponent;
