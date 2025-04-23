import publicRequest from "./public_request";

function getAuthToken() {
  const token = Cookies.get("authToken");
  if (!token) {
    console.error("Missing auth token.");
    window.location.href = "/login";
    throw new Error("No auth token.");
  }
  return token;
}
// 📧 Verify Email via Token
export const verifyEmail = async (token) => {
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
  const verifyUrl = `${SERVER_URL}/api/user/verify-email?token=${token}`;

  try {
    console.log("Sending email verification request to:", verifyUrl);
    const data = await publicRequest(verifyUrl, "GET");
    console.log("Email Verification Response:", data);
    return data;
  } catch (error) {
    console.error("Email verification error:", error.message);
    return { status: "failed", message: "Verification failed" };
  }
};

// 🔐 Request Password Reset
export const requestPasswordReset = async (email) => {
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
  const resetUrl = `${SERVER_URL}/api/user/send-reset-password-email`;

  console.log("Sending password reset request to:", resetUrl, "with email:", email);

  try {
    const response = await publicRequest(resetUrl, "POST", { email });
    console.log("Password Reset Response:", response);
    return response;
  } catch (error) {
    console.error("Password reset request error:", error.message);
    return { status: "failed", message: "Request failed" };
  }
};

// 👤 Get Logged-in User Profile (with cookies)
export const getProfile = async () => {
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
  const profileUrl = `${SERVER_URL}/api/user/loggeduser`;

  try {
    console.log("Sending profile request with credentials");
    const data = await publicRequest(profileUrl, "GET", null, null, true);
    console.log("Profile Response:", data);
    return data;
  } catch (error) {
    console.error("Get profile error:", error.message);
    return { status: "error", message: "Failed to fetch profile" };
  }
};
