import { observable, action, toJS } from 'mobx';
import { TimeSheetListItem } from '../Models/timeSheetListItem';
import { SubContractorListItem } from '../Models/subContractorListItem';
import { workerAPI, subcontractorsAPI, timesheetAPI } from '../Services/API';
import { WorkerItem } from '../Models/workerItem';
interface IPagin {
  page: number;
  totalPage: number;
  total: number;
  limit: number;
}

const emptyPagination = { page: 1, totalPage: 0, total: 0, limit: 10 };
class MainStore {
  toJS = toJS;

  @observable workers: Array<WorkerItem>;
  @observable workersLoader: IPagin;
  @observable invoices: Array<TimeSheetListItem>;
  @observable subcontractors: Array<SubContractorListItem>;
  @observable subcontractorsLoader: IPagin;
  @observable timesheetsLoader: IPagin;
  @observable timesheets: Array<TimeSheetListItem>;
  @observable logged: boolean;

  constructor() {
    // this.loadTimeSheets();
    this.loadWorkers();
    // this.addSubcontractors()
    this.loadSubcontractors();
    this.logged = false;
    this.workersLoader = emptyPagination;
    this.subcontractorsLoader = emptyPagination;
    this.timesheets = [];
    this.timesheetsLoader = emptyPagination;
    const storage = localStorage.getItem('Logged');
    if (storage) {
      const a = JSON.parse(storage);
      this.logged = a;
    }
  }
  @action setLogin(isLogged: boolean) {
    this.logged = isLogged;
    localStorage.setItem('Logged', JSON.stringify(this.logged));
  }

  @action loadWorkers = async (params?: any) => {

    const {
      data: { results, page, totalPage, total, limit },
    } = await workerAPI.loadWorkers(params);
    if (!results) {
      this.workers = [];
      return;
    }

    this.workers = results as WorkerItem[];
    this.workersLoader = { page, totalPage, total, limit };
  };

  @action loadSubcontractors = async (params?: any) => {
    const {
      data: { results, page, totalPage, total, limit },
    } = await subcontractorsAPI.loadSubcontractors(params);
    if (!results) {
      this.subcontractors = [];
      return;
    }

    this.subcontractors = results as any[];
    this.subcontractorsLoader = { page, totalPage, total, limit };
  };

  @action loadTimeSheets = async (params?: any) => {
    const {
      data: { results, page, totalPage, total, limit },
    } = await timesheetAPI.list(params);
    if (!results) {
      this.timesheets = [];
      return;
    }
    this.timesheets = results as any[];
    this.timesheetsLoader = { page, totalPage, total, limit };
  }
}
export default new MainStore();
