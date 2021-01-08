import React from 'react';
import { NotificationItem } from './NotificationItem';
import './notification.scss';
import actionRight from '../../Images/action-right.png';
import { observer } from 'mobx-react';
import { notifiableTypes } from '../../Models/notification';
import notificationStore from '../../Stores/notificationStore';

@observer
export class Notifications extends React.Component {
  showFilter: boolean = false;
  filterMenu = notifiableTypes.ALL;

  constructor(props) {
    super(props)
    this.toogleShowFilter = this.toogleShowFilter.bind(this);
  }

  componentDidMount() {
    notificationStore.getNotifications({});
  }


  toogleShowFilter = () => {
    this.showFilter = !this.showFilter;
    this.setState({ change: true });
  }

  filterAction = (filterMenu) => {
    this.filterMenu = filterMenu;
    this.setState({ change: true });
  }

  public render() {
    return (
      <div className="container notification-page py-4">
        <div className="row">
          <div className="col-sm-4 ">
            <div className="filter-notification box-item-body d-none d-sm-block">
              <ul>
                <li
                  className={this.filterMenu == notifiableTypes.ALL ? 'active' : ''}
                  onClick={() => this.filterAction(notifiableTypes.ALL)}
                >
                  All Notifications
                </li>
                <li
                  className={this.filterMenu == notifiableTypes.CANCELE_JOB ? 'active' : ''}
                  onClick={() => this.filterAction(notifiableTypes.CANCELE_JOB)}
                >
                  Canceling Jobs
                </li>
                <li
                  className={this.filterMenu == notifiableTypes.CREATE_JOB ? 'active' : ''}
                  onClick={() => this.filterAction(notifiableTypes.CREATE_JOB)}
                >
                  Creating Jobs
                </li>
                <li
                  className={this.filterMenu == notifiableTypes.CREATE_INVOICE ? 'active' : ''}
                  onClick={() => this.filterAction(notifiableTypes.CREATE_INVOICE)}
                >
                  Creating Invoices
                </li>
              </ul>
            </div>
          </div>
          <div className="col-sm-8">
            <div className="box-item p-0">
              <div className="box-item-header d-flex justify-content-between align-items-center px-4">
                Notifications
                <span className="d-block d-sm-none" onClick={() => this.toogleShowFilter()} ><img src={actionRight} alt=""/></span>
                {
                  this.showFilter && (
                    <div className="notification-option">
                      <ul className="notification-option__list">
                        <li
                          className="notification-option__items"
                          onClick={() => this.filterAction(notifiableTypes.ALL)}
                        >
                          All Notifications
                        </li>
                        <li
                          className="notification-option__items"
                          onClick={() => this.filterAction(notifiableTypes.CANCELE_JOB)}
                        >
                          Canceling Jobs
                        </li>
                        <li
                          className="notification-option__items"
                          onClick={() => this.filterAction(notifiableTypes.CREATE_JOB)}
                        >
                          Creating Jobs
                        </li>
                        <li
                          className="notification-option__items"
                          onClick={() => this.filterAction(notifiableTypes.CREATE_INVOICE)}
                        >
                          Creating Invoices
                        </li>
                      </ul>
                    </div>
                  )
                }
              </div>
              <div className="box-content-notification">
                {
                  notificationStore.filterNotifications(this.filterMenu).map((notification, index) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
