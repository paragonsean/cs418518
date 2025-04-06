"use client";
import Cookies from "js-cookie";
import { useState } from "react";
import urlJoin from "url-join";
import logger from "@/utils/my_logger";
import publicRequest from "@/utils/public_request";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

const useAuth = () => {
  const [error, setError] = useState(null);
  const authUrl = urlJoin(baseUrl, "/api/user");

  // ✅ Shared helper to safely get reCAPTCHA token
  const getRecaptchaToken = async (action) => {
    try {
      await new Promise((resolve) => window.grecaptcha.ready(resolve));
      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        { action }
      );
      return token;
    } catch (err) {
      logger.error("reCAPTCHA error:", err);
      return null;
    }
  };

  // ✅ Login with reCAPTCHA
  const handleLogin = async (credentials) => {
    const loginUrl = urlJoin(authUrl, "/login");
    logger.info("Attempting login", { email: credentials.email });

    try {
      const recaptchaToken = await getRecaptchaToken("login");
      if (!recaptchaToken) {
        setError("Failed to verify you're human.");
        return { status: "error", message: "reCAPTCHA failed" };
      }

      const payload = { ...credentials, recaptchaToken };
      const data = await publicRequest(loginUrl, "POST", payload);

      if (data.status !== "success" && data.status !== "pending_otp") {
        setError(data.message || "Login failed");
        logger.warn("Login failed", { email: credentials.email, message: data.message });
      } else {
        setError(null);
        Cookies.set("authToken", data.token);
        Cookies.set("email", credentials.email);
        logger.info("Login successful", { email: credentials.email });
      }

      return data;
    } catch (error) {
      setError(String(error));
      logger.error("Login error", {
        email: credentials.email,
        error: String(error),
      });
      return { status: "error", message: String(error) };
    }
  };

  // ✅ Registration with reCAPTCHA
  const handleRegister = async (credentials) => {
    const registerUrl = urlJoin(authUrl, "/register");
    logger.info("Attempting registration", { email: credentials.email });

    try {
      const recaptchaToken = await getRecaptchaToken("register");
      if (!recaptchaToken) {
        setError("Failed to verify you're human.");
        return { status: "error", message: "reCAPTCHA failed" };
      }

      const payload = { ...credentials, recaptchaToken };
      const data = await publicRequest(registerUrl, "POST", payload);

      if (data.status !== "success") {
        setError(data.message || "Registration failed");
        logger.warn("Registration failed", { email: credentials.email, message: data.message });
        return { status: "error", message: data.message };
      }

      setError(null);
      logger.info("Registration successful", { email: credentials.email });
      return { status: "success", message: data.message };
    } catch (error) {
      setError("An error occurred during registration");
      logger.error("Registration error", {
        email: credentials.email,
        error: String(error),
      });
      return { status: "error", message: String(error) };
    }
  };

  return { error, handleLogin, handleRegister };
};

export default useAuth;
