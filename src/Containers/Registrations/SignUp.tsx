import * as React from 'react';

import DropdownComponent from '../Components/Dropdownlist/Dropdown.Component';
import userStore from '../../Stores/userStore';
import mainStore from '../../Stores/mainStore';
import { userService } from '../../Services';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import { ISelectItem } from '../Components/Controls/AsyncSelect';
import RolesAsyncSearch from '../Components/Controls/RolesAsyncSearch';
import { EROLES } from '../../Constants/user';

type Props = {
  history: History,
};

export class SignUpComponent extends React.Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      firstName: null,
      lastName: null,
      email: null,
      departments: null,
      roles: null,
      password: null,
      repeatPassword: null,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    mainStore.setLogin(false);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleChangeState(name: string, value: string) {
    this.setState({
      [name]: value,
    });
  }

  signup = async () => {
    await userService.signup(this.state, { history: this.props.history });
  };

  public render() {
    return (
      <div className="container">
        <form className="form-login form-sign-up m-auto">
          <div className="form-login-header">Sign In</div>
          <div className="form-login-body">
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label className="d-block">First Name</label>
                  <input
                    className="ce-form-control"
                    name="firstName"
                    placeholder=""
                    onChange={this.handleInputChange}
                  ></input>
                </div>
                <div className="form-group">
                  <label className="d-block">Last Name</label>
                  <input
                    className="ce-form-control"
                    name="lastName"
                    placeholder=""
                    onChange={this.handleInputChange}
                  ></input>
                </div>
                <div className="form-group">
                  <label className="d-block">PhoneNumber</label>
                  <input
                    className="ce-form-control"
                    name="phoneNumber"
                    placeholder="+X (XXX) XXX XXXX"
                    onChange={this.handleInputChange}
                  ></input>
                </div>
                <div className="form-group">
                  <label className="d-block">Email</label>
                  <input
                    className="ce-form-control"
                    name="email"
                    placeholder="example.email@coned.com"
                    onChange={this.handleInputChange}
                  ></input>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label className="d-block">Department(s)</label>
                  <DepartmentAsyncSearch
                    isMulti
                    // onSelect={(department: ISelectItem) => this.onDepartmentSelect(department)}
                    onSelect={(departments: any) =>
                      this.handleChangeState(
                        'departments',
                        departments.map(department => department.value.id)
                      )}
                  />
                  {/* <DropdownComponent
                    sources={userStore.Departments}
                  ></DropdownComponent> */}
                </div>
                <div className="form-group">
                  <label className="d-block">Role(s)</label>
                  <RolesAsyncSearch
                    isMulti
                    filterFunc={(item: any) => item.value.id !== EROLES.superadmin}
                    onSelect={(item: any) =>
                      this.handleChangeState('roles', item.map(role => role.value.id))} />
                  {/* <DropdownComponent
                    placeHolder="Select role"
                    renderType="chk"
                    multiSelect={true}
                    displayName="name"
                    sources={userStore.Roles}
                    onSelect={roles => this.handleChangeState('roles', roles.map(role => role.id))}
                  ></DropdownComponent> */}
                </div>
                <div className="form-group">
                  <label className="d-block">Password</label>
                  <input
                    className="ce-form-control"
                    type="password"
                    name="password"
                    onChange={this.handleInputChange}
                  ></input>
                </div>
                <div className="form-group">
                  <label className="d-block">Repeat Password</label>
                  <input
                    className="ce-form-control"
                    type="password"
                    name="repeatPassword"
                    onChange={this.handleInputChange}
                  ></input>
                </div>
              </div>
            </div>
            <div className="row my-4">
              <div className="col-sm-4">
                <button
                  type="button"
                  className="btn btn-primary btn-login w-100 py-2"
                  onClick={() => this.signup()}
                >
                  Sign Up
                </button>
              </div>
              <div className="col-12 col-sm-8 center-sp">
                <div className="py-2 py-sm-0">Already have an account?</div>
                <div>
                  <a href="/login" className="link-sign-up">
                    Log In
                  </a>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default SignUpComponent;
