import { observable, action } from 'mobx';
import { createBrowserHistory } from 'history';

import { authAPI } from '../Services/API';
import { User } from '../Models';
import userStore from './userStore';
import axios from 'axios';
import { EROLES } from '../Constants/user';

class AuthStore {
  @observable logged: boolean;
  @observable token: string;
  @observable currentUser: User;

  constructor() {
    this.logged = false;
    this.token = '';
    this.currentUser = null;
    const logged = localStorage.getItem('Logged');
    const token = localStorage.getItem('Token');
    const currentUser = localStorage.getItem('CurrentUser');
    if (logged) {
      this.logged = JSON.parse(logged);
    }
    if (token) {
      this.token = JSON.parse(token);
    }
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }
  }

  canDoJobAction() {
    if (this.currentUser &&
      this.currentUser.roles &&
      (this.currentUser.roles.includes(EROLES.requestor) ||
        this.currentUser.roles.includes(EROLES.department_supervisor) ||
        this.currentUser.roles.includes(EROLES.dispatcher) ||
        this.currentUser.roles.includes(EROLES.dispatcher_supervisor) ||
        this.currentUser.roles.includes(EROLES.superadmin))) {
      return true;
    }
    return false;
  }

  canCancelJob() {
    if (this.currentUser &&
      this.currentUser.roles &&
      (
        this.currentUser.roles.includes(EROLES.department_supervisor) ||
        this.currentUser.roles.includes(EROLES.dispatcher) ||
        this.currentUser.roles.includes(EROLES.dispatcher_supervisor) ||
        this.currentUser.roles.includes(EROLES.superadmin))) {
      return true;
    }
    return false;
  }

  canAccessLimitDept() {
    if (this.currentUser &&
      this.currentUser.roles &&
      (this.currentUser.roles.includes(EROLES.requestor) ||
        this.currentUser.roles.includes(EROLES.department_supervisor) ||
        this.currentUser.roles.includes(EROLES.coned_billing_admin)
      )) {
      if (this.currentUser.roles.includes(EROLES.dispatcher) ||
        this.currentUser.roles.includes(EROLES.dispatcher_supervisor) ||
        this.currentUser.roles.includes(EROLES.billing) ||
        this.currentUser.roles.includes(EROLES.superadmin)) {
        return false;
      }
      return true;
    }
    return false;
  }


  canAccessInvoice() {
    if (this.currentUser && this.currentUser.roles &&
      (this.currentUser.roles.includes(EROLES.billing)
        || this.currentUser.roles.includes(EROLES.coned_billing_admin)
        || this.currentUser.roles.includes(EROLES.superadmin))) {
      return true;
    }
    return false;
  }

  canAccessRoles() {
    if (this.currentUser && this.currentUser.roles &&
      (this.currentUser.roles.includes(EROLES.dispatcher_supervisor)
        || this.currentUser.roles.includes(EROLES.superadmin))) {
      return true;
    }
    return false;
  }

  canDoTimesheetAction() {
    if (this.currentUser && this.currentUser.roles &&
      (this.currentUser.roles.includes(EROLES.billing)
        || this.currentUser.roles.includes(EROLES.coned_billing_admin)
        || this.currentUser.roles.includes(EROLES.superadmin))) {
      return true;
    }
    return false;
  }

  isSuperAdmin() {
    if (this.currentUser &&
      this.currentUser.roles &&
      (this.currentUser.roles.includes(EROLES.superadmin))) {
      return true;
    }
    return false;
  }

  canAssignWorker() {
    if (this.currentUser && this.currentUser.roles &&
      (this.currentUser.roles.includes(EROLES.dispatcher)
        || this.currentUser.roles.includes(EROLES.dispatcher_supervisor)
        || this.currentUser.roles.includes(EROLES.superadmin))) {
      return true;
    }
    return false;
  }

  canAccessWorker() {
    if (this.currentUser && this.currentUser.roles &&
      (this.currentUser.roles.includes(EROLES.dispatcher)
        || this.currentUser.roles.includes(EROLES.dispatcher_supervisor)
        || this.currentUser.roles.includes(EROLES.superadmin))) {
      return true;
    }
    return false;
  }

  canDoWorkerAction() {
    if (this.currentUser && this.currentUser.roles &&
      (this.currentUser.roles.includes(EROLES.dispatcher_supervisor)
        || this.currentUser.roles.includes(EROLES.superadmin))) {
      return true;
    }
    return false;
  }

  canAccessSubContractor() {
    if (this.currentUser && this.currentUser.roles &&
      (this.currentUser.roles.includes(EROLES.dispatcher)
        || this.currentUser.roles.includes(EROLES.dispatcher_supervisor)
        || this.currentUser.roles.includes(EROLES.superadmin))) {
      return true;
    }
    return false;
  }

  @action setLogin(isLogged: boolean, token: string = '', currentUser: User = null) {
    this.logged = isLogged;
    this.token = token;
    this.currentUser = currentUser;
    axios.defaults.headers['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('Logged', JSON.stringify(this.logged));
    localStorage.setItem('Token', JSON.stringify(this.token));
    localStorage.setItem('CurrentUser', JSON.stringify(this.currentUser));
  }

  @action login = async (params: any) => {
    const { data: { token, payload } } = await authAPI.login(params);

    this.setLogin(true, token, payload);


    if ((window as any).prevLocation == null) {
      createBrowserHistory({ forceRefresh: true }).push('/map');
    } else {
      const location = (window as any).prevLocation.pathname;
      (window as any).prevLocation = null;
      createBrowserHistory({ forceRefresh: true }).push(location);
    }

  }
}
export default new AuthStore;
