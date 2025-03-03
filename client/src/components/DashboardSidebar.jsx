"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logger from "@/utils/logger";

import {
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  Users,
  LogOut,
  User,
} from "lucide-react";
import useProfile from "@/hooks/useProfile";
import UserProfileButton from "@/components/profile/UserProfileButton";

export default function DashboardSidebar() {
  const { getProfile } = useProfile();
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // ✅ Fix: State for `is_admin`
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        console.log("🔍 Profile Data:", profileData); // ✅ Debugging Log

        if (profileData.status === "error") {
          setErrorMessage(profileData.message || "Unable to load profile.");
          Cookies.remove("jwt-token");
          Cookies.remove("email");
          setTimeout(() => router.push("/account/login"), 1500);
        } else {
          setProfileData(profileData.user);
          setIsAdmin(profileData.user.is_admin); // ✅ Store `is_admin` in state
        }
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]); // ✅ Remove `is_admin` from dependencies

  // Handle Logout
  const handleLogout = () => {
    Cookies.remove("jwt-token");
    Cookies.remove("email");
    router.push("/login");
  };

  return (
    <div className="flex">
      {/* Sidebar Toggle Button */}
      <UserProfileButton />
      <button
        className="p-2 fixed top-4 left-4 bg-gray-100 rounded-full shadow-md z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <Card
        className={`bg-white shadow-md p-4 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Sidebar Content */}
        <div
          className={`transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
        >
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* User Info */}
              <div className="flex items-center gap-2 mb-4 p-2 bg-gray-100 rounded-md">
                <User className="text-gray-700" size={20} />
                <div className={`${isOpen ? "block" : "hidden"}`}>
                  <p className="text-sm font-semibold">
                    {profileData?.u_first_name} {profileData?.u_last_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {profileData?.u_email}
                  </p>
                </div>
              </div>

              {/* Role-Based Navigation */}
              {isAdmin ? (
                <>
                  <SidebarLink
                    href="/dashboard/admin"
                    icon={<LayoutDashboard size={18} />}
                    text="Advisor Dashboard"
                    isOpen={isOpen}
                  />
                  <SidebarLink
                    href="/dashboard/admin/courses"
                    icon={<BookOpen size={18} />}
                    text="Manage Courses"
                    isOpen={isOpen}
                  />
                  <SidebarLink
                    href="/dashboard/admin/view-students"
                    icon={<Users size={18} />}
                    text="View Students"
                    isOpen={isOpen}
                  />
                </>
              ) : (
                <>
                  <SidebarLink
                    href="/dashboard/student"
                    icon={<LayoutDashboard size={18} />}
                    text="Student Dashboard"
                    isOpen={isOpen}
                  />
                  <SidebarLink
                    href="/dashboard/student/courses"
                    icon={<BookOpen size={18} />}
                    text="My Courses"
                    isOpen={isOpen}
                  />
                  <SidebarLink
                    href="/dashboard/student/enroll"
                    icon={<Users size={18} />}
                    text="Enroll"
                    isOpen={isOpen}
                  />
                </>
              )}

              {/* Logout Button */}
              <div className="mt-auto pt-4">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full flex items-center justify-center"
                >
                  <LogOut className="mr-2" size={18} /> {isOpen && "Logout"}
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

// Reusable SidebarLink Component
const SidebarLink = ({ href, icon, text, isOpen }) => (
  <Link
    className="flex items-center py-2 hover:bg-gray-200 px-2 rounded"
    href={href}
  >
    {icon} {isOpen && <span className="ml-2">{text}</span>}
  </Link>
);
