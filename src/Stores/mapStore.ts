import { observable, action, computed, toJS } from 'mobx';
import { JobItem } from '../Models/jobItem';
import worker from '../Images/worker.png';
import { JobType } from '../Constants/job';
import { JobListItem } from '../Models/jobListItem';
import { jobAPI } from '../Services/API';
import { CurrentLocation } from '../Models/geoLocation';


class MapStore {
  @observable.shallow list: Array<JobItem>;
  @observable active: number;
  @observable.shallow selected: JobListItem;
  @observable.shallow trace: any = [];
  @observable.shallow workerLocations: Array<any>;
  @observable.shallow jobLocation: {lat: number, lng: number};
  @observable.shallow currentLocation: CurrentLocation;

  // @action async fetchTrace(id: string) {
  //   try {
  //     // this.clearTraceWorkers();
  //     const response = await jobAPI.loadTrace(id);

  //     let trace = Object.values(response.data);

  //     this.trace = trace;
  //     this.trace.map((traceArray) => {
  //       let alast = traceArray[traceArray.length - 1];
  //       this.workerLocations.forEach(item => {
  //         if(item.workerId === alast.workerId) {
  //           item.trace = alast;
  //         }
  //       });
  //     });
  //   } catch (error) {

  //     this.trace = [];
  //   }
  // }

  @action clearTrace() {
    this.trace = [];
  }

  @action setActive(po: number) {
    this.active = po;
  }

  @action clearActive() {
    this.active = null;
  }
  @action clearTraceWorkers() {
    this.workerLocations = new Array<any>();
  }
  @action traceWorkers(workerLocation: any) {
    this.workerLocations.push(workerLocation);
  }
  @action selectJob(job: JobListItem) {
    if (job) {
      this.jobLocation = {
        lat: Number(job.locations[0].lat),
        lng: Number(job.locations[0].lng)
      };

      this.workerLocations = [...job.workers];

      // console.log('here', toJS(job.workers));
      
      // (async () => {
      //   this.fetchTrace(job.id);
      // })();
  
    } else {
      this.jobLocation = null;
      this.workerLocations = null;
    }

    this.selected = job;

  }

  constructor() {
    this.getProjectsList();
    this.selected = null;
   
  }
  getProjectsList() {
    if (this.list == null) {
      const workers = new Array<any>();
      for (let i = 0; i < 3; i++) {
        workers.push(worker);
      }
      const locations = new Array<any>();
      this.list = new Array<JobItem>();
    }
  }
  setCurrentLocation(location: CurrentLocation) {
    this.currentLocation = location;
    this.jobLocation = {
      lat: this.currentLocation.Latitude,
      lng: this.currentLocation.Longtitude
    };
  }
}
export default new MapStore();
