"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Password Strength Validator
  const isPasswordStrong = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);
  };

  const userCreation = async () => {
    if (!firstName || !lastName || !email || !password) {
      setMessage("All fields are required.");
      return;
    }

    if (!isPasswordStrong(password)) {
      setMessage("Password must be at least 8 characters, contain an uppercase letter, a number, and a symbol.");
      return;
    }

    setLoading(true); // Start loading

    const formBody = JSON.stringify({
      u_first_name: firstName,
      u_last_name: lastName,
      u_email: email,
      u_password: password,
    });

    try {
      const res = await fetch("http://localhost:8080/user", {
        method: "POST",
        body: formBody,
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.status === 201) {
        // Redirect user to verification page with email param
        router.push(`/verify?email=${email}`);
      } else {
        setMessage(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage("Server error. Please try again later.");
    }

    setLoading(false); // Stop loading
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen p-6">
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md bg-white p-6 rounded-lg shadow-lg">
        {message && <p className="text-center font-medium text-red-600">{message}</p>}

        <div className="flex flex-col space-y-4">
          {/* First Name */}
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="form-input"
          />

          {/* Last Name */}
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="form-input"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />

          {/* Sign-Up Button */}
          <button
            className="btn-primary"
            onClick={userCreation}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </div>
    </main>
  );
}
