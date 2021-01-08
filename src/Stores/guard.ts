import { observable, action } from 'mobx';

export interface IGuard {
  logged: boolean;

  setLogin(): void;
}
class Guard implements IGuard {

  @observable logged: boolean;

  constructor() {

    this.logged = false;

  }
  @action.bound
    public setLogin() {
    this.logged = true;
  }

}
export const guard = new Guard();
