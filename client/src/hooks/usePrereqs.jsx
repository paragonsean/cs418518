"use client";
import { useState, useEffect } from "react";
import { getPrereqCourses, getNonPrereqCourses } from "@/utils/api";

const usePrereqs = () => {
  const [prereqCourses, setPrereqCourses] = useState([]);
  const [nonPrereqCourses, setNonPrereqCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrereqCourses();
    fetchNonPrereqCourses();
  }, []);

  // Fetch prerequisite courses
  const fetchPrereqCourses = async () => {
    setLoading(true);
    const response = await getPrereqCourses();
    if (response.status === "error") {
      setError(response.message);
    } else {
      setPrereqCourses(response);
    }
    setLoading(false);
  };

  // Fetch non-prerequisite courses
  const fetchNonPrereqCourses = async () => {
    setLoading(true);
    const response = await getNonPrereqCourses();
    if (response.status === "error") {
      setError(response.message);
    } else {
      setNonPrereqCourses(response);
    }
    setLoading(false);
  };

  return {
    prereqCourses,
    nonPrereqCourses,
    loading,
    error,
    fetchPrereqCourses,
    fetchNonPrereqCourses,
  };
};

export default usePrereqs;
