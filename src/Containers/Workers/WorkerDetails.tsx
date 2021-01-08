import React from 'react';

import jobStore from '../../Stores/jobStore';
import userStore from '../../Stores/userStore';
import CalendarComponent from '../Components/Calendars/Calendar.Component';
import { CalendarType } from '../Components/Calendars/CalendarType';
import * as CeIcon from '../../Utils/Icon';
import { observer } from 'mobx-react';
import { workerAPI } from '../../Services/API';
import AppointedJob from './Details/AppointedJob';
import WorkerSchedule from './WorkerSchedule/WorkerSchedule';
import WorkerEditComponent from './WorkerEdit';

enum TabContent {
  TabAppointedJobs = 1,
  TabSchedule,
  TabEdit,
}

@observer
export class WorkerDetailsComponent extends React.Component<any> {
  tab = TabContent.TabAppointedJobs;

  componentDidMount = () => {
    userStore.loadUser(this.props.match.params.id);
  };

  changeTab(tab) {
    this.tab = tab;
    this.setState({ change: true });
  }

  deleteWorker = async () => {
    await workerAPI.delete(this.props.match.params.id);
    this.props.history.push('/workers');
  };

  renderMenu() {
    return (
      <ul className="nav justify-content-between">
        <div className="d-flex">
          <li
            className={`nav-item ${
              this.tab === TabContent.TabAppointedJobs ? 'active' : ''
            }`}
            onClick={() => this.changeTab(TabContent.TabAppointedJobs)}
          >
            <a className="nav-link" href="javascript:;">
              Appointed Jobs
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
              this.tab === TabContent.TabEdit ? 'active' : ''
            }`}
            onClick={() => this.changeTab(TabContent.TabEdit)}
          >
            <a className="nav-link" href="javascript:;">
              Profile
            </a>
          </li>
        </div>
        <div className="d-flex align-items-center">
          <span className="nav-link" onClick={this.deleteWorker}>
            <i className="fa fa-times mr-1"></i>Remove Worker
          </span>
        </div>
      </ul>
    );
  }

  renderContentTabSchedule() {
    return <CalendarComponent typeOfCalendar={CalendarType.Worker} />;
  }

  renderContent(tab) {
    switch (tab) {
      case TabContent.TabAppointedJobs:
        return <AppointedJob />;
      case TabContent.TabSchedule:
        return (
          <WorkerSchedule
            typeOfCalendar={CalendarType.Worker}
            jobs={jobStore.projects}
            workerId={this.props.match.params.id}
          />
        );
      case TabContent.TabEdit:
        return <WorkerEditComponent />;
    }
  }

  public render() {
    return (
      <div className="d-flex App-content worker-details-page">
        <div className="col-left p-4">
          <div className="box-item-body shadow">
            <div className="d-flex align-items-center border-bottom px-3 py-4">
              <img
                alt="avatar"
                src={`${process.env.REACT_APP_API_ENDPOINT}${userStore.user.avatar}`}
                className="avatar mr-3"
              />
              <div>
                <div>{userStore.user.name}</div>
                <div>
                  <span className="badge badge-success badge-circle mr-2">
                    &nbsp;
                  </span>
                  Active
                </div>
              </div>
            </div>
            <div className="p-3">
              <div className="item-contact mb-2">
                <CeIcon.EnvelopeSolidIcon className="ce-mr-10" />
                {userStore.user.email}
              </div>
              <div className="item-contact mb-2">
                <CeIcon.PhonesolidIcon className="ce-mr-10" />
                {userStore.user.phoneNumber}
              </div>
              {userStore.user.subcontractorName ? (
                <div className="item-contact mb-2">
                  <CeIcon.UserSolidIcon className="ce-mr-10" />
                  {userStore.user.subcontractorName}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="col-right border-right">
          {this.renderMenu()}
          <div className="border-menu mb-3"></div>
          {this.renderContent(this.tab)}
        </div>
      </div>
    );
  }
}

export default WorkerDetailsComponent;
