import * as React from 'react';
import { History } from 'history';

interface Props {
  history: History;
}

export class SignUpSuccessComponent extends React.Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const { history: { location: { state: { email = '' } = { } } } } = this.props;
    return (
      <div className="d-flex">
        <form className="form-login m-auto">
          <div className="form-login-header">
            Check Your Email
          </div>
          <div className="form-login-body">
            <div className="form-group" >
              <label className="d-block">
                For your security, we have sent a link to verify your
                account on {email.charAt(0)}******@coned.com <br /><br />
                Please check your email <br/>
                and follow the link
              </label>
            </div>
          </div>
        </form>
      </div >
    );
  }
}

export default SignUpSuccessComponent;
