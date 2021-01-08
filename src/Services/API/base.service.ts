import { RestAPI } from './restAPI.service';

export default class BaseAPIService {
  api: RestAPI;

  constructor(restAPI = new RestAPI()) {
    this.api = restAPI;
  }
}
