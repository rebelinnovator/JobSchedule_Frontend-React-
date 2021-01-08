import BaseAPIService from './base.service';
import { AxiosResponse } from 'axios';
import { User } from '../../Models/APITypes';

export class WorkerAPI extends BaseAPIService {
  async create(worker: User): Promise<AxiosResponse<any>> {
    return await this.api.post(
      '/workers/create/',
      worker,
      {
        withDetailErrors: true,
      },
      true,
    );
  }

  async update(id: string | number, worker: any): Promise<AxiosResponse<any>> {
    return await this.api.put(
      `/workers/${id}`,
      worker,
      {
        withDetailErrors: true,
      },
      true,
    );
  }

  async delete(id: string): Promise<AxiosResponse<any>> {
    return await this.api.delete(
      `/workers/${id}`,
      {},
    );
  }

  async loadWorkers(params: any): Promise<AxiosResponse<any>> {
    return await this.api.get(
      `/workers/`,
      params,
      {
        withDetailErrors: true,
      },
    );
  }

  async load(id: string): Promise<AxiosResponse<any>> {
    return await this.api.get(
      `/workers/${id}`,
      {},
      {
        withDetailErrors: true,
      },
    );
  }

  async importExcel(dataFile): Promise<AxiosResponse<any>> {
    return await this.api.post(`/workers/import-excel`, dataFile);
  }
}

export default new WorkerAPI();
