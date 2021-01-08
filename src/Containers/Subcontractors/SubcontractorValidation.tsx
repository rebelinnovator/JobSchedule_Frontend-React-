import * as Yup from 'yup';

export const CreateSubcontractorValidation = Yup.object().shape({
  firstName: Yup.string()
    .required('First Name is required'),
  lastName: Yup.string()
    .required('First Name is required'),
  phoneNumber: Yup.number()
    .required('Phone Number is required')
    .min(10, 'Phone Number is too short'),
  companyName: Yup.string()
    .required('Company Name is required')
    .min(2, 'Company Name is too short'),
  email: Yup.string()
    .required('Email is required')
});
