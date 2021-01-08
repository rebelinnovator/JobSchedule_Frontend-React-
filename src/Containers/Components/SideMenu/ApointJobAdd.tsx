import React from 'react';
import DropdownComponent from '../Dropdownlist/Dropdown.Component';
import './sidemenu.scss';
import mapLocationImage from '../../../Assets/map-location.png'
import fileText from '../../../Images/file-text.png'
import PlusIcon from '../../../Images/plus.png';
import DeleteIcon from '../../../Images/trash-solid.png';
import { AssignWorker } from '../../../Models/assignWorker';
import DateComponent from '../Date/Date.Component';

import closeRegular from '../../../Images/close-regular.png';
import * as CeIcon from '../../../Utils/Icon';
import { LocationItem } from "../../../Models/locationItem";
import { formatDate, FORMATES } from '../../../Utils/Date';
import { JobType } from '../../../Constants/job';
import { FiltredJob } from '../../Workers/WorkerSchedule/WorkerSchedule';
import JobsAsyncSearch from '../Controls/JobsAsyncSearch';
import ApointedJobForm from './ApointedJobForm';
interface Props {
  showed: boolean;
  closeSlide: Function;
}

export class ApointJobAddSliderComponent extends React.Component<any> {
  workers: Array<AssignWorker>;
  constructor(props: any) {
    super(props);
    this.workers = new Array<AssignWorker>();

    const location = new LocationItem();
    this.workers.push({
      location,
    } as AssignWorker);

  }

  state = {
    clear: Date.now(),
    creating: false
  };

  close = () => {
    this.props.closeSlide();
    this.setState({ clear: Date.now() });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showed == false) {
      this.workers = new Array<AssignWorker>();
      const location = new LocationItem();
      this.workers.push({
        location,
      } as AssignWorker);
    }
  }
  addWorker() {
    const currentDate = new Date();
    const location = new LocationItem();
    this.workers.push({
      location,
      startDate: currentDate,
    } as AssignWorker);
  }
  onRemove(index: number) {
    this.workers.splice(index, 1);
    this.setState({ change: true });
  }

  renderJobs = () => {
    const jobs = this.props.getJobsByDate(this.props.selectedDate.id);
    return jobs.map(({ job, workers }: FiltredJob, index) => {
      return workers.map((worker) => {
        return <div
          className={'worker-row-item'}
        >
          <div className="ce-assign-worker side-apoint-job">
            <div className="ce-assign-worker-action cursor-pointer sbtw">
              <span className="sbtw">
                <span className="ce-title">
                  <b style={{ fontSize: 16 }}>{JobType[job.jobType]}</b>
                </span>
                <span style={{ marginLeft: 20 }}>{job.uid}</span>
              </span>

              <a
                className=""
                onClick={() => {
                  this.onRemove(index);
                }}
              >
                <img className="ce-mr-10 cursor-pointer" src={CeIcon.TrashIconB} alt="" />
                Delete
              </a>
            </div>
            <div
              className="ce-assign-worker-action cursor-pointer sbtw"
              style={{ marginBottom: 17, marginTop: 17 }}>
              <span>
                <img src={mapLocationImage} className="avatar" />
                {' '} {worker.location.address}
              </span>
            </div>
            <div
              className="slide-header d-flex align-items-center justify-content-between"
              style={{ height: 35, width: 'calc(100% + 55px)', marginLeft: -35, paddingLeft: 35 }}>
              Scheduled Time
            </div>

            <div className="ce-assign-worker-record work-time sbtw">
              <DateComponent
                hasTitle="Start Date"
                date={new Date(worker.startDate)}
                maxDate={worker.endDate ? new Date(worker.endDate) : null} />
              <DateComponent
                hasTitle="End time"
                date={worker.endDate ? new Date(worker.endDate) : null}
                minDate={new Date(worker.startDate)} />
            </div>
            <div className="ce-assign-worker-record work-location-list d-flex"
              style={{ flexDirection: 'column' }}>
              {Array.isArray(worker.timesheets) ? worker.timesheets.map((timesheet) => {
                return <div style={{ width: '100%', marginBottom: 10 }}>
                  <a href={`/timesheets/${timesheet.id}/edit`}
                    style={{ color: 'gray', width: '100%' }}>
                    <img src={fileText} style={{ marginRight: 15 }} />Open Timesheets</a>
                </div>
              }) : null}

            </div>
          </div>
        </div>
      })
    })


  }
  public render() {
    return (
      <div className={'slide-container ' + (this.props.showed ? 'showed' : '')}>
        <div className="slide-content">
          <div className="slide-header d-flex align-items-center justify-content-between">
            <div className="slide-title">
              {this.props.selectedDate ?
                formatDate(this.props.selectedDate.id, FORMATES.date) :
                null} {'  '}
              {Array.isArray(this.props.jobs) ? `${this.props.jobs.length} Jobs` : null}
            </div>
            <img
              className="cursor-pointer p-1"
              onClick={this.close}
              src={closeRegular}
            ></img>
          </div>


          <div className="slide-body">

            {this.props.selectedDate ? this.renderJobs() : null}

            {this.state.creating ?
              <ApointedJobForm
                closeSlide={this.props.closeSlide}
                clear={this.state.clear}
                onDelete={() => this.setState({ creating: false })}
                workerId={this.props.workerId} /> :
              <div className="worker-action">
                <div className="ce-assign-worker-record">
                  <a
                    className="btn ce-btn-confirm cursor-pointer"
                    onClick={() => {
                      this.setState({ creating: true });
                    }}
                  >
                    <span>Add Another Job</span>
                  </a>
                </div>
              </div>}
          </div>
        </div>
      </div >
    );
  }
}
