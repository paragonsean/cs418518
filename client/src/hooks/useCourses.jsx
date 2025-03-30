"use client";
import { useState, useEffect } from "react";
import {
  getAllCourses,
  togglePrereqStatus,
  getPrereqCourses,
  getNonPrereqCourses,
} from "@/utils/courseActions"; // All APIs should be exported from here
import logger from "@/utils/logger";

const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [prereqCourses, setPrereqCourses] = useState([]);
  const [nonPrereqCourses, setNonPrereqCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all on mount
  useEffect(() => {
    fetchAllCourseData();
  }, []);

  const fetchAllCourseData = async () => {
    setLoading(true);
    try {
      const [allRes, prereqRes, nonPrereqRes] = await Promise.all([
        getAllCourses(),
        getPrereqCourses(),
        getNonPrereqCourses(),
      ]);

      if (allRes.status === "error") throw new Error(allRes.message);
      if (prereqRes.status === "error") throw new Error(prereqRes.message);
      if (nonPrereqRes.status === "error") throw new Error(nonPrereqRes.message);

      if (!Array.isArray(allRes.data)) {
        throw new Error("Invalid API response format. Expected array of courses.");
      }

      setCourses(allRes.data);
      setPrereqCourses(prereqRes.data);
      setNonPrereqCourses(nonPrereqRes.data);
      logger.info("✅ Courses loaded successfully.");
    } catch (err) {
      setError(err.message);
      logger.error("❌ Error loading courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePrereq = async (courseName) => {
    try {
      const response = await togglePrereqStatus(courseName);
      if (response.status === "error") {
        throw new Error(response.message || "Failed to toggle prerequisite.");
      }

      logger.info(`🔄 Toggled prerequisite for ${courseName}`);
      await fetchAllCourseData(); // Refresh everything
      return true;
    } catch (err) {
      setError(err.message);
      logger.error("❌ Error toggling prerequisite:", err);
      return false;
    }
  };

  return {
    courses,
    prereqCourses,
    nonPrereqCourses,
    loading,
    error,
    fetchAllCourseData,
    handleTogglePrereq,
  };
};

export default useCourses;
