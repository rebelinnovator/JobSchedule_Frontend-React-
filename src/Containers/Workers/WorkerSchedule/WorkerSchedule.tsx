import React from 'react';

import '../../Components/Calendars/style.scss';

import { CalendarItem } from './CalendarItem';

import PrevIcon from '../../../Images/chevron-right-13.png';
import NextIcon from '../../../Images/chevron-right-12.png';

import { CalendarType } from './CalendarType';

import { AddWorkerSlideComponent } from './WorkerAdd';
import * as CeIcon from '../../../Utils/Icon';
import { JobItem } from '../../../Models/jobItem';
// import jobStore from '../../../Stores/jobStore';
import { AssignWorker } from '../../../Models';
import { withRouter } from 'react-router';
import moment from 'moment';
import * as _ from 'lodash';
import { JobListItem, JobWorker } from '../../../Models/jobListItem';
import { JobType } from '../../../Constants/job';
import { formatDate, FORMATES } from '../../../Utils/Date';
import { ApointJobAddSliderComponent } from '../../Components/SideMenu/ApointJobAdd';
import { WorkerItem } from '../../../Models/workerItem';

interface Props {
  match: any;
  onAddWorker?: Function;
  onDisplayWorkers?: Function;
  onAddJob?: Function;
  onDisplayJobs?: Function;
  typeOfCalendar?: CalendarType;
}

export interface FiltredJob {
  job: JobItem;
  workers: JobWorker[];
}

export class WorkerSchedule extends React.Component<any> {

  currentDate: Date;
  jobId: number;
  job: JobItem;
  listNameOfDay: Array<string>;
  nameOfDay: string = 'SUN,MON,TUE,WED,THU,FRI,SAT';
  nameOfMonth: string = 'January,February,March,Aprial,May,June,July,August,Steptember,October,November,December';
  nameOfMonthList: Array<any>;
  action_css = 'calendar-action';

  calendarRows: Array<Array<CalendarItem>>;
  nextMonth: number = 0;
  isToggleModal: boolean;
  showWorkers: boolean;
  showWorkerAdd: boolean;
  showApointJobAdd: boolean;
  showApointJob: boolean;
  selectedDate: CalendarItem;

  static defaultProps = {
    workers: [],
    job: JobItem,
    buttonTitle: 'Edit job',
  };

  state = {
    dayWorkers: [],
  };

  closeModal() {
    this.isToggleModal = false;
    this.setState({ change: true });
  }

  componentDidMount = () => {
    this.verifyDate();
  }

  closeSide() {
    this.showWorkers = false;
    this.showApointJobAdd = false;
    this.showApointJob = false;
    this.showWorkerAdd = false;
    this.setState({ change: true });
  }

  onAddRaised(item: CalendarItem) {
    if (this.props.typeOfCalendar === CalendarType.Worker) {
      this.showApointJobAdd = true;
      this.selectedDate = item;
    } else {
      this.selectedDate = item;
      this.showWorkerAdd = true;
    }
    this.setState({ change: true });
  }

  constructor(props) {
    super(props);
    this.currentDate = new Date();
    this.jobId = this.props.match.params.id;
    // this.job = jobStore.jobsTemp[this.jobId];
    if (!this.job) {
      this.job = new JobItem();
      this.job.workers = [];
    }
    this.listNameOfDay = this.nameOfDay.split(',');
    this.nameOfMonthList = this.nameOfMonth.split(',');
    this.onChangeMonth(0);
  }

  updateWorkers = (workers: AssignWorker[]) => {
    const merged = this.merge(this.props.workers, workers);
    this.props.onAssign(merged);
    this.verifyDate();
  };

  merge = (workers, _workers) => _workers.reduce((workers, worker) => {

    if (!workers) {
      return [worker];
    }

    if (!worker.id) {
      return [...workers, { ...worker, id: _.uniqueId() }];
    }

    if (workers.some(_worker => _worker.id === worker)) {
      return workers.map((_worker) => {
        if (_worker.id === worker.id) {
          return {
            ..._worker,
            ...worker,
          };
        }

        return _worker;
      });
    }

    return workers;
  }, workers)

  removeWorker = (worker: AssignWorker) => {
    this.job.workers = this.job.workers.filter(_worker =>
      !(_worker.id === worker.id
        && _worker.startDate === worker.startDate
        && _worker.startTime === worker.startTime),
    );
    // jobStore.updateJobItem(this.jobId, this.job);
    this.setState({ change: true });
    this.onChangeMonth(0);
  };

  getWorkersByDate = (date: string | number) => {
    const workers = this.props.workers.filter((worker) => {
      return moment(worker.startDate).isSame(moment(date, 'YYYYMMDD'), 'D');
    });
    return workers;
  };

  onChangeMonth(month: number) {
    this.calendarRows = [];
    let x = new Date();
    if (month !== 0) {
      x = this.currentDate;
    }
    this.currentDate = new Date(x.getFullYear(), x.getMonth() + month, 1);



    for (let i = 0; i < 5; i++) {
      const calendars = new Array<CalendarItem>();
      for (let j = 0; j < this.listNameOfDay.length; j++) {
        const firstDayOfMonth = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth(), 1);
        const diff = ((i * 7) + j + 1) - firstDayOfMonth.getDay();
        const cell = new Date(firstDayOfMonth.setDate(diff));
        const id = cell.getFullYear() + ('0' + (cell.getMonth() + 1)).substr(-2)
          + ('0' + (cell.getDate())).substr(-2);
        calendars.push({
          id,
          date: cell.getDate(),
          workers: this.getWorkersByDate(id),
        } as CalendarItem);
      }
      this.calendarRows.push(calendars);
    }

    this.verifyDate();
  }

  verifyDate = () => {
    this.calendarRows = this.calendarRows.map(week =>
      week.map((day) => {
        const workers = this.getWorkersByDate(day.id);
        day.workers = [...workers];
        return day;
      },
      ));

    this.forceUpdate();
  }

  getJobsByDate = (date) => {
    const jobs: FiltredJob[] = this.props.jobs.reduce((jobs, job) => {
      const workers = job.workers.filter((worker) => {
        const isMe = worker.workerId === this.props.workerId;
        if (!isMe) return false;

        if (!worker.endDate) {
          return moment(worker.startDate).isSame(moment(date, 'YYYYMMDD'), 'D');
        }

        return moment(worker.startDate).isAfter(moment(date, 'YYYYMMDD'), 'D')
          && moment(worker.endDate).isBefore(moment(date, 'YYYYMMDD'), 'D');
      });

      if (Array.isArray(workers) && workers.length) {
        return [...jobs, { job, workers }];
      }

      return jobs;
    }, []);

    return jobs;
  }

  renderCellInfo(date, item?: any) {
    const jobs = this.getJobsByDate(date)
    if (!Array.isArray(jobs) || !jobs.length) return null;

    if (jobs.length === 1) {
      const job: FiltredJob = jobs[0];
      const worker = job.workers[0];
      return (<div className="btn-calendar-worker-wrapper" onClick={() => this.onAddRaised(item)}>
        <a className="btn cursor-pointer btn-calendar-worker sbtw" onClick={() => { }}>
          <span>{JobType[job.job.jobType]}</span><span> {job.job.uid}</span>
        </a>
        <a className="btn cursor-pointer btn-calendar-worker btn-calendar-worker-red sbtw"
          style={{ marginTop: 10 }}
          onClick={() => { }}>
          <span>{formatDate(worker.startDate, FORMATES.time)}</span>
          {worker.endDate ? <span> - {formatDate(worker.endDate, FORMATES.time)}</span> : null}
        </a>
      </div>);
    }

    if (jobs.length) {
      return (<a className="btn btn-calendar-worker cursor-pointer"
        onClick={() => this.onAddRaised(item)}>
        <span>{jobs.length} Jobs</span>
      </a>);
    }

    return null;
  }

  calendarCellJob() {
    const cells = new Array<any>();
    this.calendarRows.forEach((row, index) => {
      cells.push(
        <div className="calendar-grid-row">
          {
            row.map((item, index) => {
              const date = moment();
              const current = moment(item.id, 'YYYYMMDD');

              const isCurrent = date.isSame(current, 'D') ? 'marked-current' : '';
              const isStart = current.isSame(moment(this.props.job.requestTime), 'D') ? 'marked-start' : '';
              return (<div className={`calendar-grid-cell ${isCurrent} ${isStart}`}>
                <span className="calendar-cell-title">{item.date}</span>
                <div className="calendar-cell-worker">
                  {
                    this.renderCellInfo(item.id, item)
                  }
                </div>
                <div className="calendar-cell-action">
                  <a className={this.action_css} onClick={(e) => {
                    this.onAddRaised(item);
                  }}> <CeIcon.PlusCricleIcon /></a>
                </div>
              </div>
              )
            })
          }
        </div>,
      );

    });

    return cells;
  }

  render() {

    return (
      <div className="ce-assign-worker-screen ce-pd-20">
        <div className="ce-calendar ce-calendar-wrapper">
          <div className="ce-calendar-header-wrapper">
            <div>
              <span>Assign Worker</span>
            </div>
            <div className="ce-calendar-header d-flex align-items-center mb-3">
              <a className="btn btn-today mr-2" href="javascript:;" onClick={() => {
                this.onChangeMonth(0);
                this.setState({ change: true });
              }}>
                Today
              </a>
              <a className="ce-btn mr-3" href="javascript:;" onClick={() => {
                this.onChangeMonth(-1);
                this.setState({ change: true });
              }}><img src={PrevIcon} /></a>

              {
                `${this.nameOfMonthList[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`
              }

              <a className="ce-btn ml-3" href="javascript:;" onClick={() => {
                this.onChangeMonth(1);
                this.setState({ change: true });
              }}><img src={NextIcon} /></a>
            </div>
          </div>
          <div className="ce-calendar-content">
            <div className="calendar-grid-row">
              {
                this.listNameOfDay.map((item, index) => (
                  <div className="calendar-grid-header-cell">
                    <label>{item}</label>
                  </div>
                ))
              }
            </div>
            <div className="calendar-grid">
              {
                this.calendarCellJob()
              }
            </div>
          </div>

          <AddWorkerSlideComponent
            showed={this.showWorkerAdd}
            selectedDate={this.selectedDate}
            updateWorkers={this.updateWorkers}
            removeWorker={this.removeWorker}
            getWorkers={this.getWorkersByDate}
            closeSlide={() => this.closeSide()}
            locations={this.props.job.locations}
            job={this.props.job}
          />

          <ApointJobAddSliderComponent
            jobs={this.props.jobs}
            selectedDate={this.selectedDate}
            updateJobs={this.updateWorkers}
            removeJobs={this.removeWorker}
            getJobsByDate={this.getJobsByDate}
            showed={this.showApointJobAdd}
            closeSlide={() => this.closeSide()}
            workerId={this.props.match.params.id}
          />

          <div className="ce-flex-right">
            <div
              className="btn btn-success assign-work-save cursor-pointer"
              onClick={this.props.onSave}
            >{this.props.buttonTitle}
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default withRouter(WorkerSchedule);
