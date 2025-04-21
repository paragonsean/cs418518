"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import publicRequest from "../../../../utils/publicRequest";

const ResetPassword = () => {
  const router = useRouter();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await publicRequest(
        `/api/user/reset-password/${token}`,
        "POST",
        { newPassword: password },
      );

      if (res.status === "success") {
        setMessage(" Password reset successfully! Redirecting...");
        setTimeout(() => router.push("/account/login"), 3000);
      } else {
        setMessage(" " + res.message);
      }
    } catch (error) {
      setMessage(" Error resetting password.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="w-full p-2 mb-4 border rounded-sm"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded-sm"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {message && <p className="mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
