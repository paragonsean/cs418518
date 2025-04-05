"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAllCourses, fetchAllAdvisingRecords, fetchCompletedCoursesForUser, updateAdvisingStatus } from "@/utils/advisingApi";

/**
 * Admin Advising Comparison Logic
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
        const planned = rec.planned_courses ? rec.planned_courses.split(",").map((s) => s.trim()) : [];
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
 * Shared Utility Functions for Advising
 */

/**
 * Build a map of prerequisites for all courses
 */
const buildPrerequisiteMap = (courses) => {
  const map = {};
  courses.forEach((course) => {
    map[course.course_name] = course.prerequisite ? course.prerequisite.split(", ") : [];
  });
  return map;
};

/**
 * Find missing prerequisites for planned courses
 */
const findMissingPrerequisites = (plannedCourses, prereqMap, completedCourses) => {
  const missing = {};
  plannedCourses.forEach((courseName) => {
    const required = prereqMap[courseName] || [];
    const unmet = required.filter((prereq) => !completedCourses.includes(prereq));
    if (unmet.length > 0) {
      missing[courseName] = unmet;
    }
  });
  return missing;
};
