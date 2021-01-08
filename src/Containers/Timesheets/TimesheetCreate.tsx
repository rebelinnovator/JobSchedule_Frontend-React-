import { observer } from 'mobx-react';
import React from 'react';
import { EROLES } from '../../Constants/user';
import timeSheetStore from '../../Stores/timeSheetStore';
import userStore from '../../Stores/userStore';
import { formatDate, FORMATES } from '../../Utils/Date';
import * as CeIcon from '../../Utils/Icon';
import CheckboxComponent from '../Components/Controls/Checkbox.Component';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import { UsersAsyncSearch } from '../Components/Controls/UsersAsyncSearch';
import DateComponent from '../Components/Date/Date.Component';

@observer
class TimesheetCreate extends React.Component<any> {
  comment = null;
  tempComment = null;

  state = {
    timesheet: {}
  };

  componentDidMount = () => {
    timeSheetStore.getTimesheet(this.props.match.params.id);
  };

  handleValueChange = (name, value) => {
    this.setState((state: any) => ({
      timesheet: { ...state.timesheet, [name]: value }
    }));
    timeSheetStore.updateLocal(name, value);
  };

  handleInputChange = event => {
    const { name, value, type } = event.currentTarget;
    if (type === 'number') {
      return this.handleValueChange(name, Number(value));
    }
    return this.handleValueChange(name, value);
  };

  addComment = () => {
    if (!this.comment || !this.comment.value) return;
    this.handleValueChange('comments', [
      ...timeSheetStore.timesheet.comments,
      {
        createdAt: new Date().toISOString(),
        author: userStore.me.name,
        comment: this.comment.value
      }
    ]);
    this.comment.value = '';
  };

  deleteComment = idx => {
    this.handleValueChange(
      'comments',
      timeSheetStore.timesheet.comments.filter(
        (comment, index) => index !== idx
      )
    );
  };

  updateComment = idx => {
    const comment = timeSheetStore.timesheet.comments[idx];

    this.comment.value = comment.comment;
  };

  save = async event => {
    event.preventDefault();

    const response = await timeSheetStore.update(
      this.props.match.params.id,
      this.state.timesheet
    );

    if (response.status < 300) {
      this.props.history.push('/timesheets');
    }
  };

  public render() {
    const { timesheet } = timeSheetStore;
    if (!timesheet.id) return null;
    return (
      <form onSubmit={this.save} className="container timesheet-create-page">
        <div className="page-header">
          <div className="page-title">Timesheet</div>
        </div>
        <div className="box-item">
          <div className="box-item-header d-flex align-items-center justify-content-between">
            <div>
              <img
                alt="avatar"
                className="worker-img  avatar mr-3"
                src={timesheet.worker.avatar}
              />
              <span className="mr-4">{timesheet.worker.name}</span>
              <span>{formatDate(timesheet.job.requestTime)}</span>
            </div>
            <div>
              <span className="mr-3 ce-mr-20">
                <CeIcon.DownloadInvoiceIcon className="ce-mr-10" />
                Download
              </span>
              <span className="mr-3 ">
                <CeIcon.CreateInvoiceIcon className="ce-mr-10" />
                Create Invoice
              </span>
              <span>
                <CeIcon.ChevronUpIcon />
              </span>
            </div>
          </div>
          <div className="box-item-body">
            <div className="row">
              <div className="col-sm-4 col-12 form-group">
                <label className="d-block" htmlFor="requestor">
                  Requestor
                </label>
                <UsersAsyncSearch
                  searchParams={{ roles: [EROLES.requestor] }}
                  disabled
                  defaultValue={
                    timesheet.job
                      ? {
                        label: timesheet.job.requestorName,
                        value: timesheet.job.requestor
                      }
                      : null
                  }
                />
              </div>
              <div className="col-sm-4 col-6 form-group">
                <label className="d-block" htmlFor="requestdate">
                  Request Date
                </label>
                <DateComponent disabled date={timesheet.job.requestTime} />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4 col-12 form-group">
                <label className="d-block" htmlFor="department">
                  Department
                </label>
                <DepartmentAsyncSearch
                  disabled
                  defaultValue={
                    timesheet.job
                      ? {
                        label: timesheet.job.departmentName,
                        value: timesheet.job.department
                      }
                      : null
                  }
                // onSelect={item =>
                //   this.props.setFieldValue('department', item ? item.value.id : null)}
                />
              </div>
              {/* <div className="col-sm-4 col-12 form-group">
                <label className="d-block" htmlFor="electric">
                  Electric
                </label>
                <input
                  className="ce-form-control"
                  name="electric"
                  type="number"
                  onChange={this.handleInputChange}
                  defaultValue={`${timesheet.electric}`}
                  id="electric"
                />
              </div>
              <div className="col-sm-4 col-12 form-group">
                <label className="d-block" htmlFor="gas">
                  Gas
                </label>
                <input
                  defaultValue={`${timesheet.gas}`}
                  className="ce-form-control"
                  name="gas"
                  type="number"
                  onChange={this.handleInputChange}
                  id="gas" />

              </div> */}
            </div>
          </div>
          <div className="box-item-body">
            <div className="row">
              <div className="form-group col-sm-3">
                <label className="d-block" htmlFor="section">
                  Section #
                </label>
                <input
                  className="ce-form-control"
                  id="section"
                  name="section"
                  placeholder="000"
                  disabled
                  defaultValue={timesheet.job.section}
                />
              </div>
              <div className="form-group col-sm-3">
                <label className="d-block" htmlFor="account">
                  Account #
                </label>
                <input
                  className="ce-form-control"
                  id="account"
                  name="account"
                  type="number"
                  disabled
                  placeholder="00000"
                  defaultValue={timesheet.job.account}
                />
              </div>
              <div className="form-group col-sm-3">
                <label className="d-block" htmlFor="workrequest">
                  Work Request #
                </label>
                <input
                  className="ce-form-control"
                  name="workrequest"
                  type="number"
                  id="workrequest"
                  disabled
                  defaultValue={`${timesheet.job.workRequest}`}
                  placeholder="00000"
                />
              </div>
              <div className="form-group col-sm-3">
                <label className="d-block" htmlFor="po">
                  PO #
                </label>
                <input
                  className="ce-form-control"
                  id="po"
                  name="po"
                  type="number"
                  disabled
                  defaultValue={`${timesheet.job.po}`}
                  placeholder="00000000"
                />
              </div>
            </div>
          </div>
          <div className="box-item-body">
            <div className="row">
              <div className="form-group col-sm-4">
                <label className="d-block" htmlFor="locationaddress">
                  Location Address #1
                </label>
                <input
                  className="ce-form-control"
                  id="locationaddress"
                  name="locationaddress"
                  placeholder="BX, Gleason Ave/ Virginia Ave"
                />
              </div>
              <div className="form-group col-sm-4">
                <label className="d-block" htmlFor="structuretosecure">
                  Structure(s) to secure
                </label>
                <input
                  className="ce-form-control"
                  id="structuretosecure"
                  name="structuretosecure"
                  placeholder="Structure(s) to secure"
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-sm-4">
                <label className="d-block" htmlFor="crossstreet">
                  Cross street
                </label>
                <input
                  className="ce-form-control"
                  id="crossstreet"
                  name="crossstreet"
                  placeholder="Cross street"
                />
              </div>
              <div className="form-group col-sm-4">
                <label className="d-block" htmlFor="muniborogh">
                  Muni/ Borough
                </label>
                <input
                  className="ce-form-control"
                  id="muniborogh"
                  name="muniborogh"
                  placeholder="Muni/ Borough"
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-sm-4">
                <label className="d-block" htmlFor="locationaddress2">
                  Location Address #2
                </label>
                <input
                  className="ce-form-control"
                  id="locationaddress2"
                  name="locationaddress2"
                  placeholder="Location Address #2"
                />
              </div>
              <div className="form-group col-sm-4">
                <label className="d-block" htmlFor="muniborogh2">
                  Muni/ Borough
                </label>
                <input
                  className="ce-form-control"
                  id="muniborogh2"
                  name="muniborogh2"
                  placeholder="Muni/ Borough"
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-sm-4">
                <label className="d-block" htmlFor="locationaddress3">
                  Location Address #3
                </label>
                <input
                  className="ce-form-control"
                  id="locationaddress3"
                  name="locationaddress3"
                  placeholder="Location Address #3"
                />
              </div>
              <div className="form-group col-sm-4">
                <label className="d-block" htmlFor="muniborogh3">
                  Muni/ Borough
                </label>
                <input
                  className="ce-form-control"
                  id="muniborogh3"
                  name="muniborogh3"
                  placeholder="Muni/ Borough"
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-sm-4">
                <label className="d-block" htmlFor="locationaddress4">
                  Location Address #4
                </label>
                <input
                  className="ce-form-control"
                  id="locationaddress4"
                  name="locationaddress4"
                  placeholder="Location Address #4"
                />
              </div>
              <div className="form-group col-sm-4">
                <label className="d-block" htmlFor="muniborogh4">
                  Muni/ Borough
                </label>
                <input
                  className="ce-form-control"
                  id="muniborogh4"
                  name="muniborogh4"
                  placeholder="Muni/ Borough"
                />
              </div>
            </div>
          </div>
          <div className="box-item-body">
            <div className="row">
              <div className="form-group col-sm-4">
                <label className="d-block" htmlFor="flaggerspotter">
                  Flagger/ Spotter Name
                </label>
                <input
                  className="ce-form-control"
                  id="flaggerspotter"
                  name="flaggerspotter"
                  placeholder="Enter Name"
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="form-group col-sm-4">
                <label className="d-block" htmlFor="confirmation">
                  Confirmation #
                </label>
                <input
                  className="ce-form-control"
                  id="confirmation"
                  type="number"
                  disabled
                  name="confirmation"
                  defaultValue={`${timesheet.job.confirmationNumber}`}
                  placeholder="00000000"
                />
              </div>
            </div>
          </div>
          <div className="box-item-body">
            <div className="row">
              <div className="form-group col-sm-3 col-md-2">
                <label className="d-block text-nowrap" htmlFor="startDate">
                  Start Date
                </label>
                <DateComponent
                  onChange={date => this.handleValueChange('startDate', date)}
                  date={timesheet.startDate}
                />
              </div>

              <div className="form-group col-sm-3 col-md-2">
                <label className="d-block text-nowrap" htmlFor="finishDate">
                  Finish Date
                </label>
                <DateComponent
                  date={timesheet.finishDate}
                  onChange={date => this.handleValueChange('finishDate', date)}
                />
              </div>

              <div className="form-group col-sm-2">
                <label className="d-block text-nowrap" htmlFor="totalHours">
                  Total Hours
                </label>
                <input
                  className="ce-form-control input-pick-time"
                  id="totalHours"
                  defaultValue={`${timesheet.totalHours}`}
                  name="totalHours"
                  placeholder="08:00"
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
            <div className="d-flex type-break">
              <CheckboxComponent
                id="Lunch"
                hasTitle="Lunch"
                onChange={checked => this.handleValueChange('lunch', checked)}
                className="mr-3"
              />
              <CheckboxComponent
                id="Dinner"
                hasTitle="Dinner"
                onChange={checked => this.handleValueChange('dinner', checked)}
                className="mr-3"
              />
              <CheckboxComponent
                id="NoBreak"
                hasTitle="No Break"
                onChange={checked => this.handleValueChange('nobreak', checked)}
                className="mr-3"
              />
            </div>
          </div>
          <div className="box-item-body">
            <div className="row">
              <div className="form-group col-sm-4">
                <label className="d-block" htmlFor="conEdisonTruck">
                  Con edison truck #
                </label>
                <input
                  className="ce-form-control"
                  id="conEdisonTruck"
                  name="conEdisonTruck"
                  onChange={this.handleInputChange}
                  placeholder="000"
                />
              </div>
              <div className="form-group col-sm-4">
                <label className="d-block" htmlFor="conEdisonSuperVisor">
                  Con edison supervisor
                </label>
                {/* <input
                  className="ce-form-control"
                  id="conEdisonSuperVisor"
                  name="conEdisonSuperVisor"
                  placeholder="Enter Name"
                /> */}
                <UsersAsyncSearch
                  defaultValue={
                    timesheet.job.supervisor
                      ? {
                        label: timesheet.job.supervisorName,
                        value: timesheet.job.supervisor
                      }
                      : null
                  }
                  disabled
                // onSelect={supervisor =>
                //   this.handleValueChange('supervisor', supervisor ? supervisor.value.id : null)}
                // searchParams={{
                //   roles: [
                //     EROLES.ces_field_supervisor,
                //     EROLES.coned_field_supervisor,
                //     EROLES.department_supervisor,
                //     EROLES.dispatcher_supervisor,
                //   ],
                // }}
                />
              </div>
            </div>
          </div>
          <div className="box-item-body">
            {timesheet.comments.map((comment, idx) => {
              return (
                <div>
                  <div className="d-flex justify-content-between">
                    <div className="text-small">
                      {comment.author}{' '}
                      {formatDate(comment.createdAt, FORMATES.datetime)}
                    </div>
                    <div className="actions d-flex align-items-center">
                      <CeIcon.PencilIcon className="cursor-pointer mr-2" />
                      <CeIcon.CloseSolidIcon
                        onClick={() => this.deleteComment(idx)}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="mt-2">{comment.comment}</div>
                </div>
              );
            })}

            <div className="form-group mt-3">
              <div className="position-relative">
                <input
                  className="ce-form-control"
                  ref={comment => (this.comment = comment)}
                  placeholder="Your Comment..."
                />
                <CeIcon.SendButtonIcon
                  className="send-button cursor-pointer"
                  onClick={this.addComment}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="my-4 d-flex justify-content-end">
          <button className="btn btn-success btn-add" type="submit">
            Save
          </button>
        </div>
      </form>
    );
  }
}

export default TimesheetCreate;
