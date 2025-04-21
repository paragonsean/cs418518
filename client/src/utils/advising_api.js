import Cookies from "js-cookie";
import urlJoin from "url-join";
import publicRequest from "@/utils/public_request";
import { getToken } from "@/lib/token_utils";
import { fetchJson } from "@/utils/fetch_wrapper"; // Import our centralized wrapper

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

// Auth Header Builder
const getAuthHeaders = () => {
  const token = Cookies.get("authToken");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
};

// POST to update courses for an advising record
export async function updateCoursesFromAdvising(advisingId) {
  const token = getToken();
  const url = urlJoin(BASE_URL, `/api/admin/advising/${advisingId}/update-courses`);
  return await publicRequest(url, "POST", null, token);
}

// Admin: Fetch all advising records
export const fetchAllAdvisingRecords = async () =>
  await fetchJson(`${BASE_URL}/api/advising`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

// Fetch all courses
export const fetchAllCourses = async () =>
  await fetchJson(`${BASE_URL}/api/courses`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

// Fetch advising records for logged-in user
export const fetchAdvisingRecords = async () =>
  await fetchJson(`${BASE_URL}/api/advising/email`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

// Fetch specific advising record
export const fetchAdvisingRecordById = async (id) =>
  await fetchJson(`${BASE_URL}/api/advising/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

// Update advising status
export const updateAdvisingStatus = async (id, status) =>
  await fetchJson(`${BASE_URL}/api/advising/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

// Create advising record
export const createAdvisingRecord = async (recordData) =>
  await fetchJson(`${BASE_URL}/api/advising`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(recordData),
  });

// Fetch completed courses for the current user
export const fetchCompletedCourses = async () => {
  const token = Cookies.get("authToken");
  if (!token) return [];
  return await fetchJson(`${BASE_URL}/api/completed-courses/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Admin: Fetch completed courses by student ID
export const fetchCompletedCoursesByStudentId = async (studentId) => {
  const token = Cookies.get("authToken");
  if (!token) return [];
  return await fetchJson(urlJoin(BASE_URL, `/api/completed-courses/${studentId}`), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Admin: Fetch completed courses by student email
export const fetchCompletedCoursesByStudentEmail = async (email) => {
  const token = Cookies.get("authToken");
  if (!token) return [];
  return await fetchJson(`${BASE_URL}/api/completed-courses/email/${email}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// User: Fetch completed courses by email
export const fetchCompletedCoursesForUser = async (email) => {
  const token = Cookies.get("authToken");
  if (!token) return [];
  return await fetchJson(`${BASE_URL}/api/completed-courses/email/${email}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
