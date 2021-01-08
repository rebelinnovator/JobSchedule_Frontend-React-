import { withFormik } from 'formik';
import React, { RefObject } from 'react';
import workerImage from '../../Images/worker.png';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import { ProfileEditValidation } from './Profile.Validation';
import { ISelectItem } from '../Components/Controls/AsyncSelect';
import userStore from '../../Stores/userStore';
import { observer } from 'mobx-react';
import { User } from '../../Models';
import { userAPI } from '../../Services/API';
import CheckboxComponent from '../Components/Controls/DoubleCheckbox.Component';
import Collapsible from 'react-collapsible';
import { FaAngleRight, FaAngleDown } from 'react-icons/fa';
import { toast } from 'react-toastify';

import avatarImg from '../../Assets/avatar.png';
import { ENOTIFICATIONS, EROLES } from '../../Constants/user';

interface MyProps {
  isNotify: boolean;
  change: boolean;
  inputs: any;
}

@observer
export class MyProfileComponent extends React.Component<any, MyProps> {
  showImage = false;
  file: any;
  private readonly inputOpenFileRef: RefObject<HTMLInputElement> = React.createRef();
  notification = [];

  constructor(any) {
    super(any);
    this.state = {
      isNotify: false,
      change: false,
      inputs: {},
    };
    this.props.setFieldValue('notification', this.notification);
  }

  componentDidMount = async () => {
    await userStore.loadMe();
    if (userStore.me.notification && Array.isArray(userStore.me.notification)) {
      this.notification = userStore.me.notification;
      this.props.setFieldValue('notification', this.notification);
    }
  };

  removeImage() {
    this.showImage = false;
    this.file = undefined;
    this.setState({ change: true });
    this.props.setFieldValue('avatar', undefined);
  }

  showOpenFileDlg = () => {
    this.inputOpenFileRef.current.click();
  };

  onChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    const blob = event.target.files[0];
    this.file = URL.createObjectURL(blob);
    this.showImage = true;
    this.inputOpenFileRef.current.value = '';
    this.setState({ change: true });
    this.props.setFieldValue('avatar', blob);
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    // this.setState({
    //   inputs[name]: value,
    // });
  };

  handleChangeField(name) {
    return (event) => {
      const {
        currentTarget: { value },
      } = event;
      return this.props.setFieldValue(name, value);
    };
  }

  onDepartmentSelect = (department) => {
    if (!department) {
      this.props.setFieldValue('departments', null);
      return;
    }

    this.props.setFieldValue('departments', department);
  };

  onEnableNotification = (status: boolean) => {
    this.props.setFieldValue('enableNotification', status);
  };

  onChangeNotification = () => {
    console.log(this.notification)
    this.props.setFieldValue('notification', this.notification);
    this.setState({});
  };

  render() {
    const { errors, handleSubmit } = this.props;

    console.log('xx: ', userStore.me.avatar);

    return (
      <form autoComplete={'off'} className="container" onSubmit={handleSubmit}>
        <div className="form-login form-sign-up m-auto">
          <div className="form-login-header border-0">Profile Information</div>
          {userStore.me.id ? (
            <div className="form-login-body">
              <div>
                {/* <img src={userStore.me.avatar} /> */}
                <input
                  type="file"
                  className="feature-image mr-3"
                  id="file"
                  ref={this.inputOpenFileRef}
                  style={{ display: 'none' }}
                  onChange={this.onChangeFile.bind(this)}
                />
                {this.showImage ? (
                  <div
                    className="view-feature-image"
                    style={{ backgroundImage: `url(${this.file})` }}
                    onClick={() => this.showOpenFileDlg()}
                  >
                    <div
                      className="remove-feature-image d-flex"
                      onClick={() => this.removeImage()}
                    >
                      <i className="fa fa-times m-auto"></i>
                    </div>
                  </div>
                ) : (
                    <div
                      className="feature-image d-flex"
                      style={{
                        backgroundImage: `url("${userStore.me.avatar !== 'null'
                          ? process.env.REACT_APP_API_MEDIA
                          : ''
                          }${userStore.me.avatar !== 'null'
                            ? userStore.me.avatar
                            : avatarImg
                          }")`,
                      }}
                      onClick={() => this.showOpenFileDlg()}
                    ></div>
                  )}
              </div>
              <div className="form-group">
                <label className="d-block">Name</label>
                <input
                  className="ce-form-control"
                  defaultValue={userStore.me.name}
                  name="name"
                  placeholder="name"
                  onChange={this.handleChangeField('name')}
                />
                <p className="error">{errors.name}</p>
              </div>
              <div className="form-group">
                <label className="d-block">Email</label>
                <input
                  className="ce-form-control"
                  name="email"
                  placeholder="email"
                  defaultValue={userStore.me.email}
                  onChange={this.handleChangeField('email')}
                  autoComplete={'false'}
                />
                <p className="error">{errors.email}</p>
              </div>
              <div className="form-group">
                <label className="d-block">PhoneNumber</label>
                <input
                  className="ce-form-control"
                  name="phoneNumber"
                  defaultValue={userStore.me.phoneNumber}
                  placeholder="+X (XXX) XXX XXXX"
                  onChange={this.handleChangeField('phoneNumber')}
                />
                <p className="error">{errors.phoneNumber}</p>
              </div>
              <div className="form-group">
                <label className="d-block">Department(s)</label>
                <DepartmentAsyncSearch
                  isMulti
                  defaultInputValue={
                    Array.isArray(userStore.me.departments)
                      ? userStore.me.departments
                        .map((department) => department.name)
                        .join(', ')
                      : undefined
                  }
                  onSelect={(department: ISelectItem) =>
                    this.onDepartmentSelect(department)
                  }
                />
                <p className="error">{errors.department}</p>
              </div>
              {/* <div className="form-group" >
                <label className="d-block">Enable Notification</label>
                <CheckboxComponent
                  id="Enable Notification"
                  hasTitle=""
                  checked={userStore.me.enableNotification}
                  onChange={this.onEnableNotification}
                />
              </div> */}
            </div>
          ) : null}

          <div className="form-login-header border-0">Password</div>
          <div className="form-login-body">
            <div className="form-group">
              <label className="d-block">Password</label>
              <input
                className="ce-form-control"
                type="password"
                autoComplete={'off'}
                name="password"
                onChange={this.handleChangeField('password')}
              />
              <p className="error">{errors.password}</p>
            </div>
            <div className="form-group">
              <label className="d-block">New Password</label>
              <input
                className="ce-form-control"
                type="password"
                autoComplete={'off'}
                name="repeatPassword"
                onChange={this.handleChangeField('repeatPassword')}
              />
              <p className="error">{errors.repeatPassword}</p>
            </div>
          </div>
          <Collapsible
            open={false}
            onOpen={() => {
              this.setState({ isNotify: true });
            }}
            onClose={() => {
              this.setState({ isNotify: false });
            }}
            className="notify-settings"
            trigger={
              <h3 className="title">
                {this.state.isNotify ? <FaAngleDown /> : <FaAngleRight />}
                Notification Settings
              </h3>
            }
          >

            <div className="notify-item">
              <h4 className="d-flex flex-row justify-content-end">
                <span className="flex-fill">Jobs</span>
                <span className="mr-4">Email</span>
                <span >Web/Push</span>
              </h4>


              <div className="form-group">
                <CheckboxComponent
                  id="job_created"
                  hasTitle="Job Created"
                  name="job_created"
                  checked={this.notification ? [this.notification.includes(ENOTIFICATIONS.job_created_email), this.notification.includes(ENOTIFICATIONS.job_created_webpush)] : [false, false]
                  }
                  onChange={(checked) => {
                    if (!checked[0]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.job_created_email);
                    } else if (!this.notification.includes(ENOTIFICATIONS.job_created_email)) {
                      this.notification.push(ENOTIFICATIONS.job_created_email);
                    }
                    if (!checked[1]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.job_created_webpush);
                    } else if (!this.notification.includes(ENOTIFICATIONS.job_created_webpush)) {
                      this.notification.push(ENOTIFICATIONS.job_created_webpush);
                    }
                    this.onChangeNotification()
                  }}
                />
              </div>
              <div className="form-group">
                <CheckboxComponent
                  id="Job First Assigned to Worker"
                  hasTitle="Job First Assigned to Worker"
                  name="job_first_assigned_worker"
                  checked={this.notification ? [this.notification.includes(ENOTIFICATIONS.job_first_assigned_worker_email), this.notification.includes(ENOTIFICATIONS.job_first_assigned_worker_webpush)] : [false, false]}
                  onChange={(checked) => {
                    if (!checked[0]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.job_first_assigned_worker_email);
                    } else if (!this.notification.includes(ENOTIFICATIONS.job_first_assigned_worker_email)) {
                      this.notification.push(ENOTIFICATIONS.job_first_assigned_worker_email);
                    }
                    if (!checked[1]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.job_first_assigned_worker_webpush);
                    } else if (!this.notification.includes(ENOTIFICATIONS.job_first_assigned_worker_webpush)) {
                      this.notification.push(ENOTIFICATIONS.job_first_assigned_worker_webpush);
                    }
                    this.onChangeNotification()
                  }}
                />
              </div>
              <div className="form-group">
                <CheckboxComponent
                  id="Job has been modified"
                  hasTitle="Job has been modified"
                  name="job_has_been_modified"
                  checked={this.notification ? [this.notification.includes(ENOTIFICATIONS.job_has_been_modified_email), this.notification.includes(ENOTIFICATIONS.job_has_been_modified_webpush)] : [false, false]}
                  onChange={(checked) => {
                    if (!checked[0]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.job_has_been_modified_email);
                    } else if (!this.notification.includes(ENOTIFICATIONS.job_has_been_modified_email)) {
                      this.notification.push(ENOTIFICATIONS.job_has_been_modified_email);
                    }
                    if (!checked[1]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.job_has_been_modified_webpush);
                    } else if (!this.notification.includes(ENOTIFICATIONS.job_has_been_modified_webpush)) {
                      this.notification.push(ENOTIFICATIONS.job_has_been_modified_webpush);
                    }
                    this.onChangeNotification()
                  }}
                />
              </div>
              <div className="form-group">
                <CheckboxComponent
                  id="PO Number has been added"
                  hasTitle="PO Number has been added"
                  name="job_PO"
                  checked={this.notification ? [this.notification.includes(ENOTIFICATIONS.job_PO_email), this.notification.includes(ENOTIFICATIONS.job_PO_webpush)] : [false, false]}
                  onChange={(checked) => {
                    if (!checked[0]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.job_PO_email);
                    } else if (!this.notification.includes(ENOTIFICATIONS.job_PO_email)) {
                      this.notification.push(ENOTIFICATIONS.job_PO_email);
                    }
                    if (!checked[1]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.job_PO_webpush);
                    } else if (!this.notification.includes(ENOTIFICATIONS.job_PO_webpush)) {
                      this.notification.push(ENOTIFICATIONS.job_PO_webpush);
                    }
                    this.onChangeNotification()
                  }}
                />
              </div>
              <div className="form-group">
                <CheckboxComponent
                  id="New Job Re-Route"
                  hasTitle="New Job Re-Route"
                  name="new_job_reroute"
                  checked={this.notification ? [this.notification.includes(ENOTIFICATIONS.new_job_reroute_email), this.notification.includes(ENOTIFICATIONS.new_job_reroute_webpush)] : [false, false]}
                  onChange={(checked) => {
                    if (!checked[0]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.new_job_reroute_email);
                    } else if (!this.notification.includes(ENOTIFICATIONS.new_job_reroute_email)) {
                      this.notification.push(ENOTIFICATIONS.new_job_reroute_email);
                    }
                    if (!checked[1]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.new_job_reroute_webpush);
                    } else if (!this.notification.includes(ENOTIFICATIONS.new_job_reroute_webpush)) {
                      this.notification.push(ENOTIFICATIONS.new_job_reroute_webpush);
                    }
                    this.onChangeNotification()
                  }}
                />
              </div>
              <div className="form-group">
                <CheckboxComponent
                  id="Current Job Re-Route"
                  hasTitle="Current Job Re-Route"
                  name="current_job_reroute"
                  checked={this.notification ? [this.notification.includes(ENOTIFICATIONS.current_job_reroute_email), this.notification.includes(ENOTIFICATIONS.current_job_reroute_webpush)] : [false, false]}
                  onChange={(checked) => {
                    if (!checked[0]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.current_job_reroute_email);
                    } else if (!this.notification.includes(ENOTIFICATIONS.current_job_reroute_email)) {
                      this.notification.push(ENOTIFICATIONS.current_job_reroute_email);
                    }
                    if (!checked[1]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.current_job_reroute_webpush);
                    } else if (!this.notification.includes(ENOTIFICATIONS.current_job_reroute_webpush)) {
                      this.notification.push(ENOTIFICATIONS.current_job_reroute_webpush);
                    }
                    this.onChangeNotification()
                  }}
                />
              </div>
            </div>
            <div className="notify-item">
              <h4>Worker</h4>
              <div className="form-group">
                <CheckboxComponent
                  id="Worker EnRouter"
                  hasTitle="Worker EnRouter"
                  name="worker_en_router"
                  checked={this.notification ? [this.notification.includes(ENOTIFICATIONS.worker_en_router_email), this.notification.includes(ENOTIFICATIONS.worker_en_router_webpush)] : [false, false]}
                  onChange={(checked) => {
                    if (!checked[0]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.worker_en_router_email);
                    } else if (!this.notification.includes(ENOTIFICATIONS.worker_en_router_email)) {
                      this.notification.push(ENOTIFICATIONS.worker_en_router_email);
                    }
                    if (!checked[1]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.worker_en_router_webpush);
                    } else if (!this.notification.includes(ENOTIFICATIONS.worker_en_router_webpush)) {
                      this.notification.push(ENOTIFICATIONS.worker_en_router_webpush);
                    }
                    this.onChangeNotification()
                  }}
                />
              </div>
              <div className="form-group">
                <CheckboxComponent
                  id="Worker OnLocation"
                  hasTitle="Worker OnLocation"
                  name="worker_on_location"
                  checked={this.notification ? [this.notification.includes(ENOTIFICATIONS.worker_on_location_email), this.notification.includes(ENOTIFICATIONS.worker_on_location_webpush)] : [false, false]}
                  onChange={(checked) => {
                    if (!checked[0]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.worker_on_location_email);
                    } else if (!this.notification.includes(ENOTIFICATIONS.worker_on_location_email)) {
                      this.notification.push(ENOTIFICATIONS.worker_on_location_email);
                    }
                    if (!checked[1]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.worker_on_location_webpush);
                    } else if (!this.notification.includes(ENOTIFICATIONS.worker_on_location_webpush)) {
                      this.notification.push(ENOTIFICATIONS.worker_on_location_webpush);
                    }
                    this.onChangeNotification()
                  }}
                />
              </div>
              <div className="form-group">
                <CheckboxComponent
                  id="Worker Secured Site"
                  hasTitle="Worker Secured Site"
                  name="worker_secured_site"
                  checked={this.notification ? [this.notification.includes(ENOTIFICATIONS.worker_secured_site_email), this.notification.includes(ENOTIFICATIONS.worker_secured_site_webpush)] : [false, false]}
                  onChange={(checked) => {
                    if (!checked[0]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.worker_secured_site_email);
                    } else if (!this.notification.includes(ENOTIFICATIONS.worker_secured_site_email)) {
                      this.notification.push(ENOTIFICATIONS.worker_secured_site_email);
                    }
                    if (!checked[1]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.worker_secured_site_webpush);
                    } else if (!this.notification.includes(ENOTIFICATIONS.worker_secured_site_webpush)) {
                      this.notification.push(ENOTIFICATIONS.worker_secured_site_webpush);
                    }
                    this.onChangeNotification()
                  }}
                />
              </div>
              <div className="form-group">
                <CheckboxComponent
                  id="Worker Cannot Secured Site"
                  hasTitle="Worker Cannot Secured Site"
                  name="worker_cannot_secured_site"
                  checked={this.notification ? [this.notification.includes(ENOTIFICATIONS.worker_cannot_secured_site_email), this.notification.includes(ENOTIFICATIONS.worker_cannot_secured_site_webpush)] : [false, false]}
                  onChange={(checked) => {
                    if (!checked[0]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.worker_cannot_secured_site_email);
                    } else if (!this.notification.includes(ENOTIFICATIONS.worker_cannot_secured_site_email)) {
                      this.notification.push(ENOTIFICATIONS.worker_cannot_secured_site_email);
                    }
                    if (!checked[1]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.worker_cannot_secured_site_webpush);
                    } else if (!this.notification.includes(ENOTIFICATIONS.worker_cannot_secured_site_webpush)) {
                      this.notification.push(ENOTIFICATIONS.worker_cannot_secured_site_webpush);
                    }
                    this.onChangeNotification()
                  }}
                />
              </div>
              <div className="form-group">
                <CheckboxComponent
                  id="Worker Uploaded an Image"
                  hasTitle="Worker Uploaded an Image"
                  name="worker_uploaded_image"
                  checked={this.notification ? [this.notification.includes(ENOTIFICATIONS.worker_uploaded_image_email), this.notification.includes(ENOTIFICATIONS.worker_uploaded_image_webpush)] : [false, false]}
                  onChange={(checked) => {
                    if (!checked[0]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.worker_uploaded_image_email);
                    } else if (!this.notification.includes(ENOTIFICATIONS.worker_uploaded_image_email)) {
                      this.notification.push(ENOTIFICATIONS.worker_uploaded_image_email);
                    }
                    if (!checked[1]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.worker_uploaded_image_webpush);
                    } else if (!this.notification.includes(ENOTIFICATIONS.worker_uploaded_image_webpush)) {
                      this.notification.push(ENOTIFICATIONS.worker_uploaded_image_webpush);
                    }
                    this.onChangeNotification()
                  }}
                />
              </div>
              <div className="form-group">
                <CheckboxComponent
                  id="Worker Ended Shift"
                  hasTitle="Worker Ended Shift"
                  name="worker_ended_shift"
                  checked={this.notification ? [this.notification.includes(ENOTIFICATIONS.worker_ended_shift_email), this.notification.includes(ENOTIFICATIONS.worker_ended_shift_webpush)] : [false, false]}
                  onChange={(checked) => {
                    if (!checked[0]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.worker_ended_shift_email);
                    } else if (!this.notification.includes(ENOTIFICATIONS.worker_ended_shift_email)) {
                      this.notification.push(ENOTIFICATIONS.worker_ended_shift_email);
                    }
                    if (!checked[1]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.worker_ended_shift_webpush);
                    } else if (!this.notification.includes(ENOTIFICATIONS.worker_ended_shift_webpush)) {
                      this.notification.push(ENOTIFICATIONS.worker_ended_shift_webpush);
                    }
                    this.onChangeNotification()
                  }}
                />
              </div>
              <div className="form-group">
                <CheckboxComponent
                  id="Worker Not yet EnRoute 1 hour before scheduled time"
                  hasTitle="Worker Not yet EnRoute 1 hour before scheduled time"
                  name="worker_not_yet_enroute"
                  checked={this.notification ? [this.notification.includes(ENOTIFICATIONS.worker_not_yet_enroute_email), this.notification.includes(ENOTIFICATIONS.worker_not_yet_enroute_webpush)] : [false, false]}
                  onChange={(checked) => {
                    if (!checked[0]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.worker_not_yet_enroute_email);
                    } else if (!this.notification.includes(ENOTIFICATIONS.worker_not_yet_enroute_email)) {
                      this.notification.push(ENOTIFICATIONS.worker_not_yet_enroute_email);
                    }
                    if (!checked[1]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.worker_not_yet_enroute_webpush);
                    } else if (!this.notification.includes(ENOTIFICATIONS.worker_not_yet_enroute_webpush)) {
                      this.notification.push(ENOTIFICATIONS.worker_not_yet_enroute_webpush);
                    }
                    this.onChangeNotification()
                  }}
                />
              </div>
            </div>
            <div className="notify-item">
              <h4>Invoice</h4>
              <div className="form-group">
                <CheckboxComponent
                  id="Invoice is available"
                  hasTitle="Invoice is available"
                  name="invoice_available"
                  checked={this.notification ? [this.notification.includes(ENOTIFICATIONS.invoice_available_email), this.notification.includes(ENOTIFICATIONS.invoice_available_webpush)] : [false, false]}
                  onChange={(checked) => {
                    if (!checked[0]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.invoice_available_email);
                    } else if (!this.notification.includes(ENOTIFICATIONS.invoice_available_email)) {
                      this.notification.push(ENOTIFICATIONS.invoice_available_email);
                    }
                    if (!checked[1]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.invoice_available_webpush);
                    } else if (!this.notification.includes(ENOTIFICATIONS.invoice_available_webpush)) {
                      this.notification.push(ENOTIFICATIONS.invoice_available_webpush);
                    }
                    this.onChangeNotification()
                  }}
                />
              </div>
              <div className="form-group">
                <CheckboxComponent
                  id="Invoice/PO Number Reminder Emails for outstanding invoices w/missing PO Numbers"
                  hasTitle="Invoice/PO Number Reminder Emails for outstanding invoices w/missing PO Numbers"
                  name="invoice_number_reminder_emails"
                  checked={this.notification ? [this.notification.includes(ENOTIFICATIONS.invoice_number_reminder_emails_email), this.notification.includes(ENOTIFICATIONS.invoice_number_reminder_emails_webpush)] : [false, false]}
                  onChange={(checked) => {
                    if (!checked[0]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.invoice_number_reminder_emails_email);
                    } else if (!this.notification.includes(ENOTIFICATIONS.invoice_number_reminder_emails_email)) {
                      this.notification.push(ENOTIFICATIONS.invoice_number_reminder_emails_email);
                    }
                    if (!checked[1]) {
                      this.notification = this.notification.filter((item) => item !== ENOTIFICATIONS.invoice_number_reminder_emails_webpush);
                    } else if (!this.notification.includes(ENOTIFICATIONS.invoice_number_reminder_emails_webpush)) {
                      this.notification.push(ENOTIFICATIONS.invoice_number_reminder_emails_webpush);
                    }
                    this.onChangeNotification()
                  }}
                />
              </div>
            </div>
          </Collapsible>

          <div className="row my-4">
            <div className="col-sm-4">
              <button
                type="submit"
                className="btn btn-secondary w-100 py-2"
                style={{ marginLeft: 45 }}
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default withFormik({
  mapPropsToValues: () => ({
    name: '',
    email: '',
    phoneNumber: '',
    subcontractorId: '',
    avatar: '',
    firstName: '',
    lastName: '',
    enableNotification: false,
    notification: []
  }),
  validationSchema: ProfileEditValidation,
  handleSubmit: async (values: any, data) => {
    console.log(data, values);
    if (Array.isArray(values.departments)) {
      values.departments = values.departments.map(
        (department) => department.value
      );
    }

    if (values.name) {
      const [firstName, lastName] = values.name.split(' ');
      values.firstName = firstName;
      values.lastName = lastName;
    }
    const user = Object.entries(values).reduce((user, [key, value]) => {
      if (value) {
        user[key] = value;
      }
      if (key === 'enableNotification') {
        user[key] = Boolean(value);
      }
      return user;
    }, {});

    console.log('user: ', user);

    userStore.updateMeLocal(user as User);

    await userAPI.update(user as User).then((res) => {
      console.log(res);
      if (res.status === 200) {
        toast.success('Profile was updated!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    });
  },
})(MyProfileComponent);
