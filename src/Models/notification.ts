import { User } from '.';
import { JobListItem } from './jobListItem';

export class Notification {
  id: string;
  user: User;
  notifiableType: number;
  notifiableRecord: User | JobListItem; // User | Job | Invoice......
  notifiableGroup?: NotifiableGroup;
  createdAt: string;
}

class NotifiableGroup {
  id: number;
  type: string;
  po: number;
}

export enum notifiableTypes {
  ALL = 0,
  CREATE_JOB = 1,
  CANCELE_JOB = 2,
  CREATE_INVOICE = 3,
  APPOINTED = 4,
  AWAITING_APROVAL = 5,
}
