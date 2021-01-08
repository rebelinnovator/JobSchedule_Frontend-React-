import { JobType } from "../Constants/job";
import { LocationItem } from "./locationItem";

export enum PricingType {
  Flat = 'Flat',
  Hourly = 'Hourly',
  Mixed = 'Mixed',
}

export enum PRICING_TYPE {
  FLAT,
  HOURLY,
  MIXED,
}

export enum BILLING_CYCLE {
  Weekly,
  Monthly,
  Daily,
}

export interface IPricing {
  jobType: JobType;
  type: PRICING_TYPE;
  flatRate?: number;
  straightHoursRate?: number;
  otHoursRate?: number;
  holidayHoursRate?: number;
}

export interface IInvoice {
  uid?: number;
  id?: string;
  pricing: IPricing[];
  endDate?:Date;
  emails: string[];
  billingCycle: number;
  onlyCompleted: boolean;
  useActualBreakTimes: boolean;
  ignoreBreaks: boolean;
  forceBreakValue: boolean;
  forceBreakTime: string;
  date: null | Date;
  departments: number[];
  exel_tamplate?: number;
  totalAmount?: number;
  po?: string;
  paid?: string;

  startDateTime?: Date;
  endDateTime?: Date;
  totalInvoiceAmount?: string | number;
  departmentNames?: string[];

  jobType?: number;
  overtime?: number;
  holiday?: number;
  regular?: number;
  total?: number;
}


export class InvoiceItem {
  dateOfService: string;
  department: string;
  section: string;
  total?: number;
  jobId?: string;

  po: number;
  ticketNum: 0;
  requestTime: string;
  conedJobTicket: string;
  location: LocationItem;
  muni: any;
  flaggerName: string;
  flaggerEmploe: number;
  startDateTime: string | Date;
  endDateTime:string | Date;
  breakTaken: boolean;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  holidayHours: number;
  totalAmount: number;
  
  paid?: string;
};