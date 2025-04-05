"use client";
import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import {
  fetchAllCourses,
  fetchAllAdvisingRecords,
  updateAdvisingStatus,
  fetchCompletedCourses,
  fetchCompletedCoursesForUser,
} from "@/utils/advisingApi";

/**
 * Hook #1: Student Advising Form
 */
export function useAdvisingFormLogic() {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [courseLevels, setCourseLevels] = useState([]);
  const [coursePlan, setCoursePlan] = useState([]);
  const [coursePrerequisites, setCoursePrerequisites] = useState({});
  const [completedCourses, setCompletedCourses] = useState([]);

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await fetchAllCourses();
        setAvailableCourses(courses);

        const levels = [...new Set(courses.map((c) => c.course_lvlGroup))].sort();
        setCourseLevels(levels);

        const prereqMap = courses.reduce((acc, course) => {
          acc[course.course_name] = course.prerequisite
            ? course.prerequisite.split(", ")
            : [];
          return acc;
        }, {});
        setCoursePrerequisites(prereqMap);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // Fetch completed courses
  useEffect(() => {
    const fetchCompletedCoursesData = async () => {
      try {
        const completed = await fetchCompletedCourses();
        setCompletedCourses(completed);
      } catch (err) {
        console.error("Error fetching completed courses:", err);
      }
    };
    fetchCompletedCoursesData();
  }, []);

  const handleAddCourse = () => {
    setCoursePlan((prev) => [...prev, { level: "", courseLevel: "", name: "" }]);
  };

  const handleCourseChange = (index, field, value) => {
    setCoursePlan((prev) => {
      const updated = [...prev];
      updated[index][field] = value;

      if (field === "level") {
        updated[index].courseLevel = "";
        updated[index].name = "";
      } else if (field === "courseLevel") {
        updated[index].name = "";
      }
      return updated;
    });
  };

  const filterAvailableCourses = (level) => {
    if (!level) return [];
    return availableCourses.filter((c) => String(c.course_lvlGroup) === String(level));
  };

  const formatPlannedCourses = () => coursePlan.map((c) => c.courseLevel).join(", ");
  const formatPrerequisites = () =>
    coursePlan.flatMap((c) => coursePrerequisites[c.name] || []).join(", ");

  return {
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

/**
 * Hook #2: Admin Advising Comparison
 */
export function useAdminAdvisingComparison() {
  const [allRecords, setAllRecords] = useState([]);
  const [missingPrereqsMap, setMissingPrereqsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const allCourses = await fetchAllCourses();
      const prereqMap = buildPrerequisiteMap(allCourses);
      const records = await fetchAllAdvisingRecords();
      setAllRecords(records);

      const completedCoursesByEmail = {};

      for (const rec of records) {
        const email = rec.student_email;
        if (!completedCoursesByEmail[email]) {
          const completed = await fetchCompletedCoursesForUser(email);
          completedCoursesByEmail[email] = completed.map((c) => c.course_name);
        }
      }

      const allMissing = {};
      for (const rec of records) {
        const planned = rec.planned_courses
          ? rec.planned_courses.split(",").map((s) => s.trim())
          : [];
        const userCompleted = completedCoursesByEmail[rec.student_email] || [];
        const missingObj = findMissingPrerequisites(planned, prereqMap, userCompleted);
        allMissing[rec._id] = missingObj;
      }

      setMissingPrereqsMap(allMissing);
    } catch (error) {
      console.error("Error fetching admin comparison data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (recordId, newStatus) => {
    try {
      await updateAdvisingStatus(recordId, newStatus);
      alert(`Record ${recordId} is now ${newStatus}.`);

      setAllRecords((prev) =>
        prev.map((r) => (r._id === recordId ? { ...r, status: newStatus } : r))
      );
    } catch (error) {
      console.error(`Error updating status for ${recordId}:`, error);
    }
  };

  return {
    allRecords,
    missingPrereqsMap,
    loading,
    handleUpdateStatus,
  };
}

/**
 * Shared Utility Functions
 */
function buildPrerequisiteMap(courses) {
  const map = {};
  courses.forEach((course) => {
    map[course.course_name] = course.prerequisite
      ? course.prerequisite.split(", ")
      : [];
  });
  return map;
}

function findMissingPrerequisites(plannedCourses, prereqMap, completedCourses) {
  const missing = {};
  plannedCourses.forEach((courseName) => {
    const required = prereqMap[courseName] || [];
    const unmet = required.filter((prereq) => !completedCourses.includes(prereq));
    if (unmet.length > 0) {
      missing[courseName] = unmet;
    }
  });
  return missing;
}
