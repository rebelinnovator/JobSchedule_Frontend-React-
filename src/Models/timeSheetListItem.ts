import { User, JobListItem } from "./jobListItem";
import { LocationItem } from "./locationItem";

interface TimesheetComment {
  createdAt: Date;
  author: string;
  comment: string;
}

export class TimeSheetListItem {
  id: string;
  requestDate: string;
  worker: User;
  confirmation: string;
  straightHours: number;
  calculatedTotal: number;
  overTimeHours: number;
  holidayHours: number;
  selected: boolean;
  job: JobListItem;
  locations: LocationItem;
  // electric: number;
  // gas: number;
  regHours?: number;
  overtimeHours?: number;
  po?: number;
  startDate?: Date;
  finishDate?: Date;
  totalHours?: number;
  supervisor?: string;
  requestor?: any;
  requestorName?: string;
  departmentName?: string;
  department?: any;
  confirmationNumber?: number;
  conEdisonTruck?: number;
  conEdisonSupervisor?: string;
  conEdisonSupervisorName?: string;
  supervisorName?: string;
  comments: TimesheetComment[];
  paid?: boolean;
  section?: number;
  account?: number;
  workRequest?: number;
  sign?: string;

  constructor() {
    this.worker = new User();
    this.job = new JobListItem();
    this.comments = [];
  }
}
