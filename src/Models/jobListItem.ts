import { TimeSheetItem } from './timeSheet';

export class JobLocation {
  address: string;
  lng: number;
  lat: number;
  structure: number;
}

export class JobWorker {
  workerId: string;
  worker: User;
  subcontractor?: User;
  assignerName: string;
  subcontractorId?: string;
  images?: string[];
  locations: JobLocation[];
  location: JobLocation;
  startDate: Date;
  endDate?: Date;
  trace?: JobLocation[];
  timesheets?: TimeSheetItem[];
  status?: number;
}

export class JobLogField {
  fieldName: string;
  newValue: string;
  oldValue: string;
}

export class JobLog {
  updatedBy: string;
  updaterName: string;
  source: string;
  updatedAt: Date;
  fields: JobLogField[];
}

export class JobMunicipality {
  label: string;
  value: string;
}

export class JobTimeSheet {
  name: string;
  duration: number;
}

export class JobListItem {
  title: string;
  totalPo: number;
  jobs: JobListItem[];
  comment?: string;
  changesLog: JobLog[];
  departments?: any[];
  department?: string;
  endTime?: Date;
  creatorId: string;
  departmentName: string;
  feeder: number;
  requisition: number;
  structure: number;
  id?: string;
  _id?: string;
  jobStatus: number;
  jobType: number;
  location: JobLocation;
  locations: JobLocation[];
  po: number;
  maxWorkers: number;
  requestTime: Date;
  requestorName: string;
  requestorObj?: any;
  requestor: string;
  section: string;
  supervisor: string;
  supervisorName: string;
  supervisorObj?: any;
  uid: number;
  wr: number;
  workers?: JobWorker[];
  account: string;
  municipality: JobMunicipality;
  timesheets?: TimeSheetItem[];
  confirmationNumber?: number;
  workRequest?: number | string;
  trace?: JobLocation[];
  totalHours?: number;
  overtimeHours?: number;
  holidayHours?: number;
  regularHours?: number;
  images?: string[];
  jobImages?: string[];
  hasSeen?: boolean;
  ccUserName:string;
  ccUser:string;
  // totalHours:? number;
  constructor() {
    this.locations = [];
  }
}
export class User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  desciption: string;
  roles: number[];
  phoneNumber?: string;
}

export class ProjectItem {
  title: string;
  totalPo: string;
  jobs: JobListItem[];
}

export class Notification {
  featureImage: string;
  fullName: string;
  date: string;
  action: string;
  type: string;
  poNumber: string;
}
