"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
import UserProfileButton from "@/components/profile/userProfileButton";

export default function DashboardSidebar() {
  const { getProfile } = useProfile();
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getProfile();

        if (result.status === "error") {
          setErrorMessage(result.message || "Unable to load profile.");
          Cookies.remove("authToken");
          Cookies.remove("email");
          setTimeout(() => router.replace("/account/login"), 1500);
        } else {
          setProfileData(result.user);
          setIsAdmin(result.user.is_admin);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setErrorMessage("Unexpected error. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [getProfile, router]);

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("email");
    router.replace("/account/login");
  };

  return (
    <div className="flex">
      <UserProfileButton />
      <button
        className="p-2 fixed top-4 left-4 bg-gray-100 rounded-full shadow-md z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <Card
        className={`bg-white shadow-md p-4 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        <div className={`transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}>
          {loading ? (
            <p className="text-sm text-gray-500">Loading profile...</p>
          ) : errorMessage ? (
            <p className="text-sm text-red-500">{errorMessage}</p>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4 p-2 bg-gray-100 rounded-md">
                <User className="text-gray-700" size={20} />
                <div className={`${isOpen ? "block" : "hidden"}`}>
                  <p className="text-sm font-semibold">
                    {profileData?.u_first_name} {profileData?.u_last_name}
                  </p>
                  <p className="text-xs text-gray-500">{profileData?.u_email}</p>
                </div>
              </div>

              {isAdmin ? (
                <>
                  <SidebarLink
                    href="/user/dashboard/admin"
                    icon={<LayoutDashboard size={18} />}
                    text="Advisor Dashboard"
                    isOpen={isOpen}
                  />
                  <SidebarLink
                    href="/user/dashboard/admin/manage-courses"
                    icon={<BookOpen size={18} />}
                    text="Manage Courses"
                    isOpen={isOpen}
                  />
                  <SidebarLink
                    href="/user/dashboard/admin/view-students"
                    icon={<Users size={18} />}
                    text="View Students"
                    isOpen={isOpen}
                  />
                </>
              ) : (
                <>
                  <SidebarLink
                    href="/user/dashboard/student/advising"
                    icon={<LayoutDashboard size={18} />}
                    text="Advising Dashboard"
                    isOpen={isOpen}
                  />
                  <SidebarLink
                    href="/user/dashboard/student/my-courses"
                    icon={<BookOpen size={18} />}
                    text="My Courses"
                    isOpen={isOpen}
                  />
                  <SidebarLink
                    href="/user/dashboard/student/advising/courses"
                    icon={<Users size={18} />}
                    text="Sign Up for Courses"
                    isOpen={isOpen}
                  />
                  <SidebarLink
                    href="/user/dashboard/student/advising/history"
                    icon={<Users size={18} />}
                    text="View Advising History"
                    isOpen={isOpen}
                  />
                </>
              )}

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

const SidebarLink = ({ href, icon, text, isOpen }) => (
  <Link className="flex items-center py-2 hover:bg-gray-200 px-2 rounded" href={href}>
    {icon} {isOpen && <span className="ml-2">{text}</span>}
  </Link>
);
