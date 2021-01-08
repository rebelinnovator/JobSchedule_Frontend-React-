import BaseAPIService from './base.service';
import { AxiosResponse } from 'axios';

export class NotificationAPI extends BaseAPIService {
  async loadNotifications(params: any): Promise<AxiosResponse<any>> {
    return await this.api.get(
      `/notifications/`,
      params,
      {
        withDetailErrors: true,
      },
    );
  }
}

export default new NotificationAPI();
