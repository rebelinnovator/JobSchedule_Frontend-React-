import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import authStore from '../../Stores/authStore';

interface Props {
  component: any,
  path?: string,
  exact?: boolean,
  location?: any
}

class PrivateRoute extends React.Component<Props> {
  render() {
    const {
      component: Component,
      ...rest
    } = this.props;

    (window as any).prevLocation = this.props.location;

    return (
      <Route
        {...rest}
        render={props => (authStore.logged ? (
          <Component {...props} />
        ) : (
            <Redirect to="/login" />
          ))
        }
      />
    );
  }
}

export default PrivateRoute;
