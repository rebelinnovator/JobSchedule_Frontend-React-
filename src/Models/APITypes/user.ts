export type User = {
  firstName?: string,
  lastName?: string,
  email?: string,
  departments?: string,
  roles?: string,
  password?: string;
  repeatPassword?: string;
  phoneNumer?: string;
  subcontractor_id?: string|number;
  subcontractor?: string|number;
  status?: string;
  isApproved?: number;
  isActive?: boolean;
  employee?: string;
  hasmessage?: boolean;
  id?: string;
};
