import * as Yup from "yup";

// Shared password validation rule
const strongPassword = Yup.string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
    "Password must include uppercase, lowercase, number, and special character"
  );

// Optional version (for optional password fields like update profile)
const optionalStrongPassword = Yup.string()
  .min(8, "Password must be at least 8 characters")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
    "Password must include uppercase, lowercase, number, and special character"
  )
  .notRequired();

//  Registration Schema
export const registerSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  password: strongPassword,
  password_confirmation: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

//  Login Schema
export const loginSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  password: Yup.string().required("Password is required"),
});

//  Reset Password Request (Send Link)
export const resetPasswordLinkSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
});

//  Reset Password Schema
export const resetPasswordSchema = Yup.object({
  password: strongPassword,
  password_confirmation: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

//  Verify Email OTP Schema
export const verifyEmailSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  otp: Yup.string().required("OTP is required"),
});

//  Change Password Schema
export const changePasswordSchema = Yup.object({
  password: strongPassword,
  password_confirmation: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

//  Update Profile Schema (Name & Optional Password)
export const updateProfileSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  password: optionalStrongPassword,
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .notRequired(),
});
