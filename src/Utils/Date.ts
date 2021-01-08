import moment from "moment";
import { DEPARTMENTS } from "../Constants/user";
import { OVERTIME_HOURS, OVERTIME_HOURS_INCREASE } from "../Constants/job";

export const FORMATES = {
  date: 'MM/DD/YY',
  time: 'HH:mm',
  datetime: `MM/DD/YY HH:mm`,
}

export const formatDate = (date, format = FORMATES.date) => {
  if (date) {

    return moment(date).format(format);
  } else {
  
    return 'None';
  }

}

export class TimeSheetHours {
  timesheet;
  constructor(timesheet) {
    this.timesheet = timesheet;
  }

  calculateOffset = (time, _time) => {
    const minutes = (time - Math.floor(time)) * 100;
    const _minutes = (_time - Math.floor(_time)) * 100;

    const sumMinutes = minutes + _minutes;

    const additionalHours = Math.floor(sumMinutes / 60);

    const newMinutes = (sumMinutes % 60) / 100;

    const amount = Math.floor(_time) + additionalHours + newMinutes;
   
    return Math.floor(time) + amount;
  }

  public get totalH(): number {
    const dates = this.rangeDates(new Date(this.timesheet.startDate), new Date(this.timesheet.finishDate));
    let hours = 0;
    const department = DEPARTMENTS.find(department => department.id === this.timesheet.department)
    const otBreak = department && department.otBreak;
    dates.forEach(date => {
      let _hours = this.workerWorkedHours(date);

      if (otBreak && _hours > OVERTIME_HOURS) _hours += (OVERTIME_HOURS_INCREASE / 100);

      hours = this.calculateOffset(hours, _hours)
    });
    return +hours.toFixed(2);
  }

  rangeDates(startDate: Date, endDate: Date) {
    const addFn = (current: Date, interval: number) => {
      return (new Date(current.setDate(current.getDate() + interval)));
    };
    const retVal = [];
    let current = startDate;
    while (current <= endDate) {
      retVal.push(new Date(current));
      current = addFn(current, 1);
    }
    return retVal;
  }

  workerWorkedHours(date: Date): number {
    const jobStartTime = moment(this.timesheet.startDate);
    const jobEndTime = moment(this.timesheet.finishDate);

    let start = moment().hour(jobStartTime.hour()).minute(jobStartTime.minute());
    let end = moment().hour(jobEndTime.hour()).minute(jobEndTime.minute());

    const totalHours = this.timesheet.worker.workingHours.reduce((hours, workingHour) => {
      let startTime = `${workingHour.begin.hour}:${workingHour.begin.minute}`;
      let endTime = `${workingHour.end.hour}:${workingHour.end.minute}`

      if (endTime === '00:00') endTime = '23:59'

      const startWorkingHour = moment(startTime, 'hh:mm')
      const endWorkingHour = moment(endTime, 'hh:mm')

      const startTrack = start.isAfter(startWorkingHour) ? start : startWorkingHour;
      const endTrack = end.isBefore(endWorkingHour) ? end : endWorkingHour;

      if (startTrack.isAfter(endTrack)) return hours;

      // minutes time diff 
      const _minutes = endTrack.diff(startTrack, 'm') % 60;
      // time diff  in hr
      const _hours = endTrack.diff(startTrack, 'h');

      const amount = _hours + (_minutes / 100);

      return this.calculateOffset(hours, amount);
    }, 0);

    return totalHours;
  }

  hoursDiff(startDate: Date, endDate: Date) {
    const diff = this.diff(endDate, startDate, "m");
    const hours = Math.ceil(diff / 60);
    const c = diff % 60;
    const minutes = Math.round((10 * c) / 6) / 100;
    return (hours + minutes);
  }

  diff(end: any, start: any, type: string = "H"): number {
    const diff = (new Date(end).getTime()) - (new Date(start).getTime());
    switch (type) {
      case "s":
        return diff / 1000;
      case "m":
        return diff / 1000 / 60;
      case "H":
        return diff / 1000 / 60;
      case "d":
        return diff / 1000 / 60;
      default:
        return diff;
    }
  }

}

export const renderTime = (time: any) => {
  if (isNaN(time)) {
    return time;
  }

  return time.toFixed(2);
};