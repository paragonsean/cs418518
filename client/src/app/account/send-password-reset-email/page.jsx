"use client";

import { useState } from "react";
import publicRequest from "@/utils/public_request";
import ReCaptcha from "@/components/re_captcha"; // Assuming ReCaptcha component is here

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
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
        "/api/user/send-reset-password-email",
        "POST",
        { email, recaptchaToken }  // Send reCAPTCHA token with the email
      );

      if (res.status === "success") {
        setMessage("Reset link sent! Check your email.");
      } else {
        setMessage(" " + res.message);
      }
    } catch (error) {
      setMessage("Error sending reset link.");
    }

    setLoading(false);
  };

  const handleRecaptchaTokenReceived = (token) => {
    setRecaptchaToken(token); // Store the reCAPTCHA token
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="w-full p-2 mb-4 border rounded-sm"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-sm"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {message && <p className="mt-4 text-gray-700">{message}</p>}

        {/* Include ReCaptcha component */}
        <ReCaptcha action="forgot_password" onTokenReceived={handleRecaptchaTokenReceived} />
      </div>
    </div>
  );
};

export default ForgotPassword;
