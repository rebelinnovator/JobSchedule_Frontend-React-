import * as React from 'react';
import { observer } from 'mobx-react';
import { createBrowserHistory } from 'history';
import { NavLink } from 'react-router-dom';

import './MenuCE.css';
import Cogwheel from '../../Images/cogwheel.png';
import Logout from '../../Images/logout.png';
import Right from '../../Images/chevron-right-12.png';
import NoAvatar from '../../Images/no-ava.png';

import { NotificationInMenu } from '../Notifications/NotificationInMenu';
import authStore from '../../Stores/authStore';
import * as CeIcon from '../../Utils/Icon';
import ProfileMenu from './../Notifications/ProfileMenu';
import notificationStore from '../../Stores/notificationStore';

interface Props {
}

@observer
export class MenuCE extends React.Component<Props> {
  toggleNotificationMenu: boolean;
  toggleProfile: boolean;
  activeBell: boolean;
  activeUser: boolean;
  activeRole: boolean;

  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleOuteSiteClick = this.handleOuteSiteClick.bind(this);
  }

  handleLogout = () => {
    authStore.setLogin(false);
    createBrowserHistory({ forceRefresh: true }).push('/login');
  }

  toggleNotification = (e) => {
    e.stopPropagation();
    notificationStore.setHasReadNotification(true);
    this.toggleNotificationMenu = !this.toggleNotificationMenu;
    this.setState({ change: true });
  }

  toggleProfileMenu = () => {
    this.toggleProfile = !this.toggleProfile;
    this.setState({ change: true });
  }

  ClickToMenu() {
    const el: HTMLElement | null = document.getElementById('ceSidebar');
    if (el) {
      const definitelyAnElement: HTMLElement = el;
      definitelyAnElement.style.display = 'block';
    }
    const el1: HTMLElement | null = document.getElementById('ceSidebarOpacity');
    if (el1) {
      const definitelyAnElement1: HTMLElement = el1;
      definitelyAnElement1.style.display = 'block';
    }
  }

  ClickToCloseMenu() {
    const el: HTMLElement | null = document.getElementById('ceSidebar');
    if (el) {
      const definitelyAnElement: HTMLElement = el;
      definitelyAnElement.style.display = 'none';
    }
    const el1: HTMLElement | null = document.getElementById('ceSidebarOpacity');
    if (el1) {
      const definitelyAnElement1: HTMLElement = el1;
      definitelyAnElement1.style.display = 'none';
    }
  }

  handleOuteSiteClick(e) {
    if (this.toggleNotificationMenu && !e.target.attributes['data-popup']) {
      this.toggleNotification(e);
    }
  }

  componentDidMount() {
    // notificationStore.getNotifications({});
    if (window.location.href.indexOf('profile') != -1) {
      const el: HTMLElement | null = document.getElementById('profile');
      if (el) {
        const definitelyAnElement: HTMLElement = el;
        definitelyAnElement.classList.add('active');
        this.activeUser = true;
      } else {
        this.activeUser = false;
      }
    } else if (window.location.href.indexOf('notifications') != -1) {
      const el: HTMLElement | null = document.getElementById('notifications');
      if (el) {
        const definitelyAnElement: HTMLElement = el;
        definitelyAnElement.classList.add('active');
        this.activeBell = true;
      } else {
        this.activeBell = false;
      }
    }
    this.setState({ change: true });
  }

  public render() {
    const currentUser = authStore.currentUser;
    return (
      <div>
        <div id="ceSidebar" className="ce-sidebar">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-between align-items-center">
              <div className="user-avatar">
                <img src={NoAvatar} />
              </div>
              <div className="user-info text-left">
                <div className="fullname">{currentUser && `${currentUser.firstName} ${currentUser.lastName}`}</div>
                <div className="role">{currentUser && currentUser.roles && currentUser.roles.join(', ')}</div>
              </div>
            </div>
            <div className="mr-3">
              <img src={Right} />
            </div>
          </div>
          <hr className="styleHr" />
          <ul className="mt-3">
            <li className="">
              <a href="/map">Map</a>
            </li>
            <li className="">
              <a href="/job">Job List</a>
            </li>
            {authStore.canAccessWorker() &&
              <li className="">
                <a href="/workers">Workers</a>
              </li>
            }
            {authStore.canAccessSubContractor() &&
              <li className="">
                <a href="/subcontractors">Subcontractors</a>
              </li>

            }
            <li className="">
              <a href="/timesheets">Timesheets</a>
            </li>
            {authStore.canAccessInvoice() &&
              <li className="">
                <a href="/invoices">Invoices</a>
              </li>
            }
            {authStore.canAccessRoles() &&
              <li className="">
                <a href="/roles">Settings</a>
              </li>
            }
            <li className="log-out" onClick={() => this.handleLogout()}>
              <a>
                <img className="mr-2" src={Logout} />
                <span>Log Out</span>
              </a>
            </li>
          </ul>
        </div>
        <div
          onClick={() => {
            this.ClickToCloseMenu();
          }}
          id="ceSidebarOpacity"
          className="ce-sidebar-opacity"
        ></div>
        {authStore.logged ? (
          <div className="menu-mobile">
            <div
              className="menu-icon d-flex align-items-center"
              onClick={e => {
                this.ClickToMenu();
              }}
            >
              <img
                className="m-auto"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA4SURBVFhH7dOxCQAADAJB9186WUCwMZDiD760VAA+muMiN2oGIHLXaRa5UTMAkbtOs8iNmgH4RFrzpY9xuWJl5QAAAABJRU5ErkJggg=="
              />
            </div>
            <div className="logo">CE Solutions</div>
            <NavLink exact={true} activeClassName="active" className="icon-bell" to="/notifications">
              {/* <NavLink  className={`p-3 icon-bell ${this.toggleProfile ? "active" : ""}`} id="profile" onClick={() => this.toggleProfileMenu()}> */}
              <CeIcon.BellIcon />
              {/* <img src={Bell} /> */}
            </NavLink>
            {this.toggleProfile && <ProfileMenu handleLogout={this.handleLogout} />}
          </div>
        ) :
          <div className="menu-mobile__no-login d-block d-md-none">
            <div className="logo">CE Solutions</div>
          </div>
        }
        <div className="menu-web">
          <div className="logo d-none d-md-block">CE Solutions</div>
          {authStore.logged && (
            <div className="menu-router">
              <NavLink className="p-4" id="map" to="/map">
                Map
              </NavLink>
              <NavLink className="p-4" id="job" to="/job">
                Job List
              </NavLink>
              {authStore.canAccessWorker() &&
                <NavLink className="p-4" id="workers" to="/workers">
                  Workers
              </NavLink>
              }
              {authStore.canAccessSubContractor() &&
                <NavLink className="p-4" id="subcontractors" to="/subcontractors">
                  <span>Subcontractors</span>
                </NavLink>
              }
              <NavLink className="p-4" id="timesheets" to="/timesheets">
                Timesheets
              </NavLink>
              {authStore.canAccessInvoice() &&
                <NavLink className="p-4" id="invoices" to="/invoices">Invoices
              </NavLink>}

            </div>
          )}
          {authStore.logged && (
            <div className="header-action d-flex align-items-center mr-2">
              <a
                className={`p-3 ${this.toggleNotificationMenu ? 'active' : ''}`}
                id="notifications"
                onClick={(e) => this.toggleNotification(e)}
              >
                {notificationStore.hasReadNotification ? (
                  <CeIcon.BellIcon />
                ) : (
                    <CeIcon.BellSolidIcon />
                  )}
              </a>
              {authStore.canAccessRoles() &&
                <a className="p-3" id="roles" href="/roles">
                  {this.activeRole ? (
                    <CeIcon.CogwheelWhiteIcon />
                  ) : (
                      <img src={Cogwheel} />
                    )}
                </a>
              }
              <div
                className={`p-3 user-icon ${this.toggleProfile ? 'active' : ''
                  }`}
                id="profile"
                onClick={() => this.toggleProfileMenu()}
              >
                {this.activeUser ? (
                  <CeIcon.UserWhite></CeIcon.UserWhite>
                ) : (
                    <CeIcon.UserIcon></CeIcon.UserIcon>
                  )}
              </div>
              {this.toggleNotificationMenu && <NotificationInMenu handleOuteSiteClick={this.handleOuteSiteClick} />}
              {this.toggleProfile && <ProfileMenu handleLogout={this.handleLogout} />}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default MenuCE;
