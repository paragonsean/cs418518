"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { registerSchema } from "../../../validation/schemas";
import { useRouter } from "next/navigation";

// hooks
import useAuth from "../../../hooks/useAuth";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  password_confirmation: "",
};

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { handleRegister, error } = useAuth();
  const router = useRouter();

  const formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const data = await handleRegister({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });

      console.log("Registration Response:", data);
      if (data.status === "success") {
        setSuccessMessage(
          "✅ Registration successful! Please check your email to verify your account.",
        );
      } else {
        data.message && setErrorMessage(data.message);
      }

      setLoading(false);
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {successMessage ? (
          // ✅ Show success message instead of form after registration
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Check Your Email 📩</h2>
            <p className="text-gray-700 mb-4">{successMessage}</p>
            <p className="text-sm text-gray-600">
              Already verified?{" "}
              <Link
                href="/account/login"
                className="text-indigo-500 hover:text-indigo-600"
              >
                Login
              </Link>
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            <form onSubmit={formik.handleSubmit}>
              {/* First Name */}
              <div className="mb-4">
                <label htmlFor="firstName" className="block font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  className="w-full border-gray-300 rounded-md shadow-xs p-2 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-200"
                  placeholder="Enter your first name"
                />
                {formik.errors.firstName && (
                  <div className="text-sm text-red-500 px-2">
                    {formik.errors.firstName}
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div className="mb-4">
                <label htmlFor="lastName" className="block font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  className="w-full border-gray-300 rounded-md shadow-xs p-2 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-200"
                  placeholder="Enter your last name"
                />
                {formik.errors.lastName && (
                  <div className="text-sm text-red-500 px-2">
                    {formik.errors.lastName}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className="w-full border-gray-300 rounded-md shadow-xs p-2 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-200"
                  placeholder="Enter your email"
                />
                {formik.errors.email && (
                  <div className="text-sm text-red-500 px-2">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label htmlFor="password" className="block font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  className="w-full border-gray-300 rounded-md shadow-xs p-2 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-200"
                  placeholder="Enter your password"
                />
                {formik.errors.password && (
                  <div className="text-sm text-red-500 px-2">
                    {formik.errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label
                  htmlFor="password_confirmation"
                  className="block font-medium mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formik.values.password_confirmation}
                  onChange={formik.handleChange}
                  className="w-full border-gray-300 rounded-md shadow-xs p-2 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-200"
                  placeholder="Confirm your password"
                />
                {formik.errors.password_confirmation && (
                  <div className="text-sm text-red-500 px-2">
                    {formik.errors.password_confirmation}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-3 focus:ring-indigo-200 disabled:bg-gray-400"
                disabled={loading || formik.isSubmitting}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            {/* Error Message */}
            {errorMessage && (
              <div className="text-sm text-red-500 font-semibold px-2 text-center mt-2">
                {errorMessage}
              </div>
            )}

            {/* Redirect to Login */}
            <p className="text-sm text-gray-600 p-1 text-center">
              Already a user?{" "}
              <Link
                href="/account/login"
                className="text-indigo-500 hover:text-indigo-600"
              >
                Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
