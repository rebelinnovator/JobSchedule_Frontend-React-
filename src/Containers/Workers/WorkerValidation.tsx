import * as Yup from 'yup';

export const WorkerValidation = Yup.object().shape({
  email: Yup.string()
    .required('Email is required'),
  name: Yup.string()
    .required('First Name is required')
    .test(
      'coned fullName',
      'Full name should contain First name and Last name',
      value => value && value.split(' ').length === 2),
  phoneNumber: Yup.number()
    .required('Phone Number is required')
    .min(10, 'Phone Number is too short'),
  subcontractorId: Yup.string().notRequired(),
  password: Yup.string().min(6).notRequired().label('Password'),
});

export const AssignWorkersValidation = Yup.array().of(Yup.object().shape({
  startDate: Yup.date().required('Start date is a required field'),
  location: Yup.object().shape({
    lat: Yup.number().required('Location is a required field'),
    lng: Yup.number().required('Location is a required field'),
    address: Yup.string().required('Location is a required field'),
  })
    .required('Location is a required field'),
  worker: Yup.object().required('Worker is a required field'),
  subcontractorId: Yup.string().notRequired(),
  subcontractor: Yup.object().notRequired(),
}));
