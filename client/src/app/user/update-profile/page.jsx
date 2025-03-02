"use client";
import { useFormik } from "formik";
import { updateProfileSchema } from "@/validation/schemas"; // Adjust schema import
import { useState, useEffect } from "react";
import useProfile from "@/hooks/useProfile"; // Import the custom hook
import logger from "@/utils/logger"; // Import logger for debugging

const UpdateProfile = () => {
  const { handleChangePassword, updateProfile, getProfile } = useProfile();
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [serverSuccessMessage, setServerSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Formik Initial Values
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: updateProfileSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setServerErrorMessage("");
      setServerSuccessMessage("");

      try {
        // Update Profile Info (Name)
        const profileUpdate = await updateProfile({
          firstName: values.firstName,
          lastName: values.lastName,
        });

        let passwordUpdate = { status: "success" }; // Default to success if no password update

        // Update Password (if provided)
        if (values.password && values.password_confirmation) {
          passwordUpdate = await handleChangePassword({
            password: values.password,
            password_confirmation: values.password_confirmation,
          });
        }

        if (
          profileUpdate.status === "success" &&
          passwordUpdate.status === "success"
        ) {
          setServerSuccessMessage("Profile updated successfully.");
        } else {
          setServerErrorMessage(profileUpdate.message || passwordUpdate.message);
        }
      } catch (error) {
        logger.error("Error updating profile:", error);
        setServerErrorMessage("An error occurred while updating.");
      } finally {
        setLoading(false);
      }
    },
  });

  // Fetch User Profile on Mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userData = await getProfile();
        if (userData.status === "success" && userData.user) {
          formik.setValues({
            firstName: userData.user.u_first_name || "",
            lastName: userData.user.u_last_name || "",
            password: "",
            password_confirmation: "",
          });
        } else {
          setServerErrorMessage("Failed to fetch user details.");
        }
      } catch (error) {
        setServerErrorMessage("Unable to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Only run once on mount

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* First Name */}
          <div className="mb-4">
            <label htmlFor="firstName" className="block font-medium mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              className="w-full border-gray-300 rounded-md p-2 focus:ring-indigo-200"
              placeholder="Enter first name"
            />
            {formik.errors.firstName && (
              <p className="text-sm text-red-500">{formik.errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label htmlFor="lastName" className="block font-medium mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              className="w-full border-gray-300 rounded-md p-2 focus:ring-indigo-200"
              placeholder="Enter last name"
            />
            {formik.errors.lastName && (
              <p className="text-sm text-red-500">{formik.errors.lastName}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium mb-2">
              New Password (Optional)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              className="w-full border-gray-300 rounded-md p-2 focus:ring-indigo-200"
              placeholder="Enter new password"
            />
            {formik.errors.password && (
              <p className="text-sm text-red-500">{formik.errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label htmlFor="password_confirmation" className="block font-medium mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formik.values.password_confirmation}
              onChange={formik.handleChange}
              className="w-full border-gray-300 rounded-md p-2 focus:ring-indigo-200"
              placeholder="Confirm new password"
            />
            {formik.errors.password_confirmation && (
              <p className="text-sm text-red-500">{formik.errors.password_confirmation}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-indigo-200 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        {/* Success & Error Messages */}
        {serverSuccessMessage && (
          <p className="text-sm text-green-500 font-semibold text-center mt-2">
            {serverSuccessMessage}
          </p>
        )}
        {serverErrorMessage && (
          <p className="text-sm text-red-500 font-semibold text-center mt-2">
            {serverErrorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default UpdateProfile;
