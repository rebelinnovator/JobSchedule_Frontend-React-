import * as React from 'react';
import { History } from 'history';
import { userAPI, authAPI } from '../../Services/API';
import { forgotPasswordValidation } from './CreateUserValidation';
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
    const { handleSubmit } = this.props;
    return (
      <div className="d-flex">
        <form onSubmit={handleSubmit} className="form-login m-auto">
          <div className="form-login-header">
            Password Recovery
          </div>
          <div className="form-login-body">
            <div className="form-group">
              <label className="d-block">Enter the email you're using for your account</label>
            </div>
            <div className="form-group">
              <label className="d-block">Email</label>
              <input className="ce-form-control" name="email" placeholder="example.email@coned.com"
                onChange={this.handleInputChange}/>
                 <p className="error">{this.getErrorMessage('email')}</p>
            </div>
            <div className="form-group text-center mt-4">
              <button
                type="submit"
                className="btn btn-primary btn-login w-100 py-2"
              >
                Continue
              </button>
            </div>
            <div className="form-group text-center">
              <a href="/login" className="link-sign-up">Back to Login</a>
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
  validationSchema: forgotPasswordValidation,
  handleSubmit: async (values: any, { props }) => {
    const response = await authAPI.passwordForgot(values.email);

  
    props.history.push('/recovery/success');
  },
})(RecoveryPasswordComponent);


