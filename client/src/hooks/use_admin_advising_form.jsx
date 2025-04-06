"use client";

import { useState, useEffect } from "react";
import publicRequest from "@/utils/public_request";
import urlJoin from "url-join";

export const useAdminAdvisingComparison = (recordId) => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [coursePlan, setCoursePlan] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingRecord, setLoadingRecord] = useState(true);
  const [record, setRecord] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const url = urlJoin(process.env.NEXT_PUBLIC_SERVER_URL, "/api/admin/courses");
        const data = await publicRequest(url, "GET");
        setAvailableCourses(data);
      } catch (error) {
        console.error("Error fetching available courses:", error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!recordId) return;
      try {
        const token = localStorage.getItem("token"); // Or your token retrieval method
        const url = urlJoin(process.env.NEXT_PUBLIC_SERVER_URL, `/api/admin/advising/${recordId}`);
        const data = await publicRequest(url, "GET", null, token);
        setRecord(data);
      } catch (error) {
        console.error("Error fetching advising record:", error);
      } finally {
        setLoadingRecord(false);
      }
    };

    fetchRecord();
  }, [recordId]);

  useEffect(() => {
    if (!record || availableCourses.length === 0) return;

    if (record.planned_courses) {
      const plannedLevels = Array.isArray(record.planned_courses)
        ? record.planned_courses
        : record.planned_courses.split(",").map((s) => s.trim());

      const prepopulatedPlan = plannedLevels.map((levelVal) => {
        const found = availableCourses.find((c) => c.course_level === levelVal);
        return found
          ? {
              level: found.course_lvlGroup,
              courseLevel: found.course_level,
              name: found.course_name,
            }
          : { level: "", courseLevel: levelVal, name: "" };
      });

      setCoursePlan(prepopulatedPlan);
    } else {
      setCoursePlan([]); // Initialize as empty array if no planned courses
    }
  }, [record, availableCourses]);

  const loading = loadingCourses || loadingRecord;

  return { availableCourses, coursePlan, setCoursePlan, loading, record };
};
