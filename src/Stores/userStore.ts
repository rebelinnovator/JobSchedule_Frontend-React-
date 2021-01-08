import { observable, action, computed } from 'mobx';
import { DepartmentViewModel } from '../Models/departmentViewModel';
import { RoleViewModel } from '../Models/roleViewModel';
import { userAPI } from '../Services/API';
import { User } from '../Models';
import authStore from './authStore';

const emptyPagination = { page: 1, totalPage: 0, total: 0, limit: 10 };

class UserStore {
  @observable Departments: Array<DepartmentViewModel>;
  @observable Roles: Array<RoleViewModel>;
  @observable users: User[];
  @observable userLoader = emptyPagination;
  @observable user: User;
  @observable me: User;

  constructor() {
    this.loadRoles();
    this.loadDepartment();
    this.loadMe();
    this.users = [];
    this.user = new User();
    this.me = new User();
  }

  @action async updateUserApprove(id: string, approv: number) {
    await userAPI.approve(id, approv);
    this.users = this.users.map((user: User) => {
      if (user.id === id) {
        return {
          ...user,
          isApproved: approv,
        };
      }
      return user;
    });
  }

  @action async deleteUser(id: string) {
    await userAPI.delete(id);
    this.users = this.users.filter((user: User) => user.id !== id);
  }

  @action async loadUser(id: string) {
    const { data: user } = await userAPI.user(id);

    if (!user) {
      this.user = new User();
    }
    this.user = user as User;
  }

  @action async loadMe() {
    if (authStore.logged) {
      const { data: user } = await userAPI.me();
      if (!user) {
        this.me = new User();
      }
      this.me = user as User;
    }
  }

  @action updateMeLocal(me: User) {
    this.me = {
      ...this.me,
      ...me,
    };
  }

  @action async loadUsers(params: any = {}) {
    const {
      data: { results, page, totalPage, total, limit },
    } = await userAPI.users(params);
    if (!results) {
      this.users = [];
      return;
    }

    this.users = results as User[];
    this.userLoader = { page, totalPage, total, limit };
  }

  @action loadDepartment = async () => {
    if (this.Departments == null) {
      this.Departments = new Array<DepartmentViewModel>();
      const { data } = await userAPI.departments();
      if (data.length > 0) {
        data.forEach((department) => {
          this.Departments.push(department as DepartmentViewModel);
        });
      }
    }
  };

  @action loadRoles = async () => {
    if (this.Roles == null) {
      this.Roles = new Array<RoleViewModel>();
      const { data } = await userAPI.roles();
      if (data.length > 0) {
        data.forEach((role) => {
          this.Roles.push(role as RoleViewModel);
        });
      }
    }
  };

  // @action async importUsersExcel(file: File) {
  //   let fd = new FormData();
  //   fd.append('excel', file);

  //   await userAPI.importExcel(fd);
  //   this.users = this.users.map((user: User) => {
  //     return user;
  //   });
  // }
}
export default new UserStore();
