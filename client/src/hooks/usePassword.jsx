"use client";
import Cookies from "js-cookie";
import { useState } from "react";
import urlJoin from "url-join";
import publicRequest from "../utils/publicRequest";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
const authUrl = urlJoin(baseUrl, "api/user");

const usePassword = () => {
  const [error, setError] = useState(null);

  // 🔗 Request Reset Password Link
  const handleResetPasswordLink = async (email) => {
    const resetPasswordLinkUrl = urlJoin(authUrl, "/send-reset-password-email");
    try {
      const data = await publicRequest(resetPasswordLinkUrl, "POST", { email });
      if (data.status !== "success") {
        setError(data.message || "Failed to send reset password link");
        return { status: "error", message: data.message };
      }
      setError(null);
      return { status: "success", message: "Reset link sent successfully!" };
    } catch (error) {
      setError("Error sending reset password link.");
      return { status: "error", message: String(error) };
    }
  };

  // 🔑 Reset Password
  const handleResetPassword = async (id, token, newPassword) => {
    const resetPasswordUrl = urlJoin(authUrl, `/reset-password/${id}/${token}`);
    try {
      const data = await publicRequest(resetPasswordUrl, "POST", {
        newPassword,
      });
      if (data.status !== "success") {
        setError(data.message || "Failed to reset password");
        return { status: "error", message: data.message };
      }
      setError(null);
      return { status: "success", message: "Password reset successfully!" };
    } catch (error) {
      setError("Error resetting password.");
      return { status: "error", message: String(error) };
    }
  };

  // 🔄 Change Password (Authenticated User)
  const handleChangePassword = async (values) => {
    const changePasswordUrl = urlJoin(authUrl, "/changepassword");
    try {
      const token = Cookies.get("jwt-token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await publicRequest(
        changePasswordUrl,
        "POST",
        values,
        token,
      );
      if (response.status !== "success") {
        setError(response.message || "Failed to change password");
        return { status: "error", message: response.message };
      }
      return { status: "success", message: "Password changed successfully!" };
    } catch (error) {
      setError("Error changing password.");
      return { status: "error", message: String(error) };
    }
  };

  // 🔐 Verify OTP
  const handleVerifyOTP = async (email, otp) => {
    try {
      const response = await publicRequest(
        urlJoin(authUrl, "/verify-otp"),
        "POST",
        { email, otp },
      );
      if (response.status === "success") {
        Cookies.set("jwt-token", response.token, {
          secure: true,
          sameSite: "Strict",
        });
        return { status: "success", message: "OTP Verified!" };
      } else {
        setError(response.message);
        return { status: "error", message: response.message };
      }
    } catch (error) {
      setError("Error verifying OTP.");
      return { status: "error", message: String(error) };
    }
  };

  return {
    error,
    handleResetPasswordLink,
    handleResetPassword,
    handleVerifyOTP,
    handleChangePassword,
    setError, // Exposed for better error handling
  };
};

export default usePassword;
