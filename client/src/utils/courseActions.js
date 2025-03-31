import axios from "axios";
import Cookies from "js-cookie";
import logger from "@/utils/logger";
<<<<<<< Updated upstream
import publicRequest from "./publicRequest";
=======
import publicRequest from "./publicRequest"; // Always use publicRequest
>>>>>>> Stashed changes

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

<<<<<<< Updated upstream
const api = axios.create({
  baseURL: SERVER_URL,
  headers: { "Content-Type": "application/json" },
});

// Fetch All Courses (Fix API path)
export const getAllCourses = () => publicRequest("/api/courses/all", "GET");

// Fetch Prerequisite Courses
export const getPrereqCourses = () => publicRequest("/api/courses/prereq", "GET");

// Fetch Non-Prerequisite Courses
export const getNonPrereqCourses = () => publicRequest("/api/courses/non-prereq", "GET");

// Toggle Prerequisite Status (Requires Auth)
export const togglePrereqStatus = (courseName) =>
  publicRequest("/api/courses/toggle-prereq", "PUT", { Course_Name: courseName }, Cookies.get("jwt-token"));

// Fetch Prerequisites for a Student (Requires Auth)
export const getPrereqData = (email, currentTerm) =>
  publicRequest("/api/courses/prereq-data", "POST", { Email: email, Current_Term: currentTerm }, Cookies.get("jwt-token"));

// Fetch Course Plan for a Student (Requires Auth)
export const getCoursePlanData = (email, currentTerm) =>
  publicRequest("/api/courses/course-plan", "POST", { Email: email, Current_Term: currentTerm }, Cookies.get("jwt-token"));

export default api;
=======
/**
 * GET /api/courses
 * Fetch all available courses
 */
export const fetchAllCourses = () => {
  return publicRequest("/api/courses", "GET")
    .then((response) => {
      console.log("📢 API Response from /api/courses:", response); // Debug log
      return response;
    })
    .catch((error) => {
      logger.error(" Error fetching courses:", error);
      return [];
    });
};

/**
 * GET /api/courses/:level
 * Fetch a course by its level
 */
export const fetchCourseByLevel = (level) => {
  return publicRequest(`/api/courses/${level}`, "GET")
    .then((response) => response)
    .catch((error) => {
      logger.error(` Error fetching course for level ${level}:`, error);
      return null;
    });
};

/**
 * PUT /api/courses/course_name/:level
 * Update a course name (Requires Auth)
 */
export const updateCourseName = (level, courseName) => {
  return publicRequest(
    `/api/courses/course_name/${level}`,
    "PUT",
    { course_name: courseName },
    getAuthHeaders()
  )
    .then((response) => response)
    .catch((error) => {
      logger.error(` Error updating course name for level ${level}:`, error);
      throw error;
    });
};

/**
 * PUT /api/courses/prerequisite/:level
 * Update a course prerequisite (Requires Auth)
 */
export const updateCoursePrerequisite = (level, prerequisite) => {
  return publicRequest(
    `/api/courses/prerequisite/${level}`,
    "PUT",
    { prerequisite },
    getAuthHeaders()
  )
    .then((response) => response)
    .catch((error) => {
      logger.error(` Error updating prerequisite for level ${level}:`, error);
      throw error;
    });
};

/**
 * POST /api/courses
 * Add a new course (Requires Auth)
 */
export const addCourse = (courseData) => {
  return publicRequest("/api/courses", "POST", courseData, getAuthHeaders())
    .then((response) => response)
    .catch((error) => {
      logger.error(` Error adding course:`, error);
      throw error;
    });
};

/**
 * DELETE /api/courses/:level
 * Delete a course by level (Requires Auth)
 */
export const deleteCourse = (level) => {
  return publicRequest(`/api/courses/${level}`, "DELETE", null, getAuthHeaders())
    .then((response) => response)
    .catch((error) => {
      logger.error(` Error deleting course with level ${level}:`, error);
      throw error;
    });
};
>>>>>>> Stashed changes
