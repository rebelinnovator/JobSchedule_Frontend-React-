import React from 'react';

import './style.scss';

import { WorkerListSideComponent } from '../SideMenu/WorkerList';
import { CalendarItem } from './CalendarItem';
import AddWorkerIcon from '../../../Images/add-worker.png';
import PrevIcon from '../../../Images/chevron-right-13.png';
import NextIcon from '../../../Images/chevron-right-12.png';
import HelpIcon from '../../../Images/help-circle.png';
import CloseIcon from '../../../Images/close-regular.png';
import CEModal from '../Modal/Modal.Component';
import { ApointJobSliderComponent } from '../SideMenu/ApointJob';
import { CalendarType } from './CalendarType';
import { ApointJobAddSliderComponent } from '../SideMenu/ApointJobAdd';
import { AddWorkerSlideComponent } from '../SideMenu/WorkerAdd';
import { AppointJobDetailSliderComponent } from '../SideMenu/AppointJobDetail';
import * as CeIcon from '../../../Utils/Icon';
import CheckboxComponent from '../Controls/Checkbox.Component';

import { JobScheduleModel } from '../../../Models/schedules/jobSchedule';

interface Props {
  onAddWorker?: Function;
  onDisplayWorkers?: Function;
  onAddJob?: Function;
  onDisplayJobs?: Function;
  typeOfCalendar?: CalendarType;

}

export class CalendarComponent extends React.Component<Props> {

  currentDate: Date;
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
  showApointJobDetail: boolean;
  listWorkerOfJob: Array<any>;
  listJobOfWorker: Array<JobScheduleModel>;
  hasAssignWorker: boolean;
  selectedDays: Array<any>;

  constructor(props) {

    super(props);
    this.currentDate = new Date();

    this.listNameOfDay = this.nameOfDay.split(',');
    this.nameOfMonthList = this.nameOfMonth.split(',');
    this.selectedDays = new Array<any>();
    this.hasAssignWorker = false;
    this.onCalendarDaySelected = this.onCalendarDaySelected.bind(this);
    this.calendarRows = new Array<Array<CalendarItem>>();
    this.listJobOfWorker = new Array<JobScheduleModel>();
    this.listWorkerOfJob = new Array<any>();

  }

  componentDidMount() {
    if (this.props.typeOfCalendar === CalendarType.Worker) {
      this.listJobOfWorker.push({
        id: '1',
        typeofjob: 'Parking',
        no: '123456',
        jobdate: new Date(2019, 7, 7),

      } as JobScheduleModel);
      this.listJobOfWorker.push({
        id: '1',
        typeofjob: 'Parking',
        no: '123456',
        jobdate: new Date(2019, 7, 7),

      } as JobScheduleModel);
      this.listJobOfWorker.push({
        id: '1',
        typeofjob: 'Parking',
        no: '123456',
        jobdate: new Date(2019, 7, 6),

      } as JobScheduleModel);
    } else {
      this.listWorkerOfJob.push({
        id: '1',
        typeofjob: 'Parking',
        no: '123456',
        jobdate: new Date(2019, 7, 5),

      } as JobScheduleModel);
      this.listWorkerOfJob.push({
        id: '1',
        typeofjob: 'Parking',
        no: '123456',
        jobdate: new Date(2019, 7, 5),

      } as JobScheduleModel);
      this.listWorkerOfJob.push({
        id: '1',
        typeofjob: 'Parking',
        no: '123456',
        jobdate: new Date(2019, 7, 6),

      } as JobScheduleModel);
    }

    this.onChangeMonth(0);
    this.setState({ change: true });
  }

  showModal() {
    this.isToggleModal = true;
    this.setState({ change: true });
  }

  closeModal() {
    this.isToggleModal = false;
    this.setState({ change: true });
  }

  closeSide() {
    this.showWorkers = false;
    this.showApointJobAdd = false;
    this.showApointJob = false;
    this.showWorkerAdd = false;
    this.showApointJobDetail = false;
    this.setState({ change: true });
  }

  onListWorkers(visible: boolean) {
    this.isToggleModal = false;
    this.showWorkers = visible;
    this.setState({ change: true });
  }

  onAddRaised() {
    if (this.props.typeOfCalendar === CalendarType.Worker) {
      this.showApointJobAdd = true;
    } else {
      this.showWorkerAdd = true;
    }
    this.setState({ change: true });
  }

  onJobDetailRaised() {
    this.showApointJobDetail = true;
    this.setState({ change: true });
  }

  onListJobRaised() {
    this.showApointJob = true;
    this.setState({ change: true });

  }

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
          this.currentDate.getMonth() + month,
          1)
        ;

        let jobs = new Array<any>();
        let workers = new Array<any>();

        const diff = ((i * 7) + j + 1) - firstDayOfMonth.getDay();

        const cell = new Date(firstDayOfMonth.setDate(diff));

        if (this.props.typeOfCalendar === CalendarType.Worker && this.listJobOfWorker) {
          jobs = this.listJobOfWorker.filter(e => e.jobdate.getTime() === cell.getTime());
        }
        if (this.listWorkerOfJob) {
          workers = this.listWorkerOfJob.filter(e => e.jobdate.getTime() === cell.getTime());
        }
        calendars.push({
          jobs,
          workers,
          id: cell.getFullYear() + ('0' + (cell.getMonth() + 1)).substr(-2) + ('0' + (cell.getDate() + 1)).substr(-2),
          date: cell.getDate(),
        } as CalendarItem);
      }
      this.calendarRows.push(calendars);
    }
  }

  /**
   * Handle when select checkbox
   */
  onCalendarDaySelected = (item) => {
    const hasIndex = this.selectedDays.findIndex(e => e.id === item.id);
    if (hasIndex !== -1) {
      item.selected = false;
      this.selectedDays.splice(hasIndex, 1);
      if (this.selectedDays.length === 0) {
        this.hasAssignWorker = false;
      }
    } else {
      item.selected = true;
      this.selectedDays.push(item);
      this.hasAssignWorker = true;
    }
    this.setState({ change: true });
  };

  calendarCellJob() {

    const cells = new Array<any>();
    this.calendarRows.map((row, index) => {
      cells.push(
        <div className="calendar-grid-row" key={index}>
          {
            row.map((item, index) => (
              <div className="calendar-grid-cell" key={index}>
                <div className="calendar-grid-cell-header">
                  <CheckboxComponent checked={item.selected} id={`cell${index}`} onChange={() => {
                    this.onCalendarDaySelected(item);
                  }}/>
                  <span className="calendar-cell-title">{item.date}</span>
                </div>
                <div className="calendar-cell-worker">
                  {
                    item.workers && item.workers.length > 0 &&
                    <a className="btn btn-calendar-worker" onClick={() => {
                      // this.showModal();
                      this.onListWorkers(true);
                    }}> <span>{item.workers.length} Workers</span></a>
                  }
                </div>
                <div className="calendar-cell-action">
                  <a className={this.action_css} onClick={(item) => {
                    this.onAddRaised();
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

  /**
   * Render calendar in worker detail
   */
  calendarCellWorker() {

    const cells = new Array<any>();
    this.calendarRows.map((row, index) => {
      cells.push(
        <div className="calendar-grid-row" key={index}>
          {row.map((item, index) => (
            <div className="calendar-grid-cell" key={index}>
              <div className="calendar-grid-cell-header">
                <CheckboxComponent
                  checked={item.selected}
                  id={`cell${index}`}
                  onChange={() => {
                    this.onCalendarDaySelected(item);
                  }}
                />
                <span className="calendar-cell-title">{item.date}</span>
              </div>
              <div className="calendar-cell-worker">
                {item.jobs.length > 1 ? (
                  <a
                    className="btn btn-calendar-worker"
                    onClick={() => {
                      this.onListJobRaised();
                    }}
                  >
                    {' '}
                    <span>{item.jobs.length} Jobs</span>
                  </a>
                ) : (
                  <div>
                    {item.jobs.length === 1 && (
                      <div>
                        <a
                          className="btn btn-calendar-worker"
                          onClick={() => {
                            this.onJobDetailRaised();
                          }}
                        >
                          {' '}
                          <span>
                            {item.jobs[0].typeofjob} {item.jobs[0].no}
                          </span>
                        </a>

                        <a
                          className="btn btn-calendar-worker-time"
                          onClick={() => {
                          }}
                        >
                          {' '}
                          <span>09:00 - 15:00</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="calendar-cell-action">
                <a
                  className={this.action_css}
                  onClick={item => {
                    this.onAddRaised();
                  }}
                >
                  {' '}
                  <img src={AddWorkerIcon}></img>
                </a>
              </div>
            </div>
          ))}
        </div>
      );

    });

    return cells;
  }

  render() {

    return (
      <div className="ce-calendar">
        <div className="calendar-header-wrapper justify-content-between">
          <div className="ce-calendar-header d-flex align-items-center mb-3">
            <a className="btn btn-today mr-2" href="javascript:;" onClick={() => {
              this.onChangeMonth(0);
              this.setState({ change: true });
            }}>
              <span>Today</span>
            </a>
            <a className="ce-btn mr-3" href="javascript:;" onClick={() => {
              this.onChangeMonth(-1);
              this.setState({ change: true });
            }}><img src={PrevIcon}></img></a>
            <span>
              {
                this.nameOfMonthList[this.currentDate.getMonth()] + ' ' + this.currentDate.getFullYear()
              }
            </span>
            <a className="ce-btn ml-3" href="javascript:;" onClick={() => {
              this.onChangeMonth(1);
              this.setState({ change: true });
            }}><img src={NextIcon}></img></a>
          </div>

          {
            this.hasAssignWorker &&
            <div className="btn ce-btn-info" onClick={() => {
              this.onAddRaised();
            }}>
                <span>Assign Worker</span>
            </div>
          }

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
          <div className="calendar-grid table-responsive">
            {
              this.props.typeOfCalendar === CalendarType.Worker ?
                this.calendarCellWorker() :
                this.calendarCellJob()
            }
          </div>
        </div>
        <CEModal
          show={this.isToggleModal}
          onClose={() => this.closeModal()}
          size="ce-modal-content"
        >
          <div>
            <div className="ce-flex-right">
              <a className="pull-right" onClick={() => {
                this.closeModal();
              }}>
                <img src={CloseIcon}/>
              </a>
            </div>
            <div className="text-center">
              <img src={HelpIcon}></img>
              <div className="m-3">
                <span>
                    Are you sure you want to edit <br/>
                    the data of the past day?
                </span>
              </div>
              <div className="d-flex justify-content-between mx-2 mt-40 mb-25">
                <a className="btn ce-btn-modal-cancel" onClick={() => {
                  this.closeModal();
                }}><span>Cancel</span></a>
                <a className="btn ce-btn-modal-save" onClick={() => {
                  this.onListWorkers(true);
                }}><span>Save</span></a>
              </div>
            </div>
          </div>
        </CEModal>
        <AddWorkerSlideComponent
          showed={this.showWorkerAdd}
          closeSlide={() => this.closeSide()}
        />
        <ApointJobAddSliderComponent
          showed={this.showApointJobAdd}
          closeSlide={() => this.closeSide()}
        />
        <WorkerListSideComponent
          showed={this.showWorkers}
          closeSlide={() => this.closeSide()}
        />
        <ApointJobSliderComponent
          showed={this.showApointJob}
          closeSlide={() => this.closeSide()}
        />
        <AppointJobDetailSliderComponent
          showed={this.showApointJobDetail}
          closeSlide={() => this.closeSide()}
        />
      </div>

    );
  }
}

export default CalendarComponent;
