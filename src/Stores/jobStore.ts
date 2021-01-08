import * as _ from 'lodash';
import { action, observable } from 'mobx';
import { JobItem } from '../Models/jobItem';
import { JobListItem, Notification, ProjectItem } from '../Models/jobListItem';
import { JobMenuItem } from '../Models/jobMenuItem';
import { jobAPI } from '../Services/API';
import { JOB_STATUSES } from '../Constants/job';
import { toast } from 'react-toastify';

const emptyPagination = { page: 1, totalPage: 0, total: 0, limit: 10 };

class JobStore {
  @observable jobDetail: JobListItem;
  @observable projects: JobListItem[];
  @observable projectsLoader = emptyPagination;
  @observable jobsLoader = emptyPagination;
  @observable.shallow jobs: JobListItem[];

  @observable job: JobListItem;

  @observable selectedJobs = [];
  menuItem: JobMenuItem;
  notifications: Notification[];

  @observable jobsTemp: JobItem[];
  @observable selected: JobListItem;

  @observable jobGroups: JobListItem[];
  @observable jobGroupsLoader = emptyPagination;

  constructor() {
    const savedTempJobs = localStorage.getItem('JobsTemp');
    this.jobDetail = new JobListItem();
    if (savedTempJobs) {
      this.jobsTemp = JSON.parse(savedTempJobs);
    }
    this.jobsTemp = this.validateJob(this.jobsTemp);
    this.jobs = [];
    this.job = new JobListItem();
    this.getListNotification();

    this.selected = null;
  }

  @action updateLocalJob(key, value) {
    this.job[key] = value;
    // this.job.jobStatus = JOB_STATUSES.Update;
  }

  @action assignWorkersToJob(workers) {
    this.job.workers = workers;
    // this.job.jobStatus = JOB_STATUSES.AssignWorker;
  }

  @action assignWorkersToDetailJob(workers) {
    this.jobDetail.workers = workers;
    // this.jobDetail.jobStatus = JOB_STATUSES.AssignWorker;
  }

  @action async getJob(id: string) {
    let { data } = await jobAPI.findJob(id);
    if (Array.isArray(data.workers)) {
      data.workers = data.workers.map((worker) => ({
        id: _.uniqueId(),
        ...worker,
      }));
    }
    this.job = data as JobListItem;
  }

  @action async updateJob(id: string, job: any) {
    const response = await jobAPI.update(id, job);
    return response;
  }

  @action async updateJobWorkers(id: string, worker: any) {
    return await jobAPI.updateWorkers(id, worker);
  }

  @action toggleJob(id: string) {
    if (this.selectedJobs.includes(id)) {
      this.selectedJobs = this.selectedJobs.filter((job) => job !== id);
      return;
    }
    this.selectedJobs = [...this.selectedJobs, id];
  }

  @action async updatePOsFromModal(po) {
    const response = await jobAPI.updatePOs(po, this.selectedJobs);
    if (response.status < 300) {
      this.projects = this.projects.map((project) => {
        if (this.selectedJobs.includes(project.id)) {
          return {
            ...project,
            po,
          };
        }
        return project;
      });
      this.selectedJobs = [];
    }
  }

  @action toggleJobs(ids: string[]) {
    const first = ids[0];
    if (!first) return;

    if (ids.every((id) => this.selectedJobs.includes(id))) {
      this.selectedJobs = this.selectedJobs.filter((id) => !ids.includes(id));
      return;
    }
    this.selectedJobs = ids.reduce((selected: string[], id: string) => {
      if (!selected.includes(id)) {
        return [...selected, id];
      }
      return selected;
    }, this.selectedJobs);
  }

  validateJob(jobs) {
    if (!Array.isArray(jobs) || !jobs.length) {
      jobs = [new JobItem()];
    }

    return jobs.map((job: JobItem) => {
      if (!Array.isArray(job.workers)) {
        return {
          ...job,
          workers: [],
        };
      }
      return job;
    });
  }

  async fetchJobDetail(id: string, params?: any) {
    let { data }: { data: JobListItem } = await jobAPI.findJob(id, params);
    if (Array.isArray(data.workers)) {
      data.workers = data.workers.map((worker) => ({
        id: _.uniqueId(),
        ...worker,
      }));
    }
    this.jobDetail = data;
    return data;
  }

  async getProjectsList(params: any = {}) {
    if (
      params.jobStatus &&
      params.jobStatus.length === 0 &&
      !params.search
      //  &&
      // params.noStauts === true
    ) {
      params.jobStatus = [0, 1, 4, 5];
    }
    const {
      data: { results, page, totalPage, total, limit },
    } = await jobAPI.loadJobs(params);
    if (!results) {
      this.projects = [];
      return;
    }

    this.projects = results as JobListItem[];
    this.projectsLoader = { page, totalPage, total, limit };
  }

  async getJobsList(params: any = {}) {
    if (
      params.jobStatus.length === 0 &&
      !params.search
      // &&
      // params.noStauts === true
    ) {
      params.jobStatus = [0, 1, 4, 5];
    }
    const {
      data: { results, page, totalPage, total, limit },
    } = await jobAPI.loadJobs(params);
    if (!results) {
      this.jobs = [];
      return;
    }

    this.jobs = results as JobListItem[];
    this.jobsLoader = { page, totalPage, total, limit };
  }

  getListNotification() {
    this.notifications = [] as Notification[];
    this.notifications.push({
      featureImage: '',
      fullName: 'Anna Debran ',
      action: 'is waiting to be approved',
      date: '01/01/2019',
      poNumber: '111111',
      type: 'parking',
    });
    this.notifications.push({
      featureImage: '',
      fullName: 'Anna Debran ',
      action: 'is waiting to be approved',
      date: '01/01/2019',
      poNumber: '111111',
      type: 'parking',
    });
    this.notifications.push({
      featureImage: '',
      fullName: 'Anna Debran ',
      action: 'is waiting to be approved',
      date: '01/01/2019',
      poNumber: '111111',
      type: 'parking',
    });
    this.notifications.push({
      featureImage: '',
      fullName: 'Anna Debran ',
      action: 'is waiting to be approved',
      date: '01/01/2019',
      poNumber: '111111',
      type: 'parking',
    });
    this.notifications.push({
      featureImage: '',
      fullName: 'Anna Debran ',
      action: 'is waiting to be approved',
      date: '01/01/2019',
      poNumber: '111111',
      type: 'parking',
    });
  }

  @action addTempJobItem(job: JobItem) {
    if (!this.jobsTemp) {
      this.jobsTemp = new Array<JobItem>();
    }
    this.jobsTemp = [job];
    localStorage.setItem('JobsTemp', JSON.stringify(this.jobsTemp));
  }

  @action updateJobItem(index: number, job: JobItem) {
    this.jobsTemp[index] = {
      ...this.jobsTemp[index],
      ...job,
    };
    localStorage.setItem('JobsTemp', JSON.stringify(this.jobsTemp));
  }

  @action selectJob(job: JobListItem) {
    this.selected = job;
  }

  @action clearTempJobs() {
    this.jobsTemp = undefined;
    localStorage.removeItem('JobsTemp');
  }

  @action updateProjects(id, fields = {}) {
    this.projects = this.projects.map((project) => {
      if (project.id === id) {
        return {
          ...project,
          ...fields,
        };
      }
      return project;
    });
  }

  async getJobGroupList(params: any = {}) {
    const {
      data: { results, page, totalPage, total, limit },
    } = await jobAPI.loadJobGroup(params);
    if (!results) {
      this.jobGroups = [];
      return;
    }

    this.jobGroups = results as JobListItem[];
    this.jobGroupsLoader = { page, totalPage, total, limit };
  }
}

export default new JobStore();
