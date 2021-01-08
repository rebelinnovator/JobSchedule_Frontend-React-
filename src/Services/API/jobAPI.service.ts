import BaseAPIService from './base.service';
import { AxiosResponse } from 'axios';

export class JobAPI extends BaseAPIService {
  async loadTrace(jobId: string): Promise<AxiosResponse<any>> {
    return await this.api.get(
      `/workers/trace?jobId=${jobId}`,
      {},
      {
        withDetailErrors: true,
      },
    );
  }

  async loadJobs(params: any): Promise<AxiosResponse<any>> {
    return await this.api.get(
      `/jobs`,
      params,
      {
        withDetailErrors: true,
      },
    );
  }

  async update(id: string, job: any, params: any = {}): Promise<AxiosResponse<any>> {
    return await this.api.put(
      `/jobs/${id}`,
      job,
      {
        withDetailErrors: true,
      },
    );
  }

  async loadJobsProjects(params: any): Promise<AxiosResponse<any>> {
    return await this.api.get(
      `/jobs/projects`,
      params,
      {
        withDetailErrors: true,
      },
    );
  }

  async updatePOs(po: number, ids: string[]) {
    return await this.api.put('/jobs/pos', {
      ids,
      newPo: po,
    });
  }

  // TODO: add job type
  async create(job: any): Promise<AxiosResponse<any>> {
    return await this.api.post(
      '/jobs',
      job,
      {
        withDetailErrors: true,
      },
    );
  }

  async findJob(id: string, params?: any) {
    return await this.api.get(
      `/jobs/${id}`,
      {...params},
      {
        withDetailErrors: true,
      },
    );
  }

  async municipalitys(): Promise<AxiosResponse<any>> {
    return await this.api.get(
      `/jobs/municipalitys`,
      {
        withDetailErrors: true,
      },
    );
  }

  async uploadImages(images): Promise<AxiosResponse<any>> {
    return await this.api.put(
      `/jobs/upload/job-image`,
      images,
      {
        withDetailErrors: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  }

  async rerouting(data): Promise<AxiosResponse<any>> {
    return await this.api.put(
      `/jobs/re-route/jobs`,
      data,
      {
        withDetailErrors: true,
      },
    );
  }

  async loadJobGroup(params: any): Promise<AxiosResponse<any>> {
    return await this.api.get(
      `/jobs/list/groups`,
      params,
      {
        withDetailErrors: true,
      },
    );
  }

  async updateWorkers(id: string, worker: any): Promise<AxiosResponse> {
    return await this.api.put(
        `/jobs/${id}/workers`,
        worker,
        {
          withDetailErrors: true,
        }
    );
  }
}

export default new JobAPI();
