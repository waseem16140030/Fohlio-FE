import * as yup from "yup";
export const userSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^\+?[0-9]{10,15}$/, "Invalid phone number"),
  country: yup.string().required("Country is required"),
  role: yup.string().required("Role is required"),
  status: yup.string().required("Status is required"),
});
