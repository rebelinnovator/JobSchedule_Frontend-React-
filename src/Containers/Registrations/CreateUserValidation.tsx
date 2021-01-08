import * as Yup from 'yup';

export const CreateUserValidation = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .test('coned email', 'Email address must be Coned\'s email', value => value && value.endsWith('@coned.com')),
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
  roles: Yup.array().required(),
});

export const forgotPasswordValidation = Yup.object().shape({
  email: Yup.string()
    .required('Email is required'),
});

export const restorePasswordValidation = Yup.object().shape({
  token: Yup.string().length(32, 'Wrong restore token')
    .required('Token is required'),
  password: Yup.string()
    .notRequired()
    .min(6, 'Password is too short'),
  repeatPassword: Yup.string()
    .notRequired()
    .oneOf([Yup.ref('password'), null], 'Repeat password must be same with password')
    .min(6, 'Repeat password is too short'),
});