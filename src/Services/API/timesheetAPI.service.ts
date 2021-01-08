import BaseAPIService from './base.service';
import { AxiosResponse } from 'axios';

export class TimesheetAPI extends BaseAPIService {
  async create(timesheet: any): Promise<AxiosResponse<any>> {
    return await this.api.post(
      '/timesheets',
      timesheet,
      {
        withDetailErrors: true,
      },
    );
  }

  async update(id: string | number, timesheet: any): Promise<AxiosResponse<any>> {
    return await this.api.put(
      `/timesheets/${id}`,
      timesheet,
      {
        withDetailErrors: true,
      },
    );
  }

  async getTimesheetTotalHours(startDate, endDate, timesheetId): Promise<AxiosResponse<any>> {
    return await this.api.get(
      `/timesheets/${timesheetId}/calculate-total`,
      {
        startDate, finishDate: endDate
      },
      {
        withDetailErrors: true,
      },
    );
  }

  async list(params: any = {}): Promise<AxiosResponse<any>> {
    return await this.api.get(
      `/timesheets`,
      params,
      {
        withDetailErrors: true,
      },
    );
  }

  async load(id: string): Promise<AxiosResponse<any>> {
    return await this.api.get(
      `/timesheets/${id}`,
      {},
      {
        withDetailErrors: true,
      },
    );
  }

  async downloadPdf(id: string): Promise<AxiosResponse<any>> {
    return await this.api.get(
      `/timesheets/${id}/pdf`,
      {},
      {
        withDetailErrors: true,
        responseType: 'blob'
      },
    );
  }
}

export default new TimesheetAPI();
