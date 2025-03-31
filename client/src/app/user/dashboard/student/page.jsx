"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { BookOpen, PlusCircle, BarChart, Bell } from "lucide-react"; // Icons
import useProfile from "@/hooks/useProfile"; // fetch user data

export default function StudentDashboard() {
  const { getProfile } = useProfile();
  const [studentName, setStudentName] = useState("Loading...");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (data?.user) {
          setStudentName(`${data.user.u_first_name} ${data.user.u_last_name}`);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setStudentName("Unknown Student");
      }
    };
    fetchProfile();
  }, [getProfile]);

  return (
    <div className="mx-auto max-w-5xl py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

      {/* Welcome Message */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold">Welcome, {studentName}!</h2>
        <p className="text-gray-600">
          Here you can view your courses, enroll in new ones, and track your academic progress.
        </p>
      </section>

      {/* Quick Actions in a Single Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1) My Courses */}
        <Link href="/user/dashboard/student/my-courses">
          <Card className="hover:bg-gray-50 transition cursor-pointer">
            <CardHeader className="flex items-center gap-3">
              <BookOpen size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold">My Courses</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                See all courses you are currently enrolled in.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* 2) Completed Advising */}
        <Link href="/user/dashboard/student/advising/history">
          <Card className="hover:bg-gray-50 transition cursor-pointer">
            <CardHeader className="flex items-center gap-3">
              <BookOpen size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold">Completed Advising</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                View courses or tasks from completed advising sessions.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* 3) Enroll */}
        <Link href="/user/dashboard/student/advising/courses">
          <Card className="hover:bg-gray-50 transition cursor-pointer">
            <CardHeader className="flex items-center gap-3">
              <PlusCircle size={20} className="text-green-600" />
              <h3 className="text-lg font-semibold">Enroll</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Check available courses and sign up for new classes.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* 4) Progress Tracker */}
        <Link href="/user/dashboard/student/advising/completed">
          <Card className="hover:bg-gray-50 transition cursor-pointer">
            <CardHeader className="flex items-center gap-3">
              <BarChart size={20} className="text-yellow-600" />
              <h3 className="text-lg font-semibold">Progress Tracker</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                View grades, assignments, and performance analytics.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* 5) Advising History */}
        <Link href="/user/dashboard/student/advising/history">
          <Card className="hover:bg-gray-50 transition cursor-pointer">
            <CardHeader className="flex items-center gap-3">
              <BarChart size={20} className="text-yellow-600" />
              <h3 className="text-lg font-semibold">Advising History</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Review previous advising records and recommended plans.
              </p>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* Important Updates Section */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Bell size={20} className="text-red-600" />
          Important Updates
        </h2>
        <ul className="space-y-3">
          <li className="bg-white p-4 rounded-md shadow-sm hover:bg-gray-50 transition">
            <strong>Enrollment Opens</strong> for the new semester on August 1st.
          </li>
          <li className="bg-white p-4 rounded-md shadow-sm hover:bg-gray-50 transition">
            <strong>Midterm Grades</strong> now available for review.
          </li>
          <li className="bg-white p-4 rounded-md shadow-sm hover:bg-gray-50 transition">
            <strong>Advisory Meeting</strong> scheduled for next week—check your email.
          </li>
        </ul>
      </section>
    </div>
  );
}
