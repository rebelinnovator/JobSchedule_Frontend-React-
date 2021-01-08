import { inject, observer, Provider } from 'mobx-react';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import io from 'socket.io-client';
import './App.scss';
import { AppTitle } from './AppTitle';
import { NOTIFIABLE_TYPES } from './Constants/job';
import CalendarAssignWorker from './Containers/Components/Calendars/Calendar.AssignWorker';
import PrivateRoute from './Containers/Components/PrivateRoute';
import { Invoices } from './Containers/Invoices/Invoices';
import Job from './Containers/Job/Job';
import JobCreateComponent from './Containers/Job/JobCreate';
import { JobDetailsComponent } from './Containers/Job/JobDetails';
import JobEdit from './Containers/Job/JobEdit';
import CEMap from './Containers/Maps/Map';
import { MenuCE } from './Containers/Menus/MenuCE';
import { Notifications } from './Containers/Notifications/Notifications';
import MyProfileComponent from './Containers/Profile/MyProfile.Component';
import ProfileComponent from './Containers/Profile/Profile.Component';
import CreateUser from './Containers/Registrations/CreateUser';
import LoginComponent from './Containers/Registrations/Login';
import RecoveryPasswordComponent from './Containers/Registrations/RecoveryPassword';
import RecoveryPasswordSuccessComponent from './Containers/Registrations/RecoveryPasswordSuccess';
import SignUpComponent from './Containers/Registrations/SignUp';
import SignUpSuccessComponent from './Containers/Registrations/SignUpSuccess';
import ActivateSuccessComponent from './Containers/Registrations/ActivateSuccess';
import RolesComponent from './Containers/Roles/Roles';
import Subcontractors from './Containers/Subcontractors/Subcontractors';
import TimesheetEdit from './Containers/Timesheets/TimesheetEdit';
import { Timesheets } from './Containers/Timesheets/Timesheets';
import WorkerCreateComponent from './Containers/Workers/WorkerCreate';
import RoleCreateComponent from './Containers/Roles/RoleCreate';
import WorkerDetailsComponent from './Containers/Workers/WorkerDetails';
import Workers from './Containers/Workers/Workers';
import './index.scss';
import { IGuard } from './Stores/guard';

import notificationStore from './Stores/notificationStore';
import RestorePassword from './Containers/Registrations/RestorePassword';
import InvoiceDetailsFull from './Containers/Invoices/InvoiceDetailsFull';
import InvoicesInfo from './Containers/Invoices/InvoicesInfo';
import mapStore from './Stores/mapStore';
import { CurrentLocation } from './Models/geoLocation';


interface AppProps {

  guard?: IGuard;
}


@inject('guard')

@observer
class App extends Component<AppProps> {

  componentDidMount(): void {
    navigator.geolocation.getCurrentPosition(function (position) {
      const currentLocation: CurrentLocation = {
        Longtitude: position.coords.longitude,
        Latitude: position.coords.latitude
      };
      mapStore.setCurrentLocation(currentLocation);

    });
    const address = `${process.env.REACT_APP_NOTIFICATIONS_ADDRESS || '127.0.0.1:7777'}`;

    const socket = io.connect(address, { secure: true, transports: ['websocket'] });
    const currentToken = localStorage.getItem('Token');
    socket.on('connect', (_socket) => {
      socket
        .on('authenticated', () => { notificationStore.getNotifications({}); console.log('socket connected'); })
        .on('notifications', (message) => this.notificationReceived(message))
        .emit('authenticate', { token: currentToken ? JSON.parse(currentToken) : '' });
    });
  }

  notificationReceived(data) {
    notificationStore.getNotifications({});
    notificationStore.setHasReadNotification(false);
    notificationStore.notification = data;
    switch (data.notifiableType) {
      case NOTIFIABLE_TYPES.CREATE_JOB:
        toast.success(
          data.message ? data.message : data.notifiableGroup.message
        );
        break;
      case NOTIFIABLE_TYPES.CANCEL_JOB:
        toast.warn(
          data.message ? data.message : data.notifiableGroup.message
        );
        break;
      default:
        toast.info(
          data.message ? data.message : data.notifiableGroup.message
        );
        break;
    }
  }

  render() {
    return (
      <Router>
        <Provider>
          <div className="App" style={{ overflow: 'hidden' }}>
            <header className="App-header">
              <MenuCE />
            </header>
            <AppTitle title="CE Solution" />
            <Switch>
              <Route exact path="/" component={LoginComponent} />
              <Route exact path="/login" component={LoginComponent} />
              <Route exact path="/login/activate" component={ActivateSuccessComponent} />
              <Route exact path="/login/activateworker" component={ActivateSuccessComponent} />
              <Route exact path="/signup" component={SignUpComponent} />
              <Route exact path="/signup/success" component={SignUpSuccessComponent} />
              <Route exact path="/recovery" component={RecoveryPasswordComponent} />
              <Route exact path="/recovery/success" component={RecoveryPasswordSuccessComponent} />
              <Route exact path="/restore/:token" component={RestorePassword} />
              <PrivateRoute path="/map" component={CEMap} />
              <PrivateRoute exact path="/invoices" component={Invoices} />
              <PrivateRoute path="/subcontractors" component={Subcontractors} />
              <PrivateRoute exact path="/timesheets" component={Timesheets} />
              <PrivateRoute exact path="/workers" component={Workers} />
              <PrivateRoute exact path="/job" component={Job} />
              <PrivateRoute path="/job/create" component={JobCreateComponent} />
              <PrivateRoute path="/job/:id/copy" component={JobCreateComponent} />
              <PrivateRoute path="/job/:id/assignworker" component={CalendarAssignWorker} />
              <PrivateRoute path="/job/:id/edit" component={JobEdit} />
              <PrivateRoute path="/job/:id" component={JobDetailsComponent} />
              <PrivateRoute path="/workers/create" component={WorkerCreateComponent} />
              <PrivateRoute path="/workers/:id" component={WorkerDetailsComponent} />
              <PrivateRoute path="/timesheets/:id/edit" component={TimesheetEdit} />
              <PrivateRoute path="/notifications" component={Notifications} />
              <PrivateRoute exact path="/roles" component={RolesComponent} />
              <PrivateRoute path="/roles/create" component={RoleCreateComponent} />
              <PrivateRoute path="/profile/:id" component={ProfileComponent} />

              <PrivateRoute path="/profile" component={MyProfileComponent} />
              <PrivateRoute path="/invoices/:id/info" component={InvoicesInfo} />
              <PrivateRoute path="/invoices/:id/timesheets/:jobType" component={InvoiceDetailsFull} />
              <PrivateRoute path="/invoices/:id" component={InvoiceDetailsFull} />
              <PrivateRoute path="/createuser" component={CreateUser} />
            </Switch>
            <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} autoClose={20000}/>
          </div>
        </Provider>
      </Router>
    );
  }

}

export default App;
