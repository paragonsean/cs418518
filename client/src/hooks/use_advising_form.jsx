"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Cookies from "js-cookie";
import { fetchAllCourses, fetchCompletedCourses } from "@/utils/advising_api"; // Assuming you have the appropriate functions for fetching.

/**
 * Hook #1: 
 */
export function useAdvisingFormLogic() {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [courseLevels, setCourseLevels] = useState([]);
  const [coursePlan, setCoursePlan] = useState([]);
  const [coursePrerequisites, setCoursePrerequisites] = useState({});
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state for fetching data

  // Fetch all courses and completed courses in parallel
  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const [courses, completed] = await Promise.all([
          fetchAllCourses(),
          fetchCompletedCourses(),
        ]);
        setAvailableCourses(courses);
        setCompletedCourses(completed);

        const levels = [...new Set(courses.map((c) => c.course_lvlGroup))].sort();
        setCourseLevels(levels);

        const prereqMap = courses.reduce((acc, course) => {
          acc[course.course_name] = course.prerequisite ? course.prerequisite.split(", ") : [];
          return acc;
        }, {});
        setCoursePrerequisites(prereqMap);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchCoursesData();
  }, []); // Empty dependency array ensures this runs only once

  const handleAddCourse = () => {
    setCoursePlan((prev) => [...prev, { level: "", courseLevel: "", name: "" }]);
  };

  const handleCourseChange = (index, field, value) => {
    setCoursePlan((prev) => {
      const updated = [...prev];
      updated[index][field] = value;

      // Reset related fields based on course plan logic
      if (field === "level") {
        updated[index].courseLevel = "";
        updated[index].name = "";
      } else if (field === "courseLevel") {
        updated[index].name = "";
      }
      return updated;
    });
  };

  // Memoizing filter function to prevent re-renders if availableCourses doesn't change
  const filterAvailableCourses = useMemo(() => {
    return (level) => {
      return availableCourses.filter((c) => String(c.course_lvlGroup) === String(level));
    };
  }, [availableCourses]);

  const formatPlannedCourses = () => coursePlan.map((c) => c.courseLevel).join(", ");
  const formatPrerequisites = () =>
    coursePlan.flatMap((c) => coursePrerequisites[c.name] || []).join(", ");

  return {
    loading,
    coursePlan,
    setCoursePlan,
    courseLevels,
    availableCourses,
    completedCourses,
    coursePrerequisites,
    handleAddCourse,
    handleCourseChange,
    filterAvailableCourses,
    formatPlannedCourses,
    formatPrerequisites,
  };
}
