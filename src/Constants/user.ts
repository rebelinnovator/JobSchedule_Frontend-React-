interface IRole {
  role: string;
  name: string;
  id: number;
}

export const ROLES: IRole[] = [
  {
    role: 'requestor',
    name: 'Requestor',
    id: 1,
  },
  {
    role: 'department_supervisor',
    name: 'Department Supervisor',
    id: 2,
  },
  {
    role: 'coned_field_supervisor',
    name: 'ConEd Field Supervisor',
    id: 3,
  },
  {
    role: 'coned_billing_admin',
    name: 'ConEd Billing Admin (CBA)',
    id: 4,
  },
  {
    role: 'dispatcher',
    name: 'Dispatcher',
    id: 5,
  },
  {
    role: 'dispatcher_supervisor',
    name: 'Dispatcher Supervisor',
    id: 6,
  },
  {
    role: 'billing',
    name: 'Billing',
    id: 7,
  },
  {
    role: 'superadmin',
    name: 'SuperAdmin',
    id: 8,
  },
  {
    role: 'worker',
    name: 'Worker',
    id: 9,
  },
  {
    role: 'ces_field_supervisor',
    name: 'CES Field Supervisor',
    id: 10,
  },
  {
    role: 'subcontractor',
    name: 'Subcontractor',
    id: 11,
  },
];

export enum EROLES {
  requestor = 1,
  department_supervisor,
  coned_field_supervisor,
  coned_billing_admin,
  dispatcher,
  dispatcher_supervisor,
  billing,
  superadmin,
  worker,
  ces_field_supervisor,
  subcontractor,
}

export enum APPROVE {
  waiting = 0,
  approved = 1,
  rejected = 2,
}

export enum DEPARTMENT_GROUPS {
  CONSTRUCTION_SERVICE_GROUP,
  ELECTRIC_GROUP,
  GAS_PRESSURE_CONTROL_GROUP,
  TRANSMISSION_SERVICE,
};


export const DEPARTMENTS = [
  {
    id: 1,
    name: "Electric - Services",
    otBreak: false,
    group: DEPARTMENT_GROUPS.ELECTRIC_GROUP
  },
  {
    id: 2,
    name: "Electric - Equipment Groups Networks",
    otBreak: false,
    group: DEPARTMENT_GROUPS.ELECTRIC_GROUP
  },
  {
    id: 3,
    name: "Electric - Emergency",
    otBreak: false,
    group: DEPARTMENT_GROUPS.ELECTRIC_GROUP
  },
  {
    id: 4,
    name: "Electric - Bronx Underground/Cable",
    otBreak: false,
    group: DEPARTMENT_GROUPS.ELECTRIC_GROUP
  },
  {
    id: 5,
    name: "Electric - Bronx Overhead",
    otBreak: false,
    group: DEPARTMENT_GROUPS.ELECTRIC_GROUP
  },
  {
    id: 6,
    name: "Electric - Rye Overhead",
    otBreak: false,
    group: DEPARTMENT_GROUPS.ELECTRIC_GROUP
  },
  {
    id: 7,
    name: "Electric - Westchester Underground",
    otBreak: false,
    group: DEPARTMENT_GROUPS.ELECTRIC_GROUP
  },
  {
    id: 8,
    name: "Electric - Substation Maintenance",
    otBreak: false,
    group: DEPARTMENT_GROUPS.ELECTRIC_GROUP
  },
  {
    id: 9,
    name: "Electric - Environmental Operations/ Flush",
    otBreak: false,
    group: DEPARTMENT_GROUPS.ELECTRIC_GROUP
  },
  {
    id: 10,
    name: "Gas - Bronx",
    otBreak: true,
    group: DEPARTMENT_GROUPS.GAS_PRESSURE_CONTROL_GROUP
  },
  {
    id: 11,
    name: "Gas - Brooklyn",
    otBreak: false,
    group: DEPARTMENT_GROUPS.GAS_PRESSURE_CONTROL_GROUP
  },
  {
    id: 12,
    name: "Gas - Manhattan",
    otBreak: false,
    group: DEPARTMENT_GROUPS.GAS_PRESSURE_CONTROL_GROUP
  },
  {
    id: 13,
    name: "Gas - Westchester",
    otBreak: true,
    group: DEPARTMENT_GROUPS.GAS_PRESSURE_CONTROL_GROUP
  },
  {
    id: 14,
    name: "Gas - Staten Island",
    otBreak: false,
    group: DEPARTMENT_GROUPS.GAS_PRESSURE_CONTROL_GROUP
  },
  {
    id: 15,
    name: "Electric - SI Overhead",
    otBreak: true,
    group: DEPARTMENT_GROUPS.ELECTRIC_GROUP
  },
  {
    id: 16,
    name: "Electric - SI Underground",
    otBreak: true,
    group: DEPARTMENT_GROUPS.ELECTRIC_GROUP
  },
  {
    id: 17,
    name: "Electric - SI I&A",
    otBreak: true,
    group: DEPARTMENT_GROUPS.ELECTRIC_GROUP
  },
  {
    id: 18,
    name: "Pressure Control",
    otBreak: false,
    group: DEPARTMENT_GROUPS.GAS_PRESSURE_CONTROL_GROUP
  },
  {
    id: 19,
    name: "Construction Services",
    otBreak: false,
    group: DEPARTMENT_GROUPS.CONSTRUCTION_SERVICE_GROUP
  },
  {
    id: 20,
    name: "Transmission Services",
    otBreak: true,
    group: DEPARTMENT_GROUPS.TRANSMISSION_SERVICE
  },
  {
    id: 21,
    name: "Electric - Field Operations",
    otBreak: true,
    group: DEPARTMENT_GROUPS.ELECTRIC_GROUP
  },
  {
    id: 22,
    name: "Electric - East View Overhead",
    otBreak: true,
    group: DEPARTMENT_GROUPS.ELECTRIC_GROUP
  },
  {
    id: 23,
    name: "Electric - ICS",
    otBreak: true,
    group: DEPARTMENT_GROUPS.ELECTRIC_GROUP
  },
];

export enum ENOTIFICATIONS {
  job_created_email = 0,
  job_created_webpush = 1,
  job_first_assigned_worker_email = 2,
  job_first_assigned_worker_webpush = 3,
  job_PO_email = 4,
  job_PO_webpush = 5,
  job_has_been_modified_email = 6,
  job_has_been_modified_webpush = 7,
  new_job_reroute_email = 8,
  new_job_reroute_webpush = 9,
  current_job_reroute_email = 10,
  current_job_reroute_webpush = 11,
  worker_en_router_email = 12,
  worker_en_router_webpush = 13,
  worker_on_location_email = 14,
  worker_on_location_webpush = 15,
  worker_secured_site_email = 16,
  worker_secured_site_webpush = 17,
  worker_cannot_secured_site_email = 18,
  worker_cannot_secured_site_webpush = 19,
  worker_uploaded_image_email = 20,
  worker_uploaded_image_webpush = 21,
  worker_ended_shift_email = 22,
  worker_ended_shift_webpush = 23,
  worker_not_yet_enroute_email = 24,
  worker_not_yet_enroute_webpush = 25,
  invoice_available_email = 26,
  invoice_available_webpush = 27,
  invoice_number_reminder_emails_email = 28,
  invoice_number_reminder_emails_webpush = 29,
}

