import * as Yup from 'yup';

export const LoginValidation = Yup.object().shape({
  email: Yup.string()
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password is too short'),
});
