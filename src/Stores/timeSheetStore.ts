import { observable, action, computed } from 'mobx';
import { TimeSheetListItem } from '../Models/timeSheetListItem';
import { timesheetAPI } from '../Services/API';
class TimeSheetStore {
  @observable list: Array<TimeSheetListItem>;
  @observable timesheet: TimeSheetListItem;

  constructor() {
    this.addList();
    this.timesheet = new TimeSheetListItem()
  }

  addList() {
    if (this.list == null) {
      this.list = new Array<TimeSheetListItem>();
    }
  }

  @action async getTimesheet(id: string) {
    const response = await timesheetAPI.load(id);
    this.timesheet = {
      ...this.timesheet,
      ...response.data,
    } as TimeSheetListItem;
  }

  @action clearTimesheet() {
    this.timesheet = new TimeSheetListItem;
  }

  @action async updateLocal(name: string, value: any) {
    this.timesheet = {
      ...this.timesheet,
      [name]: value,
    };
  }

  @action async getTimesheetTotalHours(startDate, endDate, timesheetId) {
    const response = await timesheetAPI.getTimesheetTotalHours(startDate, endDate, timesheetId)

    const { total } = response.data;

    this.timesheet.calculatedTotal = total;

    return this.timesheet.calculatedTotal;
  }


  @action async update(id: string, timesheet: any) {
    const response = await timesheetAPI.update(id, timesheet);
    this.timesheet = {
      ...this.timesheet,
      ...response.data,
    } as TimeSheetListItem;
    return response;
  }
}
export default new TimeSheetStore;
