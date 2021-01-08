import React, { Component } from 'react'
import { withFormik } from 'formik';
import * as CeIcon from '../../../Utils/Icon';
import JobsAsyncSearch from '../Controls/JobsAsyncSearch';
import DateComponent from '../Date/Date.Component';
import Select from 'react-select';
import * as _ from 'lodash'
import { CreateApointerJobValudation } from '../../Job/JobCreateValidation';
import userStore from '../../../Stores/userStore';
import jobStore from '../../../Stores/jobStore';

class ApointedJobForm extends Component<any> {
  locationSelect = null;
  getError = (key) => {
    return this.props.errors[key];
  };

  onJobSelect = (item) => {

    this.locationSelect.select.clearValue();

    if (!item) {
      this.props.setFieldValue('job', null, false);
      return null;
    }
    this.props.setFieldValue('job', item.value, false);
  }

  onRemove = () => {

  }

  selectLocation = (item) => {
    if (!item) {
      this.props.setFieldValue('location', null, false);
      return null;
    }
    this.props.setFieldValue('location', item.value, false);
  }

  onSelectDate = (date) => {
    this.props.setFieldValue('startDate', date, false);
  }

  clear = () => {
    this.props.setFieldValue('location', null, false);
    this.props.setFieldValue('job', null, false);
    this.forceUpdate();
  }

  componentWillReceiveProps = (props) => {
    if (props.clear !== this.props.clear) {
      this.clear();
    }
  }

  render() {
    const { errors, values, handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit} className="container job-create-page mt-4">
        <div
          className={'worker-row-item-last'}
        >
          <div className="ce-assign-worker">
            <div className="ce-assign-worker-action cursor-pointer">
              <a
                className=""
                onClick={() => this.props.onDelete()}
              >
                <img className="ce-mr-10 cursor-pointer" src={CeIcon.TrashIconB} alt="" />
                Delete
              </a>
            </div>
            <div className="">
              <span className="ce-title">Job</span>
              <JobsAsyncSearch
                onSelect={this.onJobSelect}
                value={this.props.values.job ?
                  { label: values.job.title, value: this.props.values.job } : null}
              />
              <p>{this.getError('job')}</p>
            </div>

            <div className="ce-assign-worker-record work-time">
              <div className="work-time-start-date">
                <DateComponent
                  date={values.startDate}
                  hasTitle="Start Date"
                  onChange={this.onSelectDate} />
                <p>{this.getError('startDate')}</p>
              </div>
            </div>

            <div className="ce-assign-worker-record work-location-list">
              <div >
                <span className="ce-title">Location</span>
                <div className="work-time-start-time">
                  <Select
                    onChange={this.selectLocation}
                    placeholder="Select Location"
                    // defaultInputValue={values.location}
                    value={values.location ? {
                      value: values.location,
                      label: values.location.address,
                    } : null}
                    options={values.job && Array.isArray(values.job.locations) ?
                      values.job.locations.map(location => ({
                        label: location.address,
                        value: location,
                      })) : []}

                    ref={locationSelect => this.locationSelect = locationSelect}
                  />
                </div>
                <p>{this.getError('location')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <div className="ce-assign-worker-record">
            <button type="submit" className="btn ce-btn-success cursor-pointer">
              <div>Save</div>
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default withFormik({
  mapPropsToValues: (props: any) => {
    return {
      startDate: new Date(),
    };
  },
  validationSchema: CreateApointerJobValudation,
  handleSubmit: (values: any, { props }) => {

    const workers = {
      workers: [...values.job.workers, {
        startDate: values.startDate,
        location: values.location,
        assignerId: userStore.me.id,
        id: `${Date.now()}`,
        workerId: props.workerId,
        status: 0,
      }],
    };

    jobStore.updateProjects(values.job.id, workers)

    jobStore.updateJob(values.job.id, workers);

    if (props.closeSlide) {
      props.closeSlide();
    }

    // jobStore.updateLocalJob(values.job.id, workers);
  },
})(ApointedJobForm);