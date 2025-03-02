"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import Cookies from "js-cookie";
import useProfile from "@/hooks/useProfile";

export default function StudentDashboard() {
  const { getProfile } = useProfile();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();

        if (profileData.status === "error") {
          throw new Error(profileData.message || "Failed to load profile.");
        }

        const user = profileData.user;

        //  Redirect users based on their role
        if (user.is_admin) {
          router.replace("/user/dashboard/admin"); // Redirect Admin
        } else {
          router.replace("/user/dashboard/student"); // Redirect Student
        }
      } catch (error) {
        console.error(" Profile Fetch Error:", error);
        Cookies.remove("jwt-token");
        router.push("/account/login"); // Redirect to login on error
      }
    };

    fetchProfile();
  }, [getProfile, router]);

  //  Render Nothing (Since User Will Be Redirected)
  return null;
}
