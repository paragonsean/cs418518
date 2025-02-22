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
    return (
      <main className="max-w-2xl mx-auto p-6 text-black">
        {userData ? (
          <>
            <section className="mb-6">
              <ul>
                <li className="mb-2 text-center">
                  <strong>Email:</strong> {userData.u_email}
                </li>
                <li className="mb-2 text-center">
                  <strong>Name:</strong> {userData.u_first_name} {userData.u_last_name}
                </li>
              </ul>
            </section>
  
            <div className="flex">
              {/* Change Password */}
              <div className="w-1/2 mr-8">
                <section className="mb-6">
                  <h2 className="mb-2 text-center">
                    <strong>Change Password?</strong>
                  </h2>
                  <div className="flex flex-col space-y-4">
                    <label htmlFor="current-password">Current Password:</label>
                    <input
                      type="password"
                      id="current-password"
                      name="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="border border-gray-300 rounded-full px-3 py-2"
                      required
                    />
  
                    <label htmlFor="new-password">New Password:</label>
                    <input
                      type="password"
                      id="new-password"
                      name="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border border-gray-300 rounded-full px-3 py-2"
                      required
                    />
  
                    <label htmlFor="confirm-password">Confirm New Password:</label>
                    <input
                      type="password"
                      id="confirm-password"
                      name="confirm-password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      className="border border-gray-300 rounded-full px-3 py-2"
                      required
                    />
  
                    <button className="bg-amber-900 text-white px-4 py-2 rounded-full hover:bg-amber-800" onClick={submitPassword}>
                      Change Password
                    </button>
                  </div>
                </section>
              </div>
  
              {/* Change Name */}
              <div className="w-1/2 mt-12">
                <section className="mb-6">
                  <h2 className="mb-2 text-center">
                    <strong>Change Name?</strong>
                  </h2>
                  <div className="flex flex-col space-y-4">
                    <label htmlFor="firstName">First Name:</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={firstName}
                      className="border border-gray-300 rounded-full px-3 py-2"
                      required
                      onChange={(e) => setFirstName(e.target.value)}
                    />
  
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={lastName}
                      className="border border-gray-300 rounded-full px-3 py-2"
                      required
                      onChange={(e) => setLastName(e.target.value)}
                    />
  
                    <button className="bg-amber-900 text-white px-4 py-2 rounded-full hover:bg-amber-800" onClick={submitName}>
                      Update Information
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Loading user data...</p>
        )}
      </main>
    );
  }
  