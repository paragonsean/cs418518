import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "") || "http://localhost:8000";

// Create singleton axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const publicRequest = async (url, method = "GET", data = null, token = null) => {
  try {
    const config = {
      method,
      url,
      data,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Attach token if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (!error.response) {
      console.error("❌ Network Error:", error.message); // No response means server didn't reply
    } else {
      console.error("❌ Server responded with error:", {
        status: error.response.status,
        data: error.response.data,
      });
    }

    const message =
      error?.response?.data?.message ||
      error?.response?.statusText ||
      error?.message ||
      "An unexpected error occurred";

    return {
      status: "error",
      message,
    };
  }
};

export default publicRequest;
