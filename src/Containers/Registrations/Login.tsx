import * as React from 'react';
import { withFormik } from 'formik';

import { Redirect } from 'react-router-dom';
import { LoginValidation } from './LoginValidation';
import authStore from '../../Stores/authStore';

export class LoginComponent extends React.Component<any, any> {

  constructor(props) {
    super(props);

  }

  public render() {
    const { errors, handleChange, handleBlur, handleSubmit } = this.props;
    if (authStore.logged) {
      return (<Redirect to="/map" />);

    }
    return (
      <div className="d-flex">
        <form className="form-login m-auto" onSubmit={handleSubmit}>
          <div className="form-login-header">
            Log In
          </div>
          <div className="form-login-body">
            <div className="form-group" >
              <label className="d-block">Email</label>
              <input
                className="ce-form-control"
                name="email"
                placeholder="example.email@coned.com"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <p className="error">{errors.email}</p>
            </div>
            <div className="form-group" >
              <label className="d-block">Password</label>
              <input
                className="ce-form-control"
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <p className="error">{errors.password}</p>
            </div>
            <div className="form-group text-right">
              <a className="text-color2" href="/recovery">Forgot Password</a>
            </div>
            <div className="form-group text-center">
              <button type="submit" className="btn btn-primary btn-login w-100 py-2">Log In</button>
            </div>
            <div className="form-group text-center">
              <span className="text-color2 mr-2">Don't have an account?</span>
              <br className="d-block d-md-none" />
              <a href="/signup" className="link-sign-up">Sign Up</a>
            </div>
          </div>
        </form>
      </div >
    );
  }
}

export default withFormik({
  mapPropsToValues: () => ({
    email: '',
    password: '',
  }),
  validationSchema: LoginValidation,
  handleSubmit: (values, { props }) => {
    authStore.login(values);
    // mainStore.setLogin(true);
  },
})(LoginComponent);
