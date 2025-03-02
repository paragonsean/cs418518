"use client";
import Cookies from "js-cookie";
import { useState } from "react";
import urlJoin from "url-join";
import publicRequest from "../utils/publicRequest";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
const authUrl = urlJoin(baseUrl, "api/user");

const useProfile = () => {
  const [error, setError] = useState(null);

  // 🔐 Change Password
  const handleChangePassword = async (values) => {
    setError(null); // Reset error before new request
    const changePasswordUrl = urlJoin(authUrl, "/changepassword");

    try {
      const token = Cookies.get("jwt-token");
      if (!token) throw new Error("No token found");

      const response = await publicRequest(
        changePasswordUrl,
        "POST",
        values,
        token
      );

      if (response.status !== "success") {
        setError(response.message || "Failed to change password");
        return { status: "error", message: response.message };
      }

      return { status: "success", message: "Password changed successfully" };
    } catch (error) {
      setError("An error occurred while changing password");
      return { status: "error", message: String(error) };
    }
  };

  // Get User Profile
  const getProfile = async () => {
    const token = Cookies.get("jwt-token");
    if (!token) {
      console.error("No JWT Token found in cookies!");
      return { status: "error", message: "No token found" };
    }

    try {
      console.log("📤 Sending profile request with token:", token);
      const profileUrl = urlJoin(authUrl, "loggeduser");
      const data = await publicRequest(profileUrl, "GET", null, token);

      console.log("Profile Response:", data);
      return data;
    } catch (error) {
      console.error("Get profile error:", error);
      return { status: "error", message: "Failed to fetch profile" };
    }
  };

  // ✏️ Update User Profile
  const updateProfile = async (values) => {
    const updateUrl = "/api/user/updateprofile";
    try {
      const token = Cookies.get("jwt-token");
      if (!token) throw new Error("No token found");
  
      const response = await publicRequest(updateUrl, "PUT", values, token);
      return response;
    } catch (error) {
      console.error("Profile update error:", error);
      return { status: "error", message: String(error) };
    }
  };
  

  return {
    error,
    getProfile,
    handleChangePassword,
    updateProfile,
    setError, // Exposing setError for better handling
  };
};

export default useProfile;
