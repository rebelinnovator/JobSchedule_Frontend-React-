import { observable, action } from 'mobx';
import { Notification, notifiableTypes } from '../Models/notification';
import { notificationAPI } from '../Services/API';
import { User } from '../Models';
import { APPROVE } from '../Constants/user';

class NotificationStore {
  @observable notifications: Notification[];
  @observable notificationLoader: any;
  @observable hasReadNotification: boolean;
  @observable notification: Notification;

  constructor() {
    this.notificationLoader = {};
    this.notifications = [];
    this.hasReadNotification = true;
  }

  @action setHasReadNotification = (value: boolean) => {
    this.hasReadNotification = value;
  }

  @action getNotifications = async (params: any) => {
    const { data } = await notificationAPI.loadNotifications(params);
    this.notificationLoader = data;
    const { results } = this.notificationLoader;
    this.notifications = results;
  };

  filterNotifications = (notifiableType: number) => {
    if (notifiableTypes.ALL === notifiableType) return this.notifications;
    return this.notifications.filter(e => e.notifiableType === notifiableType);
  }
}
export default new NotificationStore;
