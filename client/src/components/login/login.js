"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./loginForm"; // Import form component

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [label, setLabel] = useState("");

  const router = useRouter();

  const userLogin = async () => {
    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ u_email: email, u_password: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage("Login failed: " + (data.message || "Please try again."));
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token); // ✅ Store token
        console.log("Token stored:", data.token); // Debugging purpose

        alert("Login successful! Redirecting...");
        router.push("/profile");
      } else {
        setMessage("No token received. Login might have failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <LoginForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      message={message}
      label={label}
      onSubmit={userLogin}
    />
  );
}
