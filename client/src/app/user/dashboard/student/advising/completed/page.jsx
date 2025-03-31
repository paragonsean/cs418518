"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { fetchAllCourses } from "@/utils/courseActions"; // Fetch all courses
import { fetchAdvisingRecords } from "@/utils/advisingActions"; // Fetch planned courses

const AdvisingComparison = () => {
  const [completedCourses, setCompletedCourses] = useState([]); // Student's completed courses
  const [plannedCourses, setPlannedCourses] = useState([]); // Courses they plan to take
  const [missingPrerequisites, setMissingPrerequisites] = useState({}); // Courses missing prereqs
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparisonData();
  }, []); // Runs once on mount

  // Fetch all data needed for comparison
  const fetchComparisonData = async () => {
    setLoading(true);
    try {
      // Fetch prerequisites from all courses
      const courses = await fetchAllCourses();
      const prerequisitesMap = buildPrerequisiteMap(courses);

      // Fetch planned courses
      const advisingRecords = await fetchAdvisingRecords();
      const studentPlannedCourses = advisingRecords.flatMap((record) => record.planned_courses);
      setPlannedCourses(studentPlannedCourses);

      // Fetch completed courses
      const completedCoursesData = await fetchCompletedCourses();
      setCompletedCourses(completedCoursesData);

      // Compare prerequisites
      const missingPrereqs = findMissingPrerequisites(studentPlannedCourses, prerequisitesMap, completedCoursesData);
      setMissingPrerequisites(missingPrereqs);
    } catch (error) {
      console.error("Error fetching comparison data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch completed courses from backend
  const fetchCompletedCourses = async () => {
    try {
      const token = Cookies.get("jwt-token");
      if (!token) {
        console.error("No token found. User is not authenticated.");
        return [];
      }

      const response = await fetch("http://localhost:8000/api/completed-courses/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch completed courses.");
      return await response.json();
    } catch (error) {
      console.error("Error fetching completed courses:", error);
      return [];
    }
  };

  // Build a map of prerequisites for all courses
  const buildPrerequisiteMap = (courses) => {
    const map = {};
    courses.forEach((course) => {
      map[course.course_name] = course.prerequisite ? course.prerequisite.split(", ") : [];
    });
    return map;
  };

  // Compare prerequisites against completed courses
  const findMissingPrerequisites = (planned, prerequisitesMap, completed) => {
    const completedCourseNames = completed.map((c) => c.course_name);
    const missing = {};

    planned.forEach((course) => {
      const requiredPrereqs = prerequisitesMap[course] || [];
      const unmetPrereqs = requiredPrereqs.filter((prereq) => !completedCourseNames.includes(prereq));

      if (unmetPrereqs.length > 0) {
        missing[course] = unmetPrereqs;
      }
    });

    return missing;
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Prerequisite Check for Planned Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-200">
                  <TableHead>Planned Course</TableHead>
                  <TableHead>Missing Prerequisites</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plannedCourses.length > 0 ? (
                  plannedCourses.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell>{course}</TableCell>
                      <TableCell>
                        {missingPrerequisites[course]?.length > 0 ? (
                          <span className="text-red-500">
                            {missingPrerequisites[course].join(", ")}
                          </span>
                        ) : (
                          <span className="text-green-500">All prerequisites met ✅</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-gray-500">
                      No planned courses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvisingComparison;
