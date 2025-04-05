"use client";
import Cookies from "js-cookie";
import { useState } from "react";
import urlJoin from "url-join";
import publicRequest from "../utils/publicRequest";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
const authUrl = urlJoin(baseUrl, "api/user");

const useProfile = () => {
  const [error, setError] = useState(null);

  const getToken = () => Cookies.get("authToken");

  // Change Password
  const handleChangePassword = async (values) => {
    setError(null);
    const token = getToken();
    if (!token) return { status: "error", message: "No token found" };

    const url = urlJoin(authUrl, "changepassword");

    try {
      const response = await publicRequest(url, "POST", values, token);
      if (response.status !== "success") {
        setError(response.message || "Failed to change password");
        return { status: "error", message: response.message };
      }
      return { status: "success", message: "Password changed successfully" };
    } catch (err) {
      setError("An error occurred while changing password");
      return {
        status: "error",
        message: err?.response?.data?.message || err.message || "Unexpected error",
      };
    }
  };

  // Get User Profile
  const getProfile = async () => {
    const token = getToken();
    if (!token) return { status: "error", message: "No token found" };

    const url = urlJoin(authUrl, "loggeduser");

    try {
      const response = await publicRequest(url, "GET", null, token);
      if (response.status === "success" && response.user) {
        return { status: "success", user: response.user };
      } else {
        return {
          status: "error",
          message: response.message || "Unable to load user data",
        };
      }
    } catch (err) {
      return {
        status: "error",
        message: err?.response?.data?.message || "Failed to fetch profile",
      };
    }
  };

  // Update User Profile
  const updateProfile = async (values) => {
    const token = getToken();
    if (!token) return { status: "error", message: "No token found" };

    const url = urlJoin(authUrl, "updateprofile");

    try {
      const response = await publicRequest(url, "PUT", values, token);
      return response;
    } catch (err) {
      return {
        status: "error",
        message: err?.response?.data?.message || err.message || "Update failed",
      };
    }
  };

  return {
    error,
    getProfile,
    handleChangePassword,
    updateProfile,
    setError,
  };
};

export default useProfile;
