import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000"; // Ensure the correct backend URL

const publicRequest = async (url, method, data = null, token = null) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`; // Attach JWT if provided
    }

    const response = await axios({
      method,
      url,
      baseURL: BASE_URL,
      data,
      headers,
      withCredentials: true, // Ensure cookies & credentials are sent
    });

    return response.data;
  } catch (error) {
    console.log("API Error:", error.response?.data || error.message);

    // Standardize Error Response
    return {
      status: "error",
      message:
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again.",
    };
  }
};

export default publicRequest;
