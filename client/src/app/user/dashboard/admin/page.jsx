"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Bell, Users, BookOpen, CheckCircle } from "lucide-react";
import useProfile from "@/hooks/use_profile";

export default function AdvisorDashboard() {
  const { getProfile } = useProfile();
  const [advisorName, setAdvisorName] = useState("Loading...");

  useEffect(() => {
    (async () => {
      try {
        const profile = await getProfile();
        if (profile?.user) {
          setAdvisorName(
            `${profile.user.u_first_name} ${profile.user.u_last_name}`
          );
        }
      } catch {
        setAdvisorName("Unknown Advisor");
      }
    })();
  }, [getProfile]);

  return (
    <div className="mx-auto max-w-5xl py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Advisor Dashboard</h1>

      {/* Welcome */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold">Welcome, {advisorName}!</h2>
        <p className="text-gray-600">
          Your hub for course management, student oversight, and approvals.
        </p>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* View Students */}
        <Link href="/user/dashboard/admin/view-students">
          <Card className="hover:bg-gray-50 transition cursor-pointer">
            <CardHeader className="flex items-center gap-3">
              <Users size={20} className="text-green-600" />
              <h3 className="text-lg font-semibold">View Students</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Browse student profiles and academic progress.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Manage Courses */}
        <Link href="/user/dashboard/admin/manage-courses">
          <Card className="hover:bg-gray-50 transition cursor-pointer">
            <CardHeader className="flex items-center gap-3">
              <BookOpen size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold">Manage Courses</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                View all student submissions and courses.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Approve Submissions */}
        <Link href="/user/dashboard/admin/view-students">
          <Card className="hover:bg-gray-50 transition cursor-pointer">
            <CardHeader className="flex items-center gap-3">
              <CheckCircle size={20} className="text-yellow-600" />
              <h3 className="text-lg font-semibold">Approve Submissions</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Review and approve student course requests.
              </p>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* Notifications */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Bell size={20} className="text-red-600" /> Recent Notifications
        </h2>
        <ul className="space-y-3">
          <li className="bg-white p-4 rounded-md shadow-sm hover:bg-gray-50 transition">
            <strong>New Enrollment Request</strong> from John Doe in “Calculus I”
          </li>
          <li className="bg-white p-4 rounded-md shadow-sm hover:bg-gray-50 transition">
            <strong>Grade Update</strong> for “Physics Lab” – 2 new submissions
          </li>
          <li className="bg-white p-4 rounded-md shadow-sm hover:bg-gray-50 transition">
            <strong>Maintenance</strong> scheduled Friday at 8 PM
          </li>
        </ul>
      </section>
    </div>
  );
}
