"use client"; // ✅ Ensure 'use client' directive
import { useState, useEffect } from "react";
import { getAllCourses, togglePrereqStatus } from "@/utils/courseActions";
import logger from "@/utils/logger";
const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await getAllCourses();
      console.log("🚀 API Response in useCourses:", response);

      if (!response || response.status === "error") {
        throw new Error(response?.message || "Failed to fetch courses.");
      }

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid API response format. Expected an array.");
      }

      setCourses(response.data);
      setError(null);
      logger.info("✅ Courses loaded successfully", response.data);
    } catch (err) {
      setError(err.message);
      logger.error("❌ Error fetching courses:", err);
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

      logger.info(`✅ Toggled prerequisite for ${courseName}`);
      fetchCourses();
      return true;
    } catch (err) {
      setError(err.message);
      logger.error("❌ Error toggling prerequisite:", err);
      return false;
    }
  };

  return { courses, fetchCourses, loading, error, handleTogglePrereq };
};

export default useCourses; // ✅ Ensure this is the correct export
