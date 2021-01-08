import BaseAPIService from './base.service';
import { AxiosResponse } from 'axios';
import { APPROVE } from '../../Constants/user';
import { User } from '../../Models';

export class UserAPI extends BaseAPIService {
  async create(user, params = {}): Promise<AxiosResponse<any>> {
    return await this.api.post('/user/create', user, params, true);
  }

  async roles(params = {}): Promise<AxiosResponse<any>> {
    return await this.api.get('/roles/', params);
  }

  async users(params: any): Promise<AxiosResponse<any>> {
    return await this.api.get('/user/users', params);
  }

  async user(id: string): Promise<AxiosResponse<any>> {
    return await this.api.get(`/user/${id}`);
  }

  async me(): Promise<AxiosResponse<any>> {
    return await this.api.get(`/user`);
  }

  async update(user: User): Promise<AxiosResponse<any>> {
    console.log('user update: ', user);
    const fd = new FormData();
    for (const [key, value] of Object.entries(user)) {
      console.log(`${key}: ${value}`);
      if (key === 'avatar' && value.size > 0) {
        console.log(typeof value);
        console.log(value.size);
        fd.append(key, value);
      } else {
        fd.append(key, JSON.stringify(value));
      }
    }
    return await this.api.put(`/user`, fd, {});
  }

  async departments(): Promise<AxiosResponse<any>> {
    return await this.api.get('/departments/');
  }

  async approve(id, approve = APPROVE.waiting): Promise<AxiosResponse<any>> {
    return await this.api.post('/user/approve/', {
      id,
      approve,
    });
  }

  async delete(id): Promise<AxiosResponse<any>> {
    return await this.api.delete(`/user/${id}/delete/`, {});
  }

  async createRole(user, params = {}): Promise<AxiosResponse<any>> {
    return await this.api.post('/user/role', user, params, true);
  }

  async importExcel(dataFile): Promise<AxiosResponse<any>> {
    return await this.api.post(`/user/import-excel`, dataFile);
  }
}

export default new UserAPI();
