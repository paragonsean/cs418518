"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Bell, Users, BookOpen, CheckCircle } from "lucide-react";
import useProfile from "@/hooks/useProfile"; // ✅ Import profile hook

export default function AdvisorDashboard() {
  const { getProfile, loading } = useProfile();
  const [advisorName, setAdvisorName] = useState("Loading..."); // ✅ State for advisor name

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        if (profile?.user) {
          setAdvisorName(`${profile.user.u_first_name} ${profile.user.u_last_name}`);
        }
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
        setAdvisorName("Unknown Advisor");
      }
    };

    fetchProfile();
  }, [getProfile]); // ✅ Runs on mount

  return (
    <div className="mx-auto max-w-5xl py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Advisor Dashboard</h1>

      {/* Welcome Message */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold">Welcome, {advisorName}!</h2>
        <p className="text-gray-600">
          This is your main hub for managing courses, reviewing student enrollments, and handling administrative tasks.
        </p>
      </section>

      {/* Dashboard Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Manage Courses */}
        <Link href="/user/dashboard/admin/manage-courses">
          <Card className="hover:bg-gray-50 transition cursor-pointer">
            <CardHeader className="flex items-center gap-3">
              <BookOpen size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold">Manage Courses</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Create, edit, or remove courses offered this semester.</p>
            </CardContent>
          </Card>
        </Link>

        {/* View Students */}
        <Link href="/user/dashboard/admin/view-students">
          <Card className="hover:bg-gray-50 transition cursor-pointer">
            <CardHeader className="flex items-center gap-3">
              <Users size={20} className="text-green-600" />
              <h3 className="text-lg font-semibold">View Students</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Check student details, contact information, and academic progress.</p>
            </CardContent>
          </Card>
        </Link>

        {/* Approve Registrations */}
        <Link href="/dashboard/admin/approve-registrations">
          <Card className="hover:bg-gray-50 transition cursor-pointer">
            <CardHeader className="flex items-center gap-3">
              <CheckCircle size={20} className="text-yellow-600" />
              <h3 className="text-lg font-semibold">Approve Registrations</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Review and approve student registration requests for courses.</p>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* Notifications Section */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Bell size={20} className="text-red-600" /> Recent Notifications
        </h2>
        <ul className="space-y-3">
          <li className="bg-white p-4 rounded-md shadow-sm hover:bg-gray-50 transition">
            <strong>New Enrollment Request</strong> from John Doe in "Calculus I"
          </li>
          <li className="bg-white p-4 rounded-md shadow-sm hover:bg-gray-50 transition">
            <strong>Grade Update</strong> for "Physics Lab" - 2 new submissions
          </li>
          <li className="bg-white p-4 rounded-md shadow-sm hover:bg-gray-50 transition">
            <strong>System Maintenance</strong> scheduled on Friday, 8 PM
          </li>
        </ul>
      </section>
    </div>
  );
}
