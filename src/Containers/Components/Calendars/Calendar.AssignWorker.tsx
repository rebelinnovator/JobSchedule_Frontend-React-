import React from 'react';

import './style.scss';

import { CalendarItem } from './CalendarItem';

import PrevIcon from '../../../Images/chevron-right-13.png';
import NextIcon from '../../../Images/chevron-right-12.png';

import { CalendarType } from './CalendarType';

import { AddWorkerSlideComponent } from '../SideMenu/WorkerAdd';
import * as CeIcon from '../../../Utils/Icon';
import { JobItem } from '../../../Models/jobItem';
import jobStore from '../../../Stores/jobStore';
import { AssignWorker } from '../../../Models';

interface Props {
  match: any;
  onAddWorker?: Function;
  onDisplayWorkers?: Function;
  onAddJob?: Function;
  onDisplayJobs?: Function;
  typeOfCalendar?: CalendarType;
}

export class CalendarAssignWorker extends React.Component<Props> {

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

  closeModal() {
    this.isToggleModal = false;
    this.setState({ change: true });
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
    this.job = jobStore.jobsTemp[this.jobId];
    this.listNameOfDay = this.nameOfDay.split(',');
    this.nameOfMonthList = this.nameOfMonth.split(',');
    this.onChangeMonth(0);
  }

  updateWorkers = (workers: Array<AssignWorker>) => {
    const filteredWorkers = this.job.workers.filter((jWorker) => {
      return workers.findIndex(
        _worker =>
          (jWorker.id && jWorker.id === _worker.id &&
            jWorker.startDate === _worker.startDate &&
            jWorker.startTime === _worker.startTime),
      ) === -1;
    });
    this.job.workers = [...filteredWorkers, ...workers];
    jobStore.updateJobItem(this.jobId, this.job);
    this.setState({ change: true });
    this.onChangeMonth(0);
  };

  removeWorker = (worker: AssignWorker) => {
    this.job.workers = this.job.workers.filter(_worker =>
      !(_worker.id === worker.id
        && _worker.startDate === worker.startDate
        && _worker.startTime === worker.startTime),
    );
    jobStore.updateJobItem(this.jobId, this.job);
    this.setState({ change: true });
    this.onChangeMonth(0);
  };

  getWorkersByDate = (date: any) => {
    return this.job.workers.filter(
      (_worker) => {
        const workerDate = new Date(_worker.startDate);
        const workerDateId =
          workerDate.getFullYear()
          + ('0' + (workerDate.getMonth() + 1)).substr(-2)
          + ('0' + (workerDate.getDate())).substr(-2);
        return workerDateId === date;
      },
    );
  };

  onChangeMonth(month: number) {
    this.calendarRows = new Array<Array<CalendarItem>>();
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
          this.currentDate.getMonth() + month, 1);
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
  }

  calendarCellJob() {

    const cells = new Array<any>();
    this.calendarRows.forEach((row, index) => {
      cells.push(
        <div className="calendar-grid-row">
          {
            row.map((item, index) => (
              <div className="calendar-grid-cell">
                <span className="calendar-cell-title">{item.date}</span>
                <div className="calendar-cell-worker">
                  {
                    item.workers.length > 0 &&
                    <a className="btn btn-calendar-worker" onClick={() => {

                    }}> <span>{item.workers.length} Workers</span></a>
                  }
                </div>
                <div className="calendar-cell-action">
                  <a className={this.action_css} onClick={(e) => {
                    this.onAddRaised(item);
                  }}> <CeIcon.PlusCricleIcon/></a>
                </div>
              </div>
            ))
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
              }}><img src={PrevIcon}/></a>

              {
                `${this.nameOfMonthList[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`
              }

              <a className="ce-btn ml-3" href="javascript:;" onClick={() => {
                this.onChangeMonth(1);
                this.setState({ change: true });
              }}><img src={NextIcon}/></a>
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
            locations={this.job.locations}
          />

          <div className="ce-flex-right">
            <a
              className="btn btn-success assign-work-save cursor-pointer"
              href={'/job/create'}>Save</a>
          </div>
        </div>

      </div>
    );
  }
}

export default CalendarAssignWorker;
