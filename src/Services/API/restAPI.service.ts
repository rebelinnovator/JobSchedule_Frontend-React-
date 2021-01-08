import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import authStore from '../../Stores/authStore';
import { createBrowserHistory } from 'history';

const baseConfig = {
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  // headers: {
  //   'Content-Type': 'multipart/form-data',
  // },
};

const appendRecursive = (formData, data, wrapper) => {
  for (var x in data) {
    if (typeof data[x] == 'object' || data[x].constructor === Array) {
      appendRecursive(formData, data[x], wrapper + '[' + x + ']');
    } else {
      formData.append(wrapper + '[' + x + ']', data[x]);
    }
  }
};

const isObject = data => data && typeof data === 'object' && data.constructor === Object;

export class RestAPI {
  axios: AxiosInstance;

  constructor(config = {}) {
    const jtoken = localStorage.getItem('Token') || '"without token"';
    const mergedConfig = Object.assign({
      headers: {
        Authorization: `Bearer ${JSON.parse(jtoken)}`,
      },
    }, baseConfig, config);
    this.axios = axios.create(mergedConfig);

    this.catchError = this.catchError.bind(this);
  }

  catchError = (
    error: any,
    {
      withError,
      withDetailErrors,
    }: { withError?: boolean, withDetailErrors?: boolean; } = {}) => {

    if (!error || !error.response) {
      toast.error('Oops! Request data is not success.');
      throw error;
    }
    const { response: { status = null, data: { message = null, errors = [] } = {} } } = error;
    if (withError && message) toast.error(message);

    if (status === 401 || status === 403) {
      authStore.setLogin(false);
      createBrowserHistory({ forceRefresh: true }).push('/login');
    }

    if (withDetailErrors) {
      errors.forEach(({ messages = [] }) => {
        messages.forEach(errorMessage => toast.error(errorMessage));
      });
    }
    throw error;
  };

  setToken = (token: string) => {
    this.axios.defaults.headers.common.Authorization = `Token ${token}`;
  };

  removeToken = () => {
    delete this.axios.defaults.headers.common.Authorization;
  };

  ObjectToFormData = (data = {}, parentKey = '') => {
    if (!isObject(data)) return [];

    const arrayValues = Object.entries(data).reduce((acc, [key, value]) => {
      if (isObject(value)) {
        const child = this.ObjectToFormData(value, key);
        acc = [...acc, ...child];
      } else {
        const accKey = parentKey ? `${parentKey}[${key}]` : key;
        acc = [...acc, [accKey, value]];
      }
      return acc;
    }, []);

    return arrayValues;
  };

  toFormData = data => {
    const formData = new FormData();
    if (!isObject(data)) {
      return formData;
    }

    const formattedArray = this.ObjectToFormData(data);

    formattedArray.forEach(([key, value]) => {
      if (Array.isArray(value)) {
        appendRecursive(formData, value, key);
        return;
      }
      formData.append(key, value);
    });

    return formData;
  };

  transform(data) {
    let formData = new FormData();
    if (typeof data === 'object' && !Array.isArray(data)) {
      formData = Object.entries(data).reduce((formData, [key, value]: [string, string | Blob]) => {
        formData.append(key, value);

        return formData;
      }, formData);
    }
    return formData;
  }


  async get(url: string, params: object = {}, options: any = {}) {
    params['_dc'] = Date.now();
    return await this.execute({
      url,
      params,
      method: 'get',
      ...options,
    });
  }

  async post(url: string, data: any, options: any = {}, isFormData = false) {
    return await this.execute({
      url,
      data: isFormData ? this.toFormData(data) : data,
      method: 'post',
      ...options,
    });
  }

  async put(url: string, data: any, options: any = {}, isFormData = false) {
    return await this.execute({
      url,
      data: isFormData ? this.toFormData(data) : data,
      method: 'put',
      ...options,
    });
  }

  async delete(url: string, params: any, options: any = {}) {
    return await this.execute({
      url,
      params,
      method: 'delete',
      ...options,
    });
  }

  async patch(url: string, data: any, options: any = {}) {
    return await this.execute({
      url,
      data,
      method: 'patch',
      ...options,
    });
  }

  async execute({
    method,
    url,
    __skipProviderToken = false,
    withError = true,
    withDetailErrors = false,
    ...rest
  }): Promise<AxiosResponse<any>> {
    const token = localStorage.getItem('token');
    if (!__skipProviderToken && token) {
      this.setToken(token);
    }
    else {
      this.removeToken();
    }
    try {
      return await this.axios({
        method,
        url,
        ...rest,
      });
    } catch (error) {
      this.catchError(error, { withError, withDetailErrors });
    }
  }
}

export default new RestAPI();
