import { withFormik } from 'formik';
import { createBrowserHistory } from 'history';
import React from 'react';
import Geocode from 'react-geocode';
import { JobItem } from '../../Models/jobItem';
import { JobListItem, User } from '../../Models/jobListItem';
import { jobAPI } from '../../Services/API';
import jobStore from '../../Stores/jobStore';
import './JobCreate.scss';
import { JobCreateValidation } from './JobCreateValidation';
import JobFormComponent from './JobFormComponent';

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_AIP_KEY);
Geocode.enableDebug();

class JobCreateComponent extends React.Component<any, any> {
  assignForm: boolean = false;
  componentDidMount = () => {

    if (!this.props.values.jobs || !this.props.values.jobs[0]) {
      setTimeout(
        async () => {
          const { id } = this.props.match.params;
          let jobItem = new JobItem();

          const duplicateJob: any = JSON.parse(localStorage.getItem('duplicateJob'))
          let item: JobListItem | null = null;
          if (id) {
            await jobStore.getJob(id);
            item = jobStore.job;
            jobItem.jobType = item.jobType;
            jobItem.section = item.section;
            jobItem.supervisor = new User();
            jobItem.supervisor.id = item.supervisor;
            jobItem.supervisor.name = item.supervisorName;
            jobItem.requestor = new User();
            jobItem.requestor.id = item.requestor;
            jobItem.requestor.name = item.requestorName;
            jobItem.department = {
              id: item.department,
              name: item.departmentName
            }
            jobItem.municipality = item.municipality;
            jobItem.po = item.po;
            jobItem.feeder = item.feeder;
            jobItem.account = item.account;
            jobItem.wr = item.workRequest as number;
            jobItem.requisition = item.requisition;
            jobItem.locations = item.locations;
            jobItem.comment = item.comment;
            jobItem.maxWorkers = item.maxWorkers;
            jobItem.ccUser = new User();
            jobItem.ccUser.id = item.ccUser;
            jobItem.ccUser.name = item.ccUserName;
            // jobItem.workers = item.workers;
          }

          if (duplicateJob) {
            jobItem.workers = duplicateJob.newWorkers;
            jobItem.locations = [duplicateJob.newLocations];
            if (item.locations && Array.isArray(item.locations)) {
              const old = [];
              jobItem.workers.forEach((worker) => {
                old.push({
                  worker: worker.worker.name,
                  job: item.confirmationNumber,
                  old: {
                    address: item.locations[0].address
                  },
                  new: {
                    address: jobItem.locations[0].address
                  }
                });
              });
              this.props.setFieldValue('old', old, false);
            }

          }
          this.props.setFieldValue('jobs', [jobItem], false);
        },
        100);
    }
  }

  addNewJob = () => {
    this.props.setFieldValue('jobs', [...this.props.values.jobs, new JobItem()], false);
  }

  getJobErrors = () => {
    return this.props.errors.jobs || {};
  };

  handleChangeField = (event) => {
    const {
      currentTarget: { value, type, name },
    } = event;
    if (type === 'number') {
      return this.props.setFieldValue(name, Number(value), false);
    }
    return this.props.setFieldValue(name, value, false);
  };

  onJobFormChange = (idx, name, value) => {

    if (name == 'assignForm') {
      this.props.setFieldValue(name, value, false);
      this.assignForm = Boolean(value);
    }
    else {
      this.props.setFieldValue('jobs', this.props.values.jobs.map((job, _idx) => {
        if (idx === _idx) {
          return {
            ...job,
            [name]: value,
          };
        }
        return job;
      }), false);
    }
  }

  onSubmit = (event) => {
    this.props.handleSubmit(event);
  }

  public render() {
    const { values, assignForm } = this.props;

    return (
      <form onSubmit={this.onSubmit} className="container job-create-page mt-4">
        {Array.isArray(values.jobs) ?
          values.jobs.map((job: JobItem, index) => (
            <React.Fragment key={`job-${index}`}>
              <JobFormComponent
                onJobFormChange={this.onJobFormChange}
                index={index}
                job={job}
                errors={this.props.errors} />
            </React.Fragment>
          )) : null}
        {!this.assignForm ?
          <div className="d-flex justify-content-between flex-mobile mt-4 mb-5">
            <button
              className="btn btn-secondary btn-font-bold btn-add-another-job"
              type="button"
              onClick={this.addNewJob}>
              Add Another Job
          </button>

            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-outline-secondary btn-font-bold px-4 mr-2"
                onClick={() => {
                  createBrowserHistory({ forceRefresh: true }).push('/job');
                }}
              >
                Cancel
            </button>
              <button className="btn btn-success btn-add" type="submit">
                Create Jobs
            </button>
            </div>
          </div> : <div className="d-flex justify-content-between flex-mobile mt-4 mb-5"></div>}
      </form>
    );
  }
}

const formatter = (array: any[]) => array.map((item) => {
  if (item.requestor) {
    item.requestor = item.requestor.id;
  }
  if (item.supervisor) {
    item.supervisor = item.supervisor.id;
  }
  if (item.department) {
    item.department = item.department.id;
  }
  return item;
});

export default withFormik({
  mapPropsToValues: (props: any) => {
    return {
    };
  },
  validationSchema: JobCreateValidation,
  handleSubmit: async (values: any, { props }) => {
    for (let i = 0; i < values.jobs.length; i++) {
      if (values.jobs[i].images && values.jobs[i].images.length > 0) {
        const formData = new FormData();
        values.jobs[i].images.forEach((image) => formData.append('images', image));
        values.jobs[i].jobImages = (await jobAPI.uploadImages(formData)).data;
      }
    }
    const jobs = JSON.parse(JSON.stringify(values));
    const data = {
      ...jobs,
      jobs: formatter([...jobs.jobs]),
    };

    jobAPI.create(data as any).then((res) => {
      if (res.status < 300) {
        const _jobs = res.data;
        if (Array.isArray(_jobs)) {
          _jobs.forEach(_job => alert(`Job ${_job.confirmationNumber} has been successfully created`));
        }
        localStorage.removeItem('JobsTemp');
        localStorage.removeItem('duplicateJob');

        (props as any).history.push({
          pathname: '/job',
          state: {
            new: true
          }
        });
      }
    });
  },
})(JobCreateComponent);
