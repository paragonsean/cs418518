import axios from "axios";
export async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const url = "https://www.google.com/recaptcha/api/siteverify";
  try {
    const res = await axios.post(url, new URLSearchParams({
      secret,
      response: token
    }).toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    const data = res.data;
    console.log("🔍 reCAPTCHA response:", data);
    return {
      success: data.success,
      score: data.score,
      action: data.action,
      errorCodes: data["error-codes"] || []
    };
  } catch (error) {
    console.error("❌ reCAPTCHA verification error:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
}