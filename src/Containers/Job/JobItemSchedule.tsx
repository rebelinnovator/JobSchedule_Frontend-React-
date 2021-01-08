import { createBrowserHistory } from 'history';
import React from 'react';
import { Link } from 'react-router-dom';
import { JobType, JOB_STATUSES, NOTIFIABLE_TYPES } from '../../Constants/job';
import { JobListItem } from '../../Models/jobListItem';
import CheckboxComponent from '../Components/Controls/Checkbox.Component';
import moment from 'moment';
import jobStore from '../../Stores/jobStore';
import { observer } from 'mobx-react';
import WorkerGroup from './RerouteWorker/WorkerGroup';
import notificationStore from '../../Stores/notificationStore';

interface Props {
  job: JobListItem;
  index: number;
  selectable?: boolean;
  search?: () => void;
  rerouteable?: boolean;
}

@observer
export class JobItemSchedule extends React.Component<Props, any> {

  static defaultProps = {
    selectable: true,
  };

  jobStatus: string[];
  constructor(props: Props) {
    super(props);
    this.jobStatus = [
      JOB_STATUSES[1],
      JOB_STATUSES[2],
      JOB_STATUSES[3],
      JOB_STATUSES[4],
      JOB_STATUSES[5],
    ];
    this.state = {
      selectedWorkers: [],
      isToggleModal: false,
      newLocations: [],
      images: [],
    };
  }

  gotoDetails = () => {
    createBrowserHistory({ forceRefresh: true }).push(`/job/${this.props.job.id}`);
  };

  filterWorkerByLocation = (locations = [], workers = []) => {
    if (this.props.rerouteable) {
      let result = [];
      let temp = [...workers];
      // Filter worker by job location
      for (let j = 0; j < locations.length; j++) {
        const wks = temp.filter(item => item.location && locations[j].address && item.location.address === locations[j].address);
        temp = temp.filter(item => item.location && locations[j].address && item.location.address !== locations[j].address);
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
  }

  handleCompleteJob = async (event) => {
    event.stopPropagation();
    await jobStore.updateJob(this.props.job.id, { jobStatus: JOB_STATUSES.Completed });
    if (this.props.search) {
      this.props.search();
    }
  }

  public render() {
    const { job } = this.props;
    const notifcation = notificationStore.notification;
    const isJobAvailableToComplete = job.workers.length > 0 && job.workers.every(worker => worker.status === 7);
    const isShowJobCompleteButton = isJobAvailableToComplete && job.jobStatus !== JOB_STATUSES.Completed;
    let status = job.jobStatus;
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
          if ((notifcation.notifiableRecord as JobListItem).id === job.id) {
            status = Number((notifcation.notifiableRecord as JobListItem).jobStatus);
          }
          break;
        default:
          break;
      }
    }

    return (
      <div className="box-item-body hover-item-body cursor-pointer">
        <div onClick={this.gotoDetails}>
          <div className="job-item border-bottom d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              {this.props.selectable ? <CheckboxComponent
                onChange={() => jobStore.toggleJob(job.id)}
                id={`type${this.props.index}`}
                hasTitle={JobType[job.jobType]}
                checked={jobStore.selectedJobs.includes(job.id)}
                className="mb-0 mr-3" /> : null}
              <div className="d-flex align-items-center">
                <span className={`mr-2 circle-${JOB_STATUSES[status || 0].toLowerCase()}`}/>
                {JOB_STATUSES[status || 0]}
              </div>
            </div>
            <div className="d-flex">
              {
                isShowJobCompleteButton && (
                    <button className="btn btn-success btn-add mx-3" onClick={this.handleCompleteJob}>
                      Complete Job
                    </button>
                )
              }
              <div className="text-right">
                <Link className="goto-job-detail" to={`/job/${job.id}`}>
                  <div>{job.confirmationNumber}</div>
                </Link>
                <div className="text-time-job">{moment(job.requestTime).format('MM/DD/YY hh:mm')}</div>
              </div>
            </div>
          </div>
          <div className="job-item flex-mobile border-bottom d-flex align-items-center">
            <div className="text-left job-info">
              <div className="label">Start date</div>
              <div>{moment(job.requestTime).format('MM/DD/YY hh:mm')}</div>
            </div>
            <div className="text-left job-info">
              <div className="label">Supervisor</div>
              <div>{job.supervisorName}</div>
            </div>
            <div className="text-left job-info">
              <div className="label">Department</div>
              <div>{job.departmentName}</div>
            </div>
            <div className="text-left job-info">
              <div className="label">Requestor</div>
              <div>{job.requestorName}</div>
            </div>
            <div className="text-right w-100 job-info-right">
              <div className="label">PO#</div>
              <div>{job.po}</div>
            </div>
          </div>
        </div>

        {this.props.rerouteable && (
          <WorkerGroup
            groups={this.filterWorkerByLocation(job.locations, job.workers)}
            jobId={this.props.job.id}
            hasSeen={this.props.job.hasSeen}
            onSaveSuccess={this.props.search}
            jobDetail={this.props.job}
          />
        )}

      </div>
    );
  }
}

export default JobItemSchedule;
