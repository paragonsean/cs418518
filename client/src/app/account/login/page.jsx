"use client";
import Link from "next/link";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginSchema } from "../../../validation/schemas";

// hooks
import useAuth from "../../../hooks/useAuth";
import usePassword from "../../../hooks/usePassword";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); //  Track login step (1 = password, 2 = OTP)
  const [errorMessage, setErrorMessage] = useState("");
  const { handleLogin } = useAuth(); //  Fix: Correct hook usage
  const { handleVerifyOTP } = usePassword(); //  Fix: Correct hook usage
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
      setErrorMessage(""); //  Clear previous errors

      if (step === 1) {
        //  Step 1: Login with email & password
        const data = await handleLogin({
          email: values.email,
          password: values.password,
        });

        if (data.status === "pending_otp") {
          setStep(2); //  Proceed to OTP input
        } else {
          setErrorMessage(data.message);
        }
      } else {
        //  Step 2: Verify OTP
        const data = await handleVerifyOTP(values.email, values.otp); //  Fix: Ensure correct call

        if (data.status === "success") {
          router.push("/user/dashboard"); //  Redirect after successful login
        } else {
          setErrorMessage(data.message);
        }
      }

      setLoading(false);
      setSubmitting(false);
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {step === 1 ? "Login" : "Enter OTP"}
        </h2>

        <form onSubmit={formik.handleSubmit}>
          {/* Email Field */}
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
              className="w-full border-gray-300 rounded-md shadow-xs focus:border-indigo-500 focus:ring-3 focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              placeholder="Enter your email"
              disabled={step === 2} //  Disable after step 1
            />
            {formik.errors.email && (
              <div className="text-red-500">{formik.errors.email}</div>
            )}
          </div>

          {/* Password Field (Step 1 Only) */}
          {step === 1 && (
            <div className="mb-6">
              <label htmlFor="password" className="block font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                className="w-full border-gray-300 rounded-md shadow-xs focus:border-indigo-500 focus:ring-3 focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                placeholder="Enter your password"
              />
              {formik.errors.password && (
                <div className="text-red-500">{formik.errors.password}</div>
              )}
            </div>
          )}

          {/* OTP Input Field (Step 2 Only) */}
          {step === 2 && (
            <div className="mb-6">
              <label htmlFor="otp" className="block font-medium mb-2">
                One-Time Password (OTP)
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formik.values.otp}
                onChange={formik.handleChange}
                className="w-full border-gray-300 rounded-md shadow-xs focus:border-indigo-500 focus:ring-3 focus:ring-green-200 focus:ring-opacity-50 p-2"
                placeholder="Enter OTP"
              />
              {formik.errors.otp && (
                <div className="text-red-500">{formik.errors.otp}</div>
              )}
            </div>
          )}

          {/* Login / Verify OTP Button */}
          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white ${
              step === 1
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-green-500 hover:bg-green-600"
            } focus:outline-hidden focus:ring-3 disabled:bg-gray-400`}
            disabled={loading || formik.isSubmitting}
          >
            {loading ? "Processing..." : step === 1 ? "Login" : "Verify OTP"}
          </button>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 mt-2">{errorMessage}</div>
          )}
        </form>

        {/* Forgot Password */}
        {step === 1 && (
          <p className="text-sm text-gray-600 p-1">
            <Link
              href="/account/send-password-reset-email"
              className="text-indigo-500 hover:text-indigo-600"
            >
              Forgot Password?
            </Link>
          </p>
        )}

        {/* Register */}
        <p className="text-sm text-gray-600 p-1">
          Not a User?{" "}
          <Link
            href="/account/register"
            className="text-indigo-500 hover:text-indigo-600"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
