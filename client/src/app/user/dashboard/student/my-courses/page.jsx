"use client";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import useCourses from "@/hooks/useCourses";

const myCourses = () => {
  const { courses, fetchCourses, loading, error, handleTogglePrereq } =
    useCourses();

  useEffect(() => {
    console.log("CoursesList Re-rendered, courses:", courses); //  Debugging log
  }, [courses]);

  return (
    <div className="container mx-auto mt-8 p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Available Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading courses...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && courses.length === 0 && (
            <p className="text-gray-600">No courses available.</p>
          )}

          {!loading && !error && courses.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-200">
                  <TableHead>Course Name</TableHead>
                  <TableHead>Course Level</TableHead>
                  <TableHead>Prerequisite</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course, index) => (
                  <TableRow key={index}>
                    <TableCell>{course.course_name}</TableCell>
                    <TableCell>{course.course_level}</TableCell>
                    <TableCell>{course.prerequisite || "None"}</TableCell>
                    <TableCell>
                      <Button
                        variant="default"
                        onClick={() => handleTogglePrereq(course.course_name)}
                      >
                        Toggle Prerequisite
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
<<<<<<< Updated upstream
export default myCourses;
=======
export default myCourses;
>>>>>>> Stashed changes
