import { observable, decorate, action } from 'mobx';

export class SearchItem {
  title: string;
  all: boolean;
  parking: boolean;
  flagging: boolean;
  signage: boolean;

  //#region  Status
  statusAll: boolean;
  statusInprogess: boolean;
  statusNew: boolean;
  statusCompleted: boolean;
  statusBilled: boolean;
  statusPaid: boolean;

  //#endregion

  //#region  Job State
  schedule: boolean;
  canceled: boolean;
  lateWorkder: boolean;
  unassigned: boolean;
  requestStartDate: Date;
  requestEndDate: Date;

  address: string;
  searchRadius: string;
  department: string;
  requestor: string;
  worker: string;
  bronx: boolean;
  brooklyn: boolean;
  manhattan: boolean;
  queens: boolean;
  staten: boolean;
  other: boolean;
  structNumber: string;
  purchaseOrderNumber: string;
  workerRequestNumber: string;

  //#endregion

  onJobtypeChanged(typeName: string) {
    if (typeName == 'All') {
      this.all = !this.all;
      this.parking = this.all;
      this.flagging = this.all;
      this.signage = this.all;
    } else if (typeName == 'Parking') {
      this.parking = !this.parking;
    } else if (typeName == 'Flagging') {
      this.flagging = !this.flagging;
    } else {
      this.signage = !this.signage;
    }
    this.setAllJob();
  }
  private setAllJob() {
    if (this.parking && this.flagging && this.signage) {
      this.all = true;
    } else {
      this.all = false;
    }
  }

  onStartDateChanged(date: Date) {
    this.requestStartDate = date;
  }

  onEndDateChanged(date: Date) {
    this.requestEndDate = date;
  }

  onStatusChanged(typeName: string) {
    if (typeName == 'All') {
      this.statusAll = !this.statusAll;
      this.statusInprogess = this.statusAll;
      this.statusNew = this.statusAll;
      this.statusCompleted = this.statusAll;
      this.statusBilled = this.statusAll;
      this.statusPaid = this.statusAll;
    } else if (typeName == 'InProgress') {
      this.statusInprogess = !this.statusInprogess;
    } else if (typeName == 'New') {
      this.statusNew = !this.statusNew;
    } else if (typeName == 'Completed') {
      this.statusCompleted = !this.statusCompleted;
    } else if (typeName == 'Billed') {
      this.statusBilled = !this.statusBilled;
    } else if (typeName == 'Paid') {
      this.statusPaid = !this.statusPaid;
    }

    this.setAllStatus();
  }
  
  private setAllStatus() {
    if (
      this.statusInprogess &&
      this.statusNew &&
      this.statusCompleted &&
      this.statusBilled &&
      this.statusPaid
    ) {
      this.statusAll = true;
    } else {
      this.statusAll = false;
    }
  }
}
decorate(SearchItem, {
  all: observable,
  requestStartDate: observable,
  requestEndDate: observable,
  onEndDateChanged: action,
  onStartDateChanged: action
});
