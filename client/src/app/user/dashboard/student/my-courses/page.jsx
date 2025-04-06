"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

const CompletedCoursesHistory = () => {
  const router = useRouter();
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch completed courses on mount
  useEffect(() => {
    fetchCompletedCourses();
  }, []); // Runs only once on mount

  // Fetch completed courses from backend with authentication
  const fetchCompletedCourses = async () => {
    try {
      const token = Cookies.get("jwt-token"); // Retrieve JWT token from cookies
      if (!token) {
        console.error("No token found. User is not authenticated.");
        return;
      }

      const response = await fetch("http://localhost:8000/api/completed-courses/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Attach the token for authentication
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCompletedCourses(data);
      } else {
        console.error("Error fetching completed courses:", data.message);
      }
    } catch (error) {
      console.error("Error fetching completed courses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Completed Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-center text-gray-500">Loading...</p>}
          {!loading && completedCourses.length === 0 && (
            <p className="text-center text-gray-500">No Completed Courses Found</p>
          )}
          {!loading && completedCourses.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-200">
                  <TableHead>Course Name</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.course_name}</TableCell>
                    <TableCell>{course.term}</TableCell>
                    <TableCell>{course.grade}</TableCell>
                    <TableCell>
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => router.push(`/completed-courses/${course.id}`)} // Navigate to course details
                      >
                        View / Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletedCoursesHistory;
