import React from 'react';
import { NotificationItem } from './NotificationItem';
import notificationStore from '../../Stores/notificationStore';

export class NotificationInMenu extends React.Component<any> {
  componentDidMount() {
    document.body.addEventListener('click', this.props.handleOuteSiteClick);
  }
  componentWillUnmount() {
    document.body.removeEventListener('click', this.props.handleOuteSiteClick)
  }
  public render() {
    return (
      <div className="notification-page notification-toggle" data-popup>
        <div className="box-item p-0" data-popup>
          <div className="box-item-header text-left px-4" data-popup>
            Notifications
          </div>
          <div className="box-content-notification" data-popup>
            {
              notificationStore.notifications.map((notification, index) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            }
          </div>
          <div className="show-all" data-popup>
            <a href="/notifications">Show All</a>
          </div>
        </div>
      </div>
    );
  }
}
