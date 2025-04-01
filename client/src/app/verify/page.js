"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyContent() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
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

    try {
      const res = await fetch("http://localhost:8080/user/approve", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ u_email: email, verification_code: otp }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Verification successful! Redirecting to login...");
        router.push("/login");
      } else {
        setMessage(data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen p-6">
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-center text-lg font-semibold">Verify Your Email</h2>

        {message && <p className="text-center font-medium text-red-600">{message}</p>}

        <div className="flex flex-col space-y-4">
          <input
            type="email"
            value={email}
            readOnly
            className="form-input bg-gray-100"
          />

          <input
            type="text"
            placeholder="Enter Verification Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="form-input"
          />

          <button
            className="btn-primary"
            onClick={verifyOtp}
          >
            Verify OTP
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
