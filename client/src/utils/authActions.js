import publicRequest from "./publicRequest";

export const verifyEmail = async (token) => {
  const SERVER_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000"; //  Default to localhost if undefined
  const verifyUrl = `${SERVER_URL}/api/user/verify-email?token=${token}`;

  try {
    console.log("Sending email verification request to:", verifyUrl);
    const data = await publicRequest(verifyUrl, "GET");
    console.log(" Email Verification Response:", data);
    return data;
  } catch (error) {
    console.error(" Email verification error:", error);
    return { status: "failed", message: "Verification failed" };
  }
};

export const requestPasswordReset = async (email) => {
  const SERVER_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000"; //  Ensure a valid backend URL
  const resetUrl = `${SERVER_URL}/api/user/send-reset-password-email`;

  console.log(
    "Sending password reset request to:",
    resetUrl,
    "with email:",
    email,
  );

  try {
    const response = await publicRequest(resetUrl, "POST", { email });
    console.log(" Password Reset Response:", response);
    return response;
  } catch (error) {
    console.error(" Password reset request error:", error);
    return { status: "failed", message: "Request failed" };
  }
};
export const getProfile = async () => {
  const token = Cookies.get("jwt-token"); //  Retrieve JWT from cookies
  if (!token) {
    console.error("No JWT Token found in cookies!");
    return { status: "error", message: "No token found" };
  }

  try {
    console.log("Sending profile request with token:", token);
    const data = await publicRequest(
      "/api/user/loggeduser",
      "GET",
      null,
      token,
    );
    console.log(" Profile Response:", data);
    return data;
  } catch (error) {
    console.error(" Get profile error:", error);
    return { status: "error", message: "Failed to fetch profile" };
  }
};
