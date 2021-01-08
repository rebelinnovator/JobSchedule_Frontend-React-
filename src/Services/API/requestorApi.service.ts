import BaseAPIService from './base.service';
import { AxiosResponse } from 'axios';

export class RequestorAPI extends BaseAPIService {

  async loadRequestors(params: any): Promise<AxiosResponse<any>> {
    return await this.api.get(
      `/requestors/`,
      params,
      {
        withDetailErrors: true,
      },
    );
  }

}

export default new RequestorAPI();
