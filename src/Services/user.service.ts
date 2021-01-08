import { authAPI } from './API';
import { User } from '../Models/APITypes';
import { APPROVE } from '../Constants/user';

export class UserService {
  authAPI = authAPI;

  async signup(user: User, { history }) {
    try {
      await this.authAPI.signup(user);
      history.push('/signup/success', { email: user.email });
    } catch (error) {
    
    }
  }

  userStatus(user: User): string {
    const { isActive, isApproved } = user;
    switch (true) {
      case !isActive || isApproved === APPROVE.rejected:
        return 'Inactive';
      case isApproved === APPROVE.approved:
        return 'Active';
      default:
        return 'Onhold';
    }
  }

  serialize(user: any) {
    const {
      firstName, lastName,
      // subcontractor: { user: subcontractorUser } = { user: undefined },
      subcontractor,
    } = user;
    // const subcontractor = subcontractorUser ? this.serialize(subcontractorUser) : { name: '' };

    // return {
    //   ...user,
    //   subcontractor,
    //   status: this.userStatus(user),
    //   name: `${firstName} ${lastName}`,
    //   subcontractor_name: subcontractor.name,
    // };
    return {
      ...user,
      subcontractor,
      subcontractor_name: subcontractor,
    };
  }
}

export const userService = new UserService();
