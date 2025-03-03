"use client";
import CoursesList from "@/components/courses/courseList";

export default function ManageCoursesPage() {
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <CoursesList />
    </div>
  );
}
