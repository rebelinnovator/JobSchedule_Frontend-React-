import * as React from 'react';
import { History } from 'history';
import { userAPI, authAPI } from '../../Services/API';
import { forgotPasswordValidation, restorePasswordValidation } from './CreateUserValidation';
import { withFormik } from 'formik';

interface Props {
  history: History;
}

export class RecoveryPasswordComponent extends React.Component<Props | any> {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount = () => {
    const { token } = this.props.match.params;
    setTimeout(() => this.props.setFieldValue('token', token, false), 100);
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.props.setFieldValue(name, value, false);
  }

  getErrorMessage = (key) => {
    const jobs = this.props.errors.jobs;
    if (!jobs || !Array.isArray(jobs)) {
      return null;
    }
    return jobs[key];
  };

  public render() {
    const { handleSubmit, errors } = this.props;
    return (
      <div className="d-flex">
        <form className="form-login m-auto" onSubmit={handleSubmit}>
          <div className="form-login-header">
            Reset password
          </div>
          <div className="form-login-body">
            <div className="form-group">
              <label className="d-block">New Password</label>
              <input
                className="ce-form-control"
                name="password"
                type="password"
                onChange={this.handleInputChange} />
              <p className="error">{this.getErrorMessage('password')}</p>
            </div>
            <div className="form-group">
              <label className="d-block">Repeat Password</label>
              <input
                className="ce-form-control"
                name="repeatPassword"
                type="password"
                onChange={this.handleInputChange} />
              <p className="error">{this.getErrorMessage('repeatPassword')}</p>
            </div>
            <div className="form-group text-center mt-4">
              <button
                type="submit"
                className="btn btn-primary btn-login w-100 py-2"
              >
                Reset Password
              </button>
              <p className="error">{this.getErrorMessage('token')}</p>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default withFormik({
  mapPropsToValues: (props: any) => {
    return {};
  },
  validationSchema: restorePasswordValidation,
  handleSubmit: async (values: any, { props }) => {
    await authAPI.passwordRestore({
      token: values.token, password: values.password,
    });

    props.history.push('/login');
  },
})(RecoveryPasswordComponent);