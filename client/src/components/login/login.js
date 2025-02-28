"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./loginForm"; // Import form component

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // ✅ Ensure OTP state exists
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // Step 1: Login, Step 2: OTP Verification
  const router = useRouter();

  // ✅ Step 1: User Login
  const userLogin = async () => {
    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ u_email: email, u_password: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed. Please try again.");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token); // ✅ Store JWT token
        console.log("Token stored:", data.token);

        setOtp(""); // ✅ Clear OTP input
        setStep(2); // ✅ Move to OTP verification step
        setMessage("OTP sent to your email. Please enter it below.");
      } else {
        setMessage("Login successful! Redirecting...");
        router.push("/profile");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  // ✅ Step 2: OTP Verification
  // ✅ Step 2: OTP Verification
const verifyOtp = async () => {
  try {
    const res = await fetch("http://localhost:8080/login/verify-otp", { // ✅ FIXED API ROUTE
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ u_email: email, otp }), // ✅ FIXED: Use "otp" instead of "verification_code"
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage("OTP verification failed: " + (data.message || "Try again."));
      return;
    }

    alert("Login successful! Redirecting...");
    router.push("/profile"); // ✅ Redirect to profile
  } catch (error) {
    console.error("OTP verification error:", error);
    setMessage("An error occurred. Please try again.");
  }
};

  return (
    <LoginForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      otp={otp} // ✅ Ensure OTP state is passed
      setOtp={setOtp} // ✅ Ensure OTP setter function is passed
      message={message}
      step={step}
      onSubmit={step === 1 ? userLogin : verifyOtp} // ✅ Handles login & OTP dynamically
    />
  );
}
