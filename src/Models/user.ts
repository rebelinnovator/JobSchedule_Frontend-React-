export class User {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  isActive: boolean;
  phoneNumber: string;
  isApproved: number;
  departments: any[];
  activateToken?: string;
  avatar?: any;
  roles: number[];
  subcontractorName: string;
  subcontractorInfo: any;
  enableNotification?: boolean;
  notification?: number[];
  workerTypes: number[];
  workerTypesDefault: any[];
  constructor() {
    this.departments = [];
    this.roles = [];
  }
}

class Avatar {
  id: number;
  contentType: string;
  path: string;
}
