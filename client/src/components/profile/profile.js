"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ProfileForm from "./profileForm"; // Import the new form component

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [newPassword, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to view this page.");
      router.push("/login"); // Redirect to login if no token
      return;
    }

    fetchUserData(token);
  }, [token]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("http://localhost:8080/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data);
      setFirstName(response.data.u_first_name);
      setLastName(response.data.u_last_name);
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      router.push("/login");
    }
  };


  const submitName = async () => {
    changeName();
  };

  const changeName = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `http://localhost:8080/user/update-name`,
        { u_first_name: firstName, u_last_name: lastName },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        alert("Your name was successfully updated.");
        fetchUserData(token); // Refresh user data
      } else {
        alert("Error: Unable to update name.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating your name.");
    }
  };

  const changePassword = async () => {
    if (newPassword !== passwordConfirm) {
      alert("New password and confirmation do not match.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `http://localhost:8080/user/update-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        alert("Your password was successfully changed.");
        setPasswordNew("");
        setPasswordConfirm("");
        setCurrentPassword("");
      } else {
        alert("Error: Unable to change password.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while changing your password.");
    }
  };

  return (
    <ProfileForm
      userData={userData}
      firstName={firstName}
      lastName={lastName}
      setFirstName={setFirstName}
      setLastName={setLastName}
      newPassword={newPassword}
      setPassword={setPasswordNew}
      passwordConfirm={passwordConfirm}
      setPasswordConfirm={setPasswordConfirm}
      currentPassword={currentPassword}
      setCurrentPassword={setCurrentPassword}
      submitName={submitName}
    />
  );
}
