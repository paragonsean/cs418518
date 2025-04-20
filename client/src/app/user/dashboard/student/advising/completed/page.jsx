"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAllCourses, fetchAdvisingRecords, fetchCompletedCourses } from "@/utils/advising_api"; // API functions
import LoadingErrorState from "@/components/ui/loading_error_state"; // New component
import PrerequisiteTable from "@/components/courses/prerequisite_table"; // New component

const AdvisingComparison = () => {
  const [completedCourses, setCompletedCourses] = useState([]); // Student's completed courses
  const [plannedCourses, setPlannedCourses] = useState([]); // Courses they plan to take
  const [missingPrerequisites, setMissingPrerequisites] = useState({}); // Courses missing prereqs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // For handling errors

  const fetchComparisonData = useCallback(async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      const courses = await fetchAllCourses();
      const prerequisitesMap = buildPrerequisiteMap(courses);
      const advisingRecords = await fetchAdvisingRecords();
      const studentPlannedCourses = advisingRecords.flatMap((record) => record.planned_courses);
      setPlannedCourses(studentPlannedCourses);

      const completedCoursesData = await fetchCompletedCourses();
      setCompletedCourses(completedCoursesData);

      const missingPrereqs = findMissingPrerequisites(studentPlannedCourses, prerequisitesMap, completedCoursesData);
      setMissingPrerequisites(missingPrereqs);
    } catch (error) {
      console.error("Error fetching comparison data:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComparisonData();
  }, [fetchComparisonData]);

  const buildPrerequisiteMap = (courses) => {
    const map = {};
    courses.forEach((course) => {
      map[course.course_name] = course.prerequisite ? course.prerequisite.split(", ") : [];
    });
    return map;
  };

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
          <LoadingErrorState loading={loading} error={error} />
          {!loading && !error && (
            <PrerequisiteTable
              plannedCourses={plannedCourses}
              missingPrerequisites={missingPrerequisites}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvisingComparison;
