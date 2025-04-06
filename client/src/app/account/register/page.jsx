"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { registerSchema } from "../../../validation/schemas";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useAuth from "@/hooks/use_auth";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  password_confirmation: "",
  recaptchaToken: "", // Add a field to store the recaptcha token
};

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]); // Track multiple errors
  const [successMessage, setSuccessMessage] = useState("");
  const { handleRegister, error } = useAuth();
  const router = useRouter();
  const [recaptchaResponse, setRecaptchaResponse] = useState(""); // Store reCAPTCHA response

  useEffect(() => {
    // Dynamically load the reCAPTCHA v3 script
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Cleanup when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      setErrors([]); // Clear previous errors
      setSuccessMessage("");

      // Verify reCAPTCHA v3 and get the token
      const recaptchaToken = await new Promise((resolve, reject) => {
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => {
            window.grecaptcha
              .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
                action: "register", // Action for registration
              })
              .then(resolve)
              .catch(reject);
          });
        } else {
          reject("reCAPTCHA not loaded");
        }
      });

      // Add reCAPTCHA token to form values
      values.recaptchaToken = recaptchaToken;

      const data = await handleRegister(values);

      if (data.status === "success") {
        setSuccessMessage("Registration successful! Please check your email.");
        setErrors([]);

        // Show success toast notification
        toast.success(
          "🎉 Registration successful! Check your email to verify your account."
        );

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/account/login");
        }, 3000);
      } else {
        const errorMessages = Array.isArray(data.errors)
          ? data.errors
          : [data.message];
        setErrors(errorMessages);

        // Show error toast notifications
        errorMessages.forEach((err) => {
          toast.error(`${err}`);
        });
      }

      setLoading(false);
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (error) {
      setErrors([error]);
      toast.error(` ${error}`);
    }
  }, [error]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {successMessage ? (
          // Show success message instead of form after registration
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
                  onBlur={formik.handleBlur}
                  className="w-full border-gray-300 rounded-md shadow-xs p-2 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-200"
                  placeholder="Enter your first name"
                />
                {formik.touched.firstName && formik.errors.firstName && (
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
                  onBlur={formik.handleBlur}
                  className="w-full border-gray-300 rounded-md shadow-xs p-2 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-200"
                  placeholder="Enter your last name"
                />
                {formik.touched.lastName && formik.errors.lastName && (
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
                  onBlur={formik.handleBlur}
                  className="w-full border-gray-300 rounded-md shadow-xs p-2 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-200"
                  placeholder="Enter your email"
                />
                {formik.touched.email && formik.errors.email && (
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
                  onBlur={formik.handleBlur}
                  className="w-full border-gray-300 rounded-md shadow-xs p-2 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-200"
                  placeholder="Enter your password"
                />
                {formik.touched.password && formik.errors.password && (
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
                  onBlur={formik.handleBlur}
                  className="w-full border-gray-300 rounded-md shadow-xs p-2 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-200"
                  placeholder="Confirm your password"
                />
                {formik.touched.password_confirmation &&
                  formik.errors.password_confirmation && (
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

            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="text-sm text-red-500 font-semibold px-2 text-center mt-2">
                {errors.map((err, index) => (
                  <p key={index}>{err}</p>
                ))}
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
