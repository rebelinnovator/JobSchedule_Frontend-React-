import BaseAPIService from './base.service';
import { AxiosResponse } from 'axios';
import { User } from '../../Models/APITypes';

export class SubcontractorAPI extends BaseAPIService {
  async create(subcontractor: any): Promise<AxiosResponse<any>> {
    return await this.api.post('/subcontractors', subcontractor, {
      withDetailErrors: true,
    });
  }

  async update(id: string | number, attrs: any): Promise<AxiosResponse<any>> {
    return await this.api.put(`/subcontractors/${id}`, attrs, {
      withDetailErrors: true,
    });
  }

  async loadSubcontractors(params: any = {}): Promise<AxiosResponse<any>> {
    return await this.api.get(`/subcontractors`, params, {
      withDetailErrors: true,
    });
  }

  // async load(id: string): Promise<AxiosResponse<any>> {
  //   return await this.api.get(
  //     `/workers/${id}`,
  //     {},
  //     {
  //       withDetailErrors: true,
  //     },
  //   );
  // }
}

export default new SubcontractorAPI();
