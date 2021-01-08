import * as Yup from 'yup';

export const RoleValidation = Yup.object().shape({
  email: Yup.string()
    .required('Email is required'),
  name: Yup.string()
    .required('First Name is required')
    .test(
      'coned fullName',
      'Full name should contain First name and Last name',
      value => value && value.split(' ').length === 2),
  roles: Yup.array().min(1).required('Role is required'),
  departments: Yup.array().notRequired(),
  password: Yup.string().min(6).notRequired().label('Password'),
});

