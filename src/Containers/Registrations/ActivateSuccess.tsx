import * as React from 'react';
import { History } from 'history';

interface Props {
  history: History;
  location: Location;
}

export class ActivateSuccessComponent extends React.Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const { history: { location: { state: { email = '' } = {} } } } = this.props;

    return (
      <div className="d-flex">
        <form className="form-login m-auto">
          <div className="form-login-header">
            Succesful Activation
          </div>
          <div className="form-login-body">
            <div className="form-group" >
              <label className="d-block">
                The account was activated successfully. {
                  this.props.location.pathname === '/login/activate' && <>You can start to <a href="/login" className="link-sign-up">log in</a></>
                }
              </label>
            </div>
          </div>
        </form>
      </div >
    );
  }
}

export default ActivateSuccessComponent;
