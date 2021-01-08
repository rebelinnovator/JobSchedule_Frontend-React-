import * as Yup from 'yup';

const job = Yup.object().shape({
  jobType: Yup.number().required().label('Job type'),
  requestTime: Yup.date().required().label('Request Date'),
  endTime: Yup.date().notRequired().label('End Time'),
  requestor: Yup.object().required().label('Requestor'),
  supervisor: Yup.object().required().label('Supervisor'),
  department: Yup.object().required().label('Department'),
  section: Yup.string().required().label('Section'),
  municipality: Yup.object().required().label('Municipality'),
  po: Yup.number().notRequired().label('PO'),
  feeder: Yup.number().notRequired().label('Feeder'),
  account: Yup.number().notRequired().label('Account'),
  maxWorkers: Yup.number().required().label('Max Workers'),
  locations: Yup.array().required().label('Locations'),
  comment: Yup.string().notRequired().label('Comment'),
  workers: Yup.array().notRequired().label('Workers'),
});

export const JobCreateValidation = Yup.object().shape({
  title: Yup.string().notRequired().label('Title'),
  totalPo: Yup.string().notRequired().label('PO'),
  jobs: Yup.array().of(job),
});

export const JobEditValidation = Yup.object().shape({
  jobType: Yup.number().notRequired(),
  requestTime: Yup.date().notRequired(),
  endTime: Yup.date().notRequired(),
  requestor: Yup.string().notRequired(),
  supervisor: Yup.string().notRequired(),
  department: Yup.string().notRequired(),
  section: Yup.string().notRequired(),
  po: Yup.string().notRequired(),
  feeder: Yup.string().notRequired(),
  address: Yup.string().notRequired(),
  lat: Yup.string().notRequired(),
  lng: Yup.string().notRequired(),
  comment: Yup.string().notRequired(),
  workers: Yup.array().notRequired(),

  jobStatus: Yup.string().notRequired(),
});

export const CreateApointerJobValudation = Yup.object().shape({
  job: Yup.object().required().label('Job'),
  startDate: Yup.date().required().label('Start Date'),
  location: Yup.object().shape({
    address: Yup.string().notRequired(),
    lat: Yup.number().notRequired(),
    lng: Yup.number().notRequired(),
  }).label('Locations').required(),
});
