import { LocationItem } from './locationItem';
import { WorkerItem } from './workerItem';
import { JobType } from '../Constants/job';
import { User } from './jobListItem';
import moment from 'moment';

export class JobLogField {
  fieldName: string;
  newValue: string;
  oldValue: string;
}

export class JobLog {
  updatedBy: any;
  updatedAt: Date;
  fields: JobLogField[];
}

export interface Location {
  lat: number;
  lng: number;
}

export interface RoledUser {
  label: string;
  value: any;
}
export class JobItem {
  jobType: number;
  jobStatus: string;
  changesLog: JobLog[];
  projectId: string;
  requestDate: string;
  requestTime: string;
  workers: any[];
  locations: Array<LocationItem>;
  location?: LocationItem;
  requestor: User;
  supervisor: User;
  department: any;
  section: string;
  feeder: number;
  requisition: number;
  structure: number;
  maxWorkers: number;
  endTime?: string;
  po: number;
  wr: number;
  comment: string;
  projectTitle: string;
  projectPo: number;
  account: string;
  uid?: number;
  municipality?: any;
  ccUser?: User;


  constructor() {
    this.jobType = JobType.Flagging;
    this.jobStatus = '';
    this.locations = new Array<LocationItem>();
    this.workers = new Array<WorkerItem>();

    const date = moment();
    this.requestTime = date.toISOString();
    // this.endTime = date.date(date.date() + 1).toISOString();
  }
}
