"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import publicRequest from "../../../../utils/public_request";
import ReCaptcha from "@/components/re_captcha"; // Assuming ReCaptcha component is here

const ResetPassword = () => {
  const router = useRouter();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Ensure reCAPTCHA token is available before proceeding
    if (!recaptchaToken) {
      setMessage("Please verify that you are not a robot.");
      setLoading(false);
      return;
    }

    try {
      const res = await publicRequest(
        `/api/user/reset-password/${token}`,
        "POST",
        { newPassword: password, recaptchaToken }  // Send reCAPTCHA token with the password
      );

      if (res.status === "success") {
        setMessage("Password reset successfully! Redirecting...");
        setTimeout(() => router.push("/account/login"), 3000);
      } else {
        setMessage(res.message);
      }
    } catch (error) {
      setMessage("Error resetting password.");
    }

    setLoading(false);
  };

  const handleRecaptchaTokenReceived = (token) => {
    setRecaptchaToken(token); // Store the reCAPTCHA token
  };

  useEffect(() => {
    // Add any necessary side-effects for reCAPTCHA if needed
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="w-full p-2 mb-4 border rounded-sm"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded-sm"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {message && <p className="mt-4 text-gray-700">{message}</p>}

        {/* Include ReCaptcha component */}
        <ReCaptcha action="reset_password" onTokenReceived={handleRecaptchaTokenReceived} />
      </div>
    </div>
  );
};

export default ResetPassword;
