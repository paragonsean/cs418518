export default function ProfileForm({
  userData,
  firstName,
  lastName,
  setFirstName,
  setLastName,
  password,
  setPassword,
  passwordConfirm,
  setPasswordConfirm,
  currentPassword,
  setCurrentPassword,
  submitPassword,
  submitName,
}) {
  // Validation for password strength
  const isPasswordStrong = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);
  };

  return (
    <main className="max-w-2xl mx-auto p-6 text-black">
      {userData ? (
        <>
          {/* User Info */}
          <section className="mb-6 text-center">
            <ul>
              <li className="mb-2">
                <strong>Email:</strong> {userData.u_email}
              </li>
              <li className="mb-2">
                <strong>Name:</strong> {userData.u_first_name} {userData.u_last_name}
              </li>
            </ul>
          </section>

          <div className="flex gap-8">
            {/* Change Password Section */}
            <div className="w-1/2">
              <section className="mb-6">
                <h2 className="mb-2 text-center font-bold">Change Password</h2>
                <div className="flex flex-col space-y-4">
                  <label htmlFor="current-password">Current Password:</label>
                  <input
                    type="password"
                    id="current-password"
                    name="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    required
                    aria-label="Enter your current password"
                  />

                  <label htmlFor="new-password">New Password:</label>
                  <input
                    type="password"
                    id="new-password"
                    name="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    required
                    aria-label="Enter a strong password"
                  />
                  {!isPasswordStrong(password) && password.length > 0 && (
                    <p className="text-sm text-red-600">Password must be 8+ characters, contain an uppercase letter, a number, and a symbol.</p>
                  )}

                  <label htmlFor="confirm-password">Confirm New Password:</label>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    required
                    aria-label="Confirm your new password"
                  />

                  <button
                    className={`px-4 py-2 rounded-lg text-white ${isPasswordStrong(password) && password === passwordConfirm ? "bg-amber-900 hover:bg-amber-800" : "bg-gray-400 cursor-not-allowed"}`}
                    onClick={submitPassword}
                    disabled={!isPasswordStrong(password) || password !== passwordConfirm}
                  >
                    Change Password
                  </button>
                </div>
              </section>
            </div>

            {/* Change Name Section */}
            <div className="w-1/2 mt-6">
              <section className="mb-6">
                <h2 className="mb-2 text-center font-bold">Update Name</h2>
                <div className="flex flex-col space-y-4">
                  <label htmlFor="firstName">First Name:</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    required
                    aria-label="Enter your first name"
                  />

                  <label htmlFor="lastName">Last Name:</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    required
                    aria-label="Enter your last name"
                  />

                  <button
                    className={`px-4 py-2 rounded-lg text-white ${firstName && lastName ? "bg-amber-900 hover:bg-amber-800" : "bg-gray-400 cursor-not-allowed"}`}
                    onClick={submitName}
                    disabled={!firstName || !lastName}
                  >
                    Update Information
                  </button>
                </div>
              </section>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500">
          <p>Loading user data...</p>
          <div className="loader mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </main>
  );
}
