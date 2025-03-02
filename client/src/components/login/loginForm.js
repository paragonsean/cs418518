export default function LoginForm({ 
  email, setEmail, 
  password, setPassword, 
  otp, setOtp, // Ensure setOtp is included
  message, label, 
  onSubmit, step 
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md bg-white p-6 rounded-lg shadow-lg">
        {message && (
          <p className="text-center font-medium text-red-600">{message}</p>
        )}

        <div className="flex flex-col space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              disabled={step === 2} // Disable email input after login step
            />
          </div>

          {/* Password Field (Only Show Before OTP Step) */}
          {step === 1 && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          )}

          {/* OTP Field (Only Show After Correct Password) */}
          {step === 2 && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-900">
                One-Time Password (OTP)
              </label>
              <input
                id="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)} // FIXED: Ensure setOtp updates state
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          )}

          {/* Login Button (Step 1) */}
          {step === 1 && (
            <button 
              className="btn-primary w-full py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
              onClick={onSubmit} // Calls userLogin
            >
              Login
            </button>
          )}

          {/* OTP Verification Button (Step 2) */}
          {step === 2 && (
            <button 
              className="btn-primary w-full py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
              onClick={onSubmit} // Calls verifyOtp
            >
              Verify OTP
            </button>
          )}

          {/* Forgot Password Link (Only Show on Step 1) */}
          {step === 1 && (
            <a className="text-blue-700 text-center hover:underline" href="/forgot-password">
              Forgot Password?
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
