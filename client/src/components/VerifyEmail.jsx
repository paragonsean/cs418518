"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail } from "@/utils/auth_actions";
import ReCaptcha from "@/components/re_captcha"; // Import your ReCaptcha component

const VerifyEmailContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [message, setMessage] = useState("Verifying your email...");
  const [loading, setLoading] = useState(true);
  const [recaptchaToken, setRecaptchaToken] = useState(""); // State for reCAPTCHA token

  useEffect(() => {
    if (!token) {
      setMessage("❌ No verification token found.");
      setLoading(false);
      return;
    }

    const verifyUserEmail = async () => {
      if (!recaptchaToken) {
        setMessage("❌ Please complete the reCAPTCHA.");
        setLoading(false);
        return;
      }

      try {
        console.log("📤 Verifying token:", token);
        const res = await verifyEmail(token, recaptchaToken); // Pass recaptcha token for verification

        if (res.status === "success") {
          setMessage("✅ Email verified successfully! Redirecting to login...");
          setTimeout(() => router.push("/account/login"), 3000);
        } else {
          setMessage("❌ Verification failed. Invalid or expired token.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setMessage("❌ Error verifying email.");
      } finally {
        setLoading(false);
      }
    };

    verifyUserEmail();
  }, [token, recaptchaToken, router]);

  const handleRecaptchaToken = (token) => {
    setRecaptchaToken(token); // Set the reCAPTCHA token
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Email Verification</h2>
        {loading ? (
          <p className="text-gray-600">⏳ Verifying your email...</p>
        ) : (
          <p className={`text-lg ${message.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}

        {/* Include the ReCaptcha component */}
        <ReCaptcha action="email_verification" onTokenReceived={handleRecaptchaToken} />
      </div>
    </div>
  );
};

const VerifyEmail = () => (
  <Suspense fallback={
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <p>⏳ Loading...</p>
    </div>
  }>
    <VerifyEmailContent />
  </Suspense>
);

export default VerifyEmail;
