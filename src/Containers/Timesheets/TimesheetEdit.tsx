import { observer } from 'mobx-react';
import React from 'react';
import { EROLES } from '../../Constants/user';
import authStore from '../../Stores/authStore';
import timeSheetStore from '../../Stores/timeSheetStore';
import userStore from '../../Stores/userStore';
import { formatDate, FORMATES, renderTime, TimeSheetHours } from '../../Utils/Date';
import * as CeIcon from '../../Utils/Icon';
import CheckboxComponent from '../Components/Controls/Checkbox.Component';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import { UsersAsyncSearch } from '../Components/Controls/UsersAsyncSearch';
import DateComponent from '../Components/Date/Date.Component';
import SignatureCanvas from 'react-signature-canvas'
import "./TimesheetEdit.scss"
import { timesheetAPI } from '../../Services/API';

@observer
class TimesheetEdit extends React.Component<any> {
  comment = null;
  tempComment = null;
  signCanvas: SignatureCanvas;

  state = {
    timesheet: {},
    signature: false
  };

  componentDidMount = async () => {
    await timeSheetStore.getTimesheet(this.props.match.params.id);
    const { timesheet } = timeSheetStore;
    if (this.signCanvas && timesheet && timesheet.sign) {
      const sign = JSON.parse(timesheet.sign);
      this.signCanvas.fromDataURL(`data:${sign.type};base64,${sign.data}`);
    }
  };

  getTimesheetTotalHours = () => {
    timeSheetStore.getTimesheetTotalHours(
      timeSheetStore.timesheet.startDate,
      timeSheetStore.timesheet.finishDate,
      timeSheetStore.timesheet.id
    );
  };

  handleValueChange = (name, value) => {
    this.setState(
      (state: any) => ({ timesheet: { ...state.timesheet, [name]: value } }),
      () => {
        if (name === 'startDate' || name === 'finishDate') {
          this.getTimesheetTotalHours();
        }
      }
    );
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
    let signature = null;
    if (this.signCanvas && !this.signCanvas.isEmpty()) {
      signature = {
        data: this.signCanvas.toDataURL().replace('data:image/png;base64,', ''),
        type: 'image/jpeg',
        name: 'photo.jpg',
      };
    }

    const response = await timeSheetStore.update(
      this.props.match.params.id,
      { ...this.state.timesheet, ...{ sign: signature ? JSON.stringify(signature) : null } }
    );

    if (response.status < 300) {
      this.props.history.push('/timesheets');
    }
  };

  componentWillUnmount = () => {
    timeSheetStore.clearTimesheet();
  };

  showSignatureCanvas = () => {
    this.setState({
      signature: true
    });
  }

  clearSignature = () => {
    if (this.signCanvas) {
      this.signCanvas.clear();
    }
  }

  downloadPdf = async () => {
    const response = await timesheetAPI.downloadPdf(this.props.match.params.id);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'timesheet.pdf');
    document.body.appendChild(link);
    link.click();
  }


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
              <span className="mr-3 ce-mr-20 download-link" onClick={this.downloadPdf}>
                <CeIcon.DownloadInvoiceIcon className="ce-mr-10" />
                  Download
              </span>
              {authStore.canAccessInvoice() && <span className="mr-3 ">
                <a
                  style={{
                    color: '#3a3c3e'
                  }}
                  href={`/invoices?create=true`}
                >
                  <CeIcon.CreateInvoiceIcon className="ce-mr-10" />
                  Create Invoice
                </a>
              </span>
              }
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
                    timesheet.requestorName
                      ? {
                        label: timesheet.requestorName,
                        value: timesheet.requestor
                      }
                      : null
                  }
                />
              </div>
              <div className="col-sm-4 col-6 form-group">
                <label className="d-block" htmlFor="requestdate">
                  Request Date
                </label>
                <DateComponent
                  showTimeSelect
                  disabled
                  date={timesheet.requestDate ? new Date(timesheet.requestDate) : new Date()}
                />
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
                    timesheet.departmentName
                      ? {
                        label: timesheet.departmentName,
                        value: timesheet.department
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
                  defaultValue={`${timesheet.section}`}
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
                  defaultValue={`${timesheet.account}`}
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
                  defaultValue={`${timesheet.workRequest}`}
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
                  defaultValue={`${timesheet.po}`}
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
                  value={timesheet.locations.address}
                />
              </div>
              <div className="form-group col-sm-4">
                <label className="d-block" htmlFor="structuretosecure">
                  Structure #
                </label>
                <input
                  className="ce-form-control"
                  id="structuretosecure"
                  name="structuretosecure"
                  placeholder="Structure #"
                  value={timesheet.locations.structure}
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
                  disabled
                  defaultValue={timesheet.worker ? timesheet.worker.name : ''}
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
                  defaultValue={`${timesheet.confirmationNumber}`}
                  placeholder="00000000"
                />
              </div>
            </div>
          </div>
          <div className="box-item-body">
            <div className="row">
              <div className="form-group col-sm-12 col-md-4">
                <label className="d-block text-nowrap" htmlFor="startDate">
                  Start Date
                </label>
                <DateComponent
                  showTimeSelect
                  onChange={date => this.handleValueChange('startDate', date)}
                  date={new Date(timesheet.startDate)}
                />
              </div>

              <div className="form-group  col-sm-12 col-md-4">
                <label className="d-block text-nowrap" htmlFor="finishDate">
                  Finish Date
                </label>
                <DateComponent
                  showTimeSelect
                  date={
                    timesheet.finishDate ? new Date(timesheet.finishDate) : null
                  }
                  onChange={date => this.handleValueChange('finishDate', date)}
                />
              </div>

              <div className="form-group  col-sm-12 col-md-4">
                <label className="d-block text-nowrap" htmlFor="totalHours">
                  Total Hours
                </label>
                <input
                  className="ce-form-control input-pick-time"
                  id="totalHours"
                  disabled
                  defaultValue={renderTime(timesheet.totalHours)}
                  value={renderTime(
                    timesheet.calculatedTotal || timesheet.totalHours
                  )}
                  name="totalHours"
                  placeholder="08:00"
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
            {/* <div className="d-flex type-break">
              <CheckboxComponent
                id="Lunch"
                hasTitle="Lunch"
                onChange={checked => this.handleValueChange('lunch', checked)}
                className="mr-3" />
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
            </div> */}
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
                  type={'number'}
                  defaultValue={`${timesheet.conEdisonTruck}`}
                  onChange={this.handleInputChange}
                  placeholder="000"
                />
              </div>
              <div className="form-group col-sm-4">
                <label className="d-block" htmlFor="conEdisonSuperVisor">
                  Con edison supervisor
                </label>

                <UsersAsyncSearch
                  defaultValue={
                    timesheet.conEdisonSupervisor
                      ? {
                        label: timesheet.conEdisonSupervisorName,
                        value: timesheet.conEdisonSupervisor
                      }
                      : null
                  }
                  onSelect={supervisor =>
                    this.handleValueChange('conEdisonSupervisor', supervisor ? supervisor.value.id : null)}
                  searchParams={{
                    roles: [
                      EROLES.ces_field_supervisor,
                      EROLES.coned_field_supervisor,
                      EROLES.department_supervisor,
                      EROLES.dispatcher_supervisor,
                    ],
                  }}
                />
              </div>
            </div>
          </div>

          <div className="box-item-body">
            <div className="row">
              <div className="form-group col-sm-4">
                <CheckboxComponent
                  id="Paid"
                  hasTitle="Paid"
                  checked={timesheet.paid}
                  onChange={checked => this.handleValueChange('paid', checked)}
                  className="mr-3"
                />
              </div>
            </div>
          </div>
          <div className="box-item-body">
            <label className="d-block" htmlFor="sign">
              Signature
                </label>
            {(timesheet.sign || this.state.signature) ?
              <>
                <SignatureCanvas penColor='black'
                  ref={(ref) => { this.signCanvas = ref }}
                  canvasProps={{ height: 150, className: 'sign-canvas col-sm-8' }} />
                <button
                  type="button"
                  className="btn btn-default clear-btn" onClick={this.clearSignature}>
                  Clear
                </button>
              </>
              :
              <div className="no-sign col-sm-8" onClick={this.showSignatureCanvas}>
                No Signature. Please Click Here To Sign
                </div>
            }
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
        {authStore.canAccessInvoice() && <div className="my-4 d-flex justify-content-end">
          <button className="btn btn-success btn-add" type="submit">
            Save
          </button>
        </div>
        }
      </form>
    );
  }
}

export default TimesheetEdit;
