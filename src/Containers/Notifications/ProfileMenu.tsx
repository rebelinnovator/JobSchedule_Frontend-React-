import { observer } from 'mobx-react';
import React from 'react';
import { ROLES } from '../../Constants/user';
import NextIcon from '../../Images/chevron-right-12.png';
import LogoutIcon from '../../Images/logout.png';
import UserImage from '../../Images/user.png';
import userStore from '../../Stores/userStore';

interface Props {
  handleLogout: Function;
}
@observer
export class ProfileMenu extends React.Component<Props> {

  renderRole = (role: number) => ROLES[role - 1] ? <span>{ROLES[role - 1].name}</span> : null;

  public render() {
    return (
      <div className="profile-menu">
        <div className="box-item p-0">
          <a href="/profile" className="profile-menu__user">
            <div className="profile-menu__info">
              <div className="avatar">
                <img src={`${process.env.REACT_APP_API_MEDIA}${userStore.me.avatar}`} alt="" />
              </div>
              <div className="profile-menu__name">
                <p className="title">{userStore.me.name}</p>
                <p className="categories">{userStore.me.roles.map(this.renderRole)}</p>
              </div>
            </div>
            <div className="profile-menu__link">
              <img src={NextIcon} />
            </div>
          </a>
          <div
            className="profile-menu__button"
            onClick={() => this.props.handleLogout()}
          >
            <img src={LogoutIcon} /> Log Out
          </div>
        </div>
      </div>
    );
  }
}
export default ProfileMenu;
