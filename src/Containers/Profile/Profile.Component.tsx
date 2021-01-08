import { withFormik } from 'formik';
import React, { RefObject } from 'react';
import { createBrowserHistory } from 'history';
import workerImage from '../../Images/worker.png';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import RolesAsyncSearch from '../Components/Controls/RolesAsyncSearch';
import { ProfileEditValidation } from './Profile.Validation';
import { ISelectItem } from '../Components/Controls/AsyncSelect';
import userStore from '../../Stores/userStore';
import { observer } from 'mobx-react';
import { User } from '../../Models';
import { EROLES, ROLES } from '../../Constants/user';
import { userAPI, workerAPI } from '../../Services/API';
import ReactSelect from 'react-select';
import { WORKER_TYPE } from '../Workers/Workers';

@observer
export class ProfileComponent extends React.Component<any, any> {
  showImage = false;
  file: any;
  private readonly inputOpenFileRef: RefObject<
    HTMLInputElement
  > = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      roleParams: {
        status: '1',
      },
      hasWorker: false,
    };
  }

  componentDidMount = () => {
    const { id } = this.props.match.params;
    if (id) {
      userStore.loadUser(id);
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
    this.setState({
      [name]: value,
    });
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

  onRoleSelect = (role) => {
    if (!role) {
      this.props.setFieldValue('roles', null);
      return;
    }
    this.props.setFieldValue('roles', role);
    console.log(role, Array.isArray(role) && role.findIndex((item) => item === EROLES.worker) >= 0);
    this.setState({
      hasWorker: Array.isArray(role) && role.findIndex((item) => item.value.id === EROLES.worker) >= 0
    })
  };

  onTypeSelect = (items) => {
    if (items && items.length > 0) {
      this.props.setFieldValue('workerTypes', items.map(item => Number(item.value)));
    } else {
      this.props.setFieldValue('workerTypes', []);
    }
  }

  render() {
    if (!userStore.user.id) {
      return 'Loading...';
    }

    const { errors, handleSubmit } = this.props;

    const isWorker = Array.isArray(userStore.user.roles) &&
      userStore.user.roles.findIndex((item) => item === EROLES.worker) >= 0;
    const isOnlyWorker = isWorker && userStore.user.roles.length === 1;

    return (
      <form className="container" onSubmit={handleSubmit}>
        <div className="form-login form-sign-up m-auto">
          <div className="form-login-header border-0">Profile Information</div>
          {userStore.user ? (
            <div className="form-login-body">
              <div>
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
                        backgroundImage: `url("${process.env.REACT_APP_API_ENDPOINT}${userStore.user.avatar}")`,
                      }}
                      onClick={() => this.showOpenFileDlg()}
                    ></div>
                  )}
              </div>
              <div className="form-group">
                <label className="d-block">Name</label>
                <input
                  className="ce-form-control"
                  defaultValue={userStore.user.name}
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
                  defaultValue={userStore.user.email}
                  onChange={this.handleChangeField('email')}
                />
                <p className="error">{errors.email}</p>
              </div>
              <div className="form-group">
                <label className="d-block">Role(s)</label>
                <RolesAsyncSearch
                  isMulti
                  defaultValue={
                    Array.isArray(userStore.user.roles) &&
                    userStore.user.roles.map((role) => ({
                      label: ROLES[role - 1].name,
                      value: ROLES[role - 1],
                    }))
                  }
                  onSelect={(role: ISelectItem) => this.onRoleSelect(role)}
                  placeholder={'Select role'}
                />
                <p className="error">{errors.role}</p>
              </div>
              {(isWorker || this.state.hasWorker) && <div className="form-group">
                <label className="d-block">Worker Type(s)</label>
                <ReactSelect
                  onChange={this.onTypeSelect}
                  placeholder="No Type"
                  options={WORKER_TYPE}
                  isMulti
                  defaultValue={
                    Array.isArray(userStore.user.workerTypes) &&
                    userStore.user.workerTypes.map((type) => ({
                      label: WORKER_TYPE.find((item) => item.value === type).label,
                      value: type,
                    }))
                  }
                />
                <p className="error">{errors.workerTypes}</p>
              </div>
              }
              <div className="form-group">
                <label className="d-block">PhoneNumber</label>
                <input
                  className="ce-form-control"
                  name="phoneNumber"
                  defaultValue={userStore.user.phoneNumber}
                  placeholder="+X (XXX) XXX XXXX"
                  onChange={this.handleChangeField('phoneNumber')}
                />
                <p className="error">{errors.phoneNumber}</p>
              </div>
              {!isOnlyWorker &&
                <div className="form-group">
                  <label className="d-block">Department(s)</label>
                  <DepartmentAsyncSearch
                    isMulti
                    defaultValue={
                      Array.isArray(userStore.user.departments) &&
                      userStore.user.departments.map((department) => ({
                        label: department.name,
                        value: department,
                      }))
                    }
                    onSelect={(department: ISelectItem) =>
                      this.onDepartmentSelect(department)
                    }
                  />
                  <p className="error">{errors.department}</p>
                </div>
              }
            </div>
          ) : null}
          <div className="form-login-header border-0">Password</div>
          <div className="form-login-body">
            <div className="form-group">
              <label className="d-block">Password</label>
              <input
                className="ce-form-control"
                type="password"
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
                name="repeatPassword"
                onChange={this.handleChangeField('repeatPassword')}
              />
              <p className="error">{errors.repeatPassword}</p>
            </div>
            <div className="mt-4 d-flex justify-content-start page-action-bottom">
              <button
                type="submit"
                className="btn btn-success py-2 px-5 btn-add mr-4"
              >
                Save
              </button>
              <a className="goto-roles mr-2" href="#">
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 px-5"
                  onClick={() => {
                    (this.props as any).history.push({
                      pathname: '/roles',
                      state: (this.props as any).location.state
                    });
                  }}
                >
                  Cancel
                </button>
              </a>
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
    workerTypes: [],
  }),
  validationSchema: ProfileEditValidation,
  handleSubmit: async (values: any, { props }) => {
    if (Array.isArray(values.departments)) {
      values.departments = values.departments.map(
        (department) => department.value
      );
    }

    if (Array.isArray(values.roles)) {
      values.roles = values.roles.map((role) => role.value && role.value.id);
    }

    if (Array.isArray(values.workerTypes)) {
      values.workerTypes = values.workerTypes.map((type) => Number(type));
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
      return user;
    }, {});

    await workerAPI.update(userStore.user.id, user).then((res) => {
      if (res.status === 202) {
        userStore.user.workerTypes = values.workerTypes;
        (props as any).history.push({
          pathname: '/roles',
          state: (props as any).location.state
        });
      }
    });
  },
})(ProfileComponent);
