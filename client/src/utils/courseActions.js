import axios from "axios";
import Cookies from "js-cookie";
import logger from "@/utils/logger";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: SERVER_URL,
  headers: { "Content-Type": "application/json" },
});

// Helper function to attach JWT token
const getAuthHeaders = () => {
  const token = Cookies.get("jwt-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Fetch All Courses
export const fetchAllCourses = async () => {
  try {
    const response = await api.get("/courseadvising/courses");
    return response.data;
  } catch (error) {
    logger.error("Error fetching courses:", error);
    return { error: "Failed to fetch courses" };
  }
};

// ✅ Fetch Prerequisite Courses
export const fetchPrereqCourses = async () => {
  try {
    const response = await api.get("/courseadvising/prereq");
    return response.data;
  } catch (error) {
    logger.error("Error fetching prerequisite courses:", error);
    return { error: "Failed to fetch prerequisite courses" };
  }
};

// ✅ Fetch Non-Prerequisite Courses
export const fetchNonPrereqCourses = async () => {
  try {
    const response = await api.get("/courseadvising/non-prereq");
    return response.data;
  } catch (error) {
    logger.error("Error fetching non-prerequisite courses:", error);
    return { error: "Failed to fetch non-prerequisite courses" };
  }
};

// ✅ Toggle Prerequisite Status (Requires Auth)
export const updatePrereqStatus = async (courseName) => {
  try {
    const response = await api.put(
      "/courseadvising/toggle-prereq",
      { course_name: courseName },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    logger.error("Error toggling prerequisite status:", error);
    return { error: "Failed to toggle prerequisite status" };
  }
};

// ✅ Fetch Prerequisites for a Student (Requires Auth)
export const fetchStudentPrereq = async (email, currentTerm) => {
  try {
    const response = await api.post(
      "/courseadvising/prereq-data",
      { email, current_term: currentTerm },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    logger.error("Error fetching student prerequisites:", error);
    return { error: "Failed to fetch student prerequisites" };
  }
};

// ✅ Fetch Course Plan for a Student (Requires Auth)
export const fetchCoursePlan = async (email, currentTerm) => {
  try {
    const response = await api.post(
      "/courseadvising/course-plan",
      { email, current_term: currentTerm },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    logger.error("Error fetching course plan:", error);
    return { error: "Failed to fetch course plan" };
  }
};

export default api;
