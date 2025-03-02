import axios from "axios";
import Cookies from "js-cookie";
import logger from "@/utils/logger";
import publicRequest from "./publicRequest";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
