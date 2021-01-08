import * as React from 'react';

export class RecoveryPasswordSuccessComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <div className="d-flex">
        <form className="form-login m-auto">
          <div className="form-login-header">
            Thank You!
          </div>
          <div className="form-login-body">
            <div className="form-group">
              <label className="d-block">
                We’ve sent password reset instructions to your email address.
                If no email is received within ten minutes,
                check that the submitted address is correct.
              </label>
            </div>
            <div className="form-group">
              <a href="/login" className="link-sign-up">Back to Login</a>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default RecoveryPasswordSuccessComponent;
