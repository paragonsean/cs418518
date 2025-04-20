"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import publicRequest from "@/utils/public_request";

const CompletedCoursesHistory = () => {
  const router = useRouter();
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");  // Added error state

  useEffect(() => {
    const fetchCompletedCourses = async () => {
      try {
        const token = Cookies.get("authToken");
        if (!token) {
          setError("User is not authenticated. Please log in.");
          return;
        }

        const data = await publicRequest("/api/completed-courses/", "GET", null, token);

        if (data && Array.isArray(data)) {
          setCompletedCourses(data);
        } else {
          setError("Unexpected response while fetching completed courses.");
        }
      } catch (error) {
        setError("Error fetching completed courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedCourses();
  }, []);

  return (
    <div className="container mx-auto mt-8 p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Completed Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : completedCourses.length === 0 ? (
            <p className="text-center text-gray-500">No Completed Courses Found</p>
          ) : (
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
                  <TableRow key={course.id || course._id}>
                    <TableCell>{course.course_name}</TableCell>
                    <TableCell>{course.term}</TableCell>
                    <TableCell>{course.grade}</TableCell>
                    <TableCell>
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => router.push(`/completed-courses/${course.id || course._id}`)}
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
