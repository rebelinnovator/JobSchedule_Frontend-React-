import BaseAPIService from './base.service';
import { AxiosResponse } from 'axios';
import { User } from '../../Models/APITypes';

export class AuthAPI extends BaseAPIService {
  async login(payload): Promise<AxiosResponse<any>> {
    return await this.api.post(
      '/user/login/',
      { ...payload, authType: 'admin' },
      {
        withDetailErrors: true,
      },
    );
  }

  async signup(user: User): Promise<AxiosResponse<any>> {
    return await this.api.post(
      '/user/signup/',
      user,
      {
        withDetailErrors: true,
      },
    );
  }

  async passwordForgot(email): Promise<AxiosResponse<any>> {
    return await this.api.post(
      '/user/password-forgot',
      { email },
      {
        withDetailErrors: true,
      },
    );
  }

  async passwordRestore({ token, password }:
    { token: string, password: string }): Promise<AxiosResponse<any>> {
    return await this.api.post(
      `/user/password-restore/${token}`,
      { password },
      {
        withDetailErrors: true,
      },
    );
  }
}

export default new AuthAPI();