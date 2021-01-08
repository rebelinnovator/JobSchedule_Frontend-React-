import { withFormik } from 'formik';
import { createBrowserHistory } from 'history';
import React, { RefObject } from 'react';
import { User } from '../../Models/APITypes';
import { userAPI } from '../../Services/API';
import { RoleValidation } from './RoleValidation';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import RolesAsyncSearch from '../Components/Controls/RolesAsyncSearch';
import { ISelectItem } from '../Components/Controls/AsyncSelect';
import { Link } from 'react-router-dom';
import { EROLES } from '../../Constants/user';
import authStore from '../../Stores/authStore';

class RoleCreateComponent extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  showImage = false;
  file: any;
  private readonly inputOpenFileRef: RefObject<
    HTMLInputElement
  > = React.createRef();

  handleChangeField(name) {
    return (event) => {
      const {
        currentTarget: { value },
      } = event;
      return this.props.setFieldValue(name, value);
    };
  }

  removeImage() {
    this.showImage = false;
    this.file = undefined;
    this.setState({ change: true });
    this.props.setFieldValue('avatar', undefined);
  }

  showOpenFileDlg = () => {
    this.inputOpenFileRef.current.click();
  };

  handleChangeState(name: string, value: string) {
    this.setState({
      [name]: value,
    });
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

  public render() {
    const { errors, handleSubmit } = this.props;

    return (
      <form className="container" onSubmit={handleSubmit}>
        <div className="form-login form-sign-up m-auto">
          <div className="form-login-header border-0">Add New User Role</div>
          <div className="form-login-body">
            <div>
              <input
                type="file"
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
                    onClick={() => this.showOpenFileDlg()}
                  >
                    {/* <i className="fa fa-camera m-auto"></i> */}
                  </div>
                )}
              <p className="error">{errors.avatar}</p>
            </div>
            <div className="form-group">
              <label className="d-block">Name</label>
              <input
                className="ce-form-control"
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
                onChange={this.handleChangeField('email')}
              />
              <p className="error">{errors.email}</p>
            </div>
            <div className="form-group">
              <label className="d-block">Role(s)</label>
              <RolesAsyncSearch
                isMulti
                onSelect={(role: ISelectItem) => this.onRoleSelect(role)}
                onlyDispatcher={!authStore.isSuperAdmin()}
              />
              <p className="error">{errors.roles}</p>
            </div>
            <div className="form-group">
              <label className="d-block">PhoneNumber</label>
              <input
                className="ce-form-control"
                name="phoneNumber"
                placeholder="+X (XXX) XXX XXXX"
                onChange={this.handleChangeField('phoneNumber')}
              />
            </div>
            <div className="form-group">
              <label className="d-block">Department(s)</label>
              <DepartmentAsyncSearch
                isMulti
                onSelect={(department: ISelectItem) =>
                  this.onDepartmentSelect(department)
                }
              />
              <p className="error">{errors.departments}</p>
            </div>
          </div>
          <div className="form-login-header border-0">Password</div>
          <div className="form-login-body">
            <div className="form-group">
              <label className="d-block">Password</label>
              <input
                className="ce-form-control"
                type="password"
                autoComplete="new-password"
                name="password"
                onChange={this.handleChangeField('password')}
              />
              <p className="error">{errors.password}</p>
            </div>
            <div className="mt-4 d-flex justify-content-start page-action-bottom">
              <button
                type="submit"
                className="btn btn-success py-2 px-5 btn-add mr-4"
              >
                Add Role
              </button>
              <Link className="goto-roles mr-2" to={`/roles`}>
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 px-5"
                >
                  Cancel
                </button>
              </Link>
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
    password: '',
    roles: '',
    departments: '',
    avatar: '',
    firstName: '',
    lastName: '',
  }),
  validationSchema: RoleValidation,
  handleSubmit: async (values: any, { props }) => {
    const name = values.name.split(' ');
    values.firstName = name[0];
    values.lastName = name[1];

    if (Array.isArray(values.departments)) {
      values.departments = values.departments.map(
        (department) => department.value
      );
    }

    if (Array.isArray(values.roles)) {
      values.roles = values.roles.map((role) => role.value && role.value.id);
    }

    userAPI.createRole(values as User).then((res) => {
      if (res.status === 201) {
        createBrowserHistory({ forceRefresh: true }).push('/roles');
      }
    });
  },
})(RoleCreateComponent);
