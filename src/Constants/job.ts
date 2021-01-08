export enum JOB_STATUSES {
  New,
  InProgress,
  Completed,
  Review,
  Billed,
  Paid,
  Cancelled,
  Update,
  AssignWorker
}

export enum JobType {
  Flagging,
  Parking,
  Signage,
}

export const MUNICIPALITY = [
  { label: 'Bronx', value: 1 },
  { label: 'Brooklyn', value: 2 },
  { label: 'Manhattan', value: 3 },
  { label: 'Queens', value: 4 },
  { label: 'Staten Island', value: 5 },
  { label: 'Westchester', value: 6 },
];

export enum NOTIFIABLE_TYPES {
  CREATE_JOB = 1,
  CANCEL_JOB = 2,
  CREATE_INVOICE = 3,
  APPOINTED = 4,
  AWAITING_APROVAL = 5,
  EDIT_JOB = 6,
  ASSIGN_JOB = 7,
  WORKER_EN_ROUTE = 8,
  WORKER_ON_LOCATION = 9,
  WORKER_SECURED_SITE = 10,
  WORKER_UPLOAD_AN_IMAGE = 11,
  WORKER_ENDED_SHIFT = 12,
  PO_NUMBER_HAS_BEEN_ADDED = 13,
  REMINDER_EMAILS = 14
}

export const OVERTIME_HOURS = 6;
export const OVERTIME_HOURS_INCREASE = 30;