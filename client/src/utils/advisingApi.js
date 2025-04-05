// advisingApi.js

import Cookies from "js-cookie";
import urlJoin from "url-join";

// Base URL for the API from environment variables
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

// Attach Authorization header
const getAuthHeaders = () => {
  const token = Cookies.get("authToken");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
};

/**
 * Fetch all advising records (Admin Only)
 */
export const fetchAllAdvisingRecords = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/advising`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch advising records");
    return data;
  } catch (error) {
    console.error("Error fetching all advising records:", error);
    throw error;
  }
};

// Ensure that the `fetchAllAdvisingRecords` is being **exported** correctly.

/**
 * Fetch all courses
 */
export const fetchAllCourses = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/courses`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch courses");
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

/**
 * Fetch completed courses for a specific user
 */
export const fetchCompletedCourses = async () => {
  try {
    const token = Cookies.get("authToken");
    if (!token) {
      console.error("No token found. User is not authenticated.");
      return [];
    }
    const response = await fetch(`${BASE_URL}/api/completed-courses/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch completed courses");
    return data;
  } catch (error) {
    console.error("Error fetching completed courses:", error);
    throw error;
  }
};

/**
 * Fetch advising records for a specific user
 */
export const fetchAdvisingRecords = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/advising/email`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch advising records");
    return data;
  } catch (error) {
    console.error("Error fetching advising records:", error);
    throw error;
  }
};

/**
 * Fetch advising record by ID
 */
export const fetchAdvisingRecordById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/api/advising/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch advising record");
    return data;
  } catch (error) {
    console.error("Error fetching advising record:", error);
    throw error;
  }
};

/**
 * Update advising record's status
 */
export const updateAdvisingStatus = async (id, status) => {
  try {
    const response = await fetch(`${BASE_URL}/api/advising/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update advising record status");
    return data;
  } catch (error) {
    console.error(`Error updating advising record with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new advising record
 */
export const createAdvisingRecord = async (recordData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/advising`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(recordData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to create advising record");
    return data;
  } catch (error) {
    console.error("Error creating advising record:", error);
    throw error;
  }
};

/**
 * Fetch completed courses for a specific user by email
 */
export const fetchCompletedCoursesForUser = async (email) => {
  try {
    const token = Cookies.get("authToken");
    if (!token) {
      console.error("No token found. User is not authenticated.");
      return [];
    }

    const url = urlJoin(BASE_URL, `/api/completed-courses/email/${email}`);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch user completed courses.");
    return await response.json();
  } catch (error) {
    console.error(`Error fetching completed courses for ${email}:`, error);
    return [];
  }
};
