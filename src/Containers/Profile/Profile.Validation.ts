import * as Yup from 'yup';

export const ProfileEditValidation = Yup.object().shape({
  email: Yup.string().notRequired(),
  name: Yup.string().notRequired(),
  phoneNumber: Yup.number()
    .notRequired()
    .min(10, 'Phone Number is too short'),
  department: Yup.object().shape({
    id: Yup.string(),
    name: Yup.string(),
  }).notRequired().nullable(),
  password: Yup.string()
    .notRequired()
    .min(6, 'Password is too short'),
  repeatPassword: Yup.string()
    .notRequired()
    .oneOf([Yup.ref('password'), null], 'Repeat password must be same with password')
    .min(6, 'Repeat password is too short'),
});
