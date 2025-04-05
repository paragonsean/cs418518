"use client";
import Cookies from "js-cookie";
import { useState } from "react";
import urlJoin from "url-join";
import logger from "../utils/logger"; //  Import logger
import publicRequest from "../utils/publicRequest";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

const useAuth = () => {
  const [error, setError] = useState(null);
  const authUrl = urlJoin(baseUrl, "/api/user");

  const handleLogin = async (credentials) => {
    const loginUrl = urlJoin(authUrl, "/login");
    logger.info("Attempting login", { email: credentials.email }); //  Log login attempt

    try {
      const data = await publicRequest(loginUrl, "POST", credentials);
      if (data.status !== "success") {
        setError(data.message || "Login failed");
        logger.warn("Login failed", {
          email: credentials.email,
          message: data.message,
        }); //  Log warning
      } else {
        setError(null);
        Cookies.set("authToken", data.token);
        Cookies.set("email", credentials.email);
        logger.info("Login successful", { email: credentials.email }); //  Log success
      }
      return data;
    } catch (error) {
      setError(String(error));
      logger.error("Login error", {
        email: credentials.email,
        error: String(error),
      }); //  Log error
      return { status: "error", message: String(error) };
    }
  };

  const handleRegister = async (credentials) => {
    const registerUrl = urlJoin(authUrl, "/register");
    logger.info("Attempting registration", { email: credentials.email }); //  Log registration attempt

    try {
      const data = await publicRequest(registerUrl, "POST", credentials);
      if (data.status !== "success") {
        setError(data.message || "Registration failed");
        logger.warn("Registration failed", {
          email: credentials.email,
          message: data.message,
        }); //  Log warning
        return { status: "error", message: data.message };
      }
      setError(null);
      logger.info("Registration successful", { email: credentials.email }); //  Log success
      return { status: "success", message: data.message };
    } catch (error) {
      setError("An error occurred during registration");
      logger.error("Registration error", {
        email: credentials.email,
        error: String(error),
      }); //  Log error
      return { status: "error", message: String(error) };
    }
  };

  return { error, handleLogin, handleRegister };
};

export default useAuth;
