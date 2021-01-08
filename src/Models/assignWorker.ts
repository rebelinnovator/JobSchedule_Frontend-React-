import { LocationItem } from './locationItem';

export class AssignWorker {
  id: string;
  subcontractor: any;
  subcontractorId: string;
  worker: any;
  workerId: string;
  avaibleWorker: boolean;
  startDate: Date;
  endDate?: Date;
  startTime: string;
  location: LocationItem;
  constructor(props: any = {}) {
    this.location = new LocationItem();
    this.startDate = props.startDate;
  }

}
