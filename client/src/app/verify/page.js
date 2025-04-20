"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyContent() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, [searchParams]);

  const verifyOtp = async () => {
    if (!email || !otp) {
      setMessage("Please enter your OTP.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 🧠 Required for cookie-based JWT auth
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Verification successful! Redirecting...");
        router.push("/dashboard"); // Or "/login" if you prefer
      } else {
        setMessage(data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen p-6">
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-center text-lg font-semibold mb-4">
          Verify Your Email
        </h2>

        {message && (
          <p className="text-center font-medium text-red-600 mb-2">{message}</p>
        )}

        <div className="flex flex-col space-y-4">
          <input
            type="email"
            value={email}
            readOnly
            className="form-input bg-gray-100 p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Enter Verification Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="form-input p-2 border rounded"
          />

          <button
            className="btn-primary bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            onClick={verifyOtp}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function Verify() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
