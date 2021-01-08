import { RestAPI } from './restAPI.service';
import { UserAPI } from './userAPI.service';
import { WorkerAPI } from './workerAPI.service';
import { SubcontractorAPI } from './subcontractorAPI.service';
import { JobAPI } from './jobAPI.service';
import { NotificationAPI } from './notificationAPI.service';
import { AuthAPI } from './authApi.service';
import { TimesheetAPI } from './timesheetAPI.service';
import { InvoiceAPI } from './invoiceAPI.service';
import { RequestorAPI } from './requestorApi.service';

const restAPI = new RestAPI();

export const userAPI = new UserAPI(restAPI);
export const workerAPI = new WorkerAPI(restAPI);
export const subcontractorsAPI = new SubcontractorAPI(restAPI);
export const timesheetAPI = new TimesheetAPI(restAPI);
export const jobAPI = new JobAPI(restAPI);
export const notificationAPI = new NotificationAPI(restAPI);
export const authAPI = new AuthAPI(restAPI);
export const invoiceAPI = new InvoiceAPI(restAPI);
export const requestorAPI = new RequestorAPI(restAPI);
