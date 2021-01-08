import React from 'react';
import workerImage from '../../Images/worker.png';
import { Notification, notifiableTypes, User } from '../../Models';
import { convertDateToString } from '../../Utils/DateHelper';

interface Props {
  notification: Notification;
}

export class NotificationItem extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  renderMessage() {
    const { notification } = this.props;
    const { notifiableGroup } = notification;
    let message = '';
    const group = `${notifiableGroup && notifiableGroup.type}<b> #${notifiableGroup && notifiableGroup.po}</b>`;
    switch (notification.notifiableType) {
      case notifiableTypes.CREATE_JOB:
        message = `created the job ${group}`;
        break;
      case notifiableTypes.CANCELE_JOB:
        message = `canceled the job ${group}`;
        break;
      case notifiableTypes.CREATE_INVOICE:
        message = `created <a href="/invoice">invoice</a> for ${group}`;
        break;
      case notifiableTypes.APPOINTED:
        const fullName = `${(notification.notifiableRecord as User).firstName} ${(notification.notifiableRecord as User).lastName}`
        message = `appointed <b>${fullName}</b> to the ${group}`;
        break;
      case notifiableTypes.AWAITING_APROVAL:
        message = `is waiting to be approved. <a href="#">Go to confirm</a>`
        break;
      default:
        break;
    }
    return message;
  }

  public render() {
    const { notification } = this.props;
    const { user } = notification;
    return (
      <div className="d-flex notification-item">
        <div className="avatar mr-2">
          <img className="w-100" alt="avatar" src={user.avatar}></img>
        </div>
        <div className="w-100 text-left">
          <div className="content">
            <span className="name">{`${user.firstName} ${user.lastName}`}</span>
            {' '}
            <span
              dangerouslySetInnerHTML={{ __html: this.renderMessage() }}
            />
          </div>
          <div className="text-small">
            {convertDateToString(new Date(notification.createdAt))}
          </div>
        </div>
      </div>
    );
  }
}
