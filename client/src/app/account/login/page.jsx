"use client";

import Link from "next/link";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginSchema } from "../../../validation/schemas";

// hooks
import useAuth from "@/hooks/use_auth";
import usePassword from "@/hooks/use_password";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  const { handleLogin } = useAuth();
  const { handleVerifyOTP } = usePassword();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      otp: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      setErrorMessage("");

      try {
        if (step === 1) {
          // Step 1: Login
          const res = await handleLogin({
            email: values.email,
            password: values.password,
          });

          if (res.status === "pending_otp") {
            setStep(2); // Proceed to OTP input
          } else if (res.status === "success") {
            router.push("/user/dashboard"); // Skip OTP if not required
          } else {
            setErrorMessage(res.message || "Login failed.");
          }
        } else {
          // Step 2: Verify OTP
          const res = await handleVerifyOTP(values.email, values.otp);

          if (res.status === "success") {
            router.push("/user/dashboard");
          } else {
            setErrorMessage(res.message || "OTP verification failed.");
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrorMessage("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {step === 1 ? "Login" : "Enter OTP"}
        </h2>

        <form onSubmit={formik.handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter your email"
              disabled={step === 2}
            />
            {formik.errors.email && formik.touched.email && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
            )}
          </div>

          {/* Password */}
          {step === 1 && (
            <div className="mb-6">
              <label htmlFor="password" className="block font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Enter your password"
              />
              {formik.errors.password && formik.touched.password && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>
          )}

          {/* OTP */}
          {step === 2 && (
            <div className="mb-6">
              <label htmlFor="otp" className="block font-medium mb-1">
                One-Time Password (OTP)
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formik.values.otp}
                onChange={formik.handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="Enter OTP"
              />
              {formik.errors.otp && formik.touched.otp && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.otp}</div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || formik.isSubmitting}
            className={`w-full py-2 text-white font-semibold rounded transition ${
              step === 1
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-green-500 hover:bg-green-600"
            } ${loading ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {loading ? "Processing..." : step === 1 ? "Login" : "Verify OTP"}
          </button>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 mt-4 text-center">{errorMessage}</div>
          )}
        </form>

        {/* Navigation Links */}
        {step === 1 && (
          <p className="text-sm text-gray-600 mt-4 text-center">
            <Link
              href="/account/send-password-reset-email"
              className="text-indigo-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </p>
        )}

        <p className="text-sm text-gray-600 mt-2 text-center">
          Not a User?{" "}
          <Link
            href="/account/register"
            className="text-indigo-500 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
