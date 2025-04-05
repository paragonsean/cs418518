import Cookies from "js-cookie";
import logger from "@/utils/logger";
import publicRequest from "@/utils/public_request"; // Import the publicRequest helper

/** 
 * GET /api/advising (Admin Only)
 * Fetch all advising records
 */
export async function fetchAllAdvisingRecords() {
  try {
    const data = await publicRequest("/api/advising", "GET", null, Cookies.get("authToken"));
    return data; // Return parsed data
  } catch (error) {
    logger.error("Error fetching all advising records:", error);
    throw error;
  }
}

/** 
 * GET /api/advising/email (Fetch advising records for authenticated user)
 */
export async function fetchAdvisingRecords() {
  try {
    const data = await publicRequest("/api/advising/email", "GET", null, Cookies.get("authToken"));

    if (!Array.isArray(data)) {
      console.error("Invalid response format: expected an array but got:", data);
      return []; // Return an empty array instead of throwing an error
    }

    if (data.length === 0) {
      console.warn("No advising records found.");
    } else {
      console.log("Successfully fetched advising records:", data);
    }

    return data;
  } catch (error) {
    console.error("Fetch Error for advising records:", error);
    return []; // Return an empty array on error to prevent crashes
  }
}

/**
 * POST /api/advising
 * Create a new advising record 
 */
export async function createAdvisingRecord(recordData) {
  try {
    const token = Cookies.get("authToken");
    if (!token) {
      console.error("No auth token found! Redirecting to login...");
      window.location.href = "/login";
      return;
    }

    const data = await publicRequest("/api/advising", "POST", recordData, token);

    return data;
  } catch (error) {
    console.error("Error creating new advising record:", error);
    throw error;
  }
}

export async function fetchAdvisingRecordById(id) {
  try {
    console.log(`📡 Fetching advising record with ID: ${id}`);

    const data = await publicRequest(`/api/advising/${id}`, "GET", null, Cookies.get("authToken"));

    return data;
  } catch (error) {
    console.error("Error fetching advising record:", error);
    throw error;
  }
}

/**
 * PUT /api/advising/record/:id
 * Update a full advising record (not just the status)
 */
export async function updateAdvisingRecord(id, updatedData) {
  try {
    const token = Cookies.get("authToken");
    if (!token) {
      throw new Error("No auth token found. User is not authenticated.");
    }

    const data = await publicRequest(`/api/advising/record/${id}`, "PUT", updatedData, token);

    return data;
  } catch (error) {
    console.error("Error updating advising record:", error);
    throw error;
  }
}

/**
 * PUT /api/advising/:id
 * Update a record's status
 */
export async function updateAdvisingStatus(id, status) {
  try {
    const data = await publicRequest(`/api/advising/${id}`, "PUT", { status }, Cookies.get("authToken"));

    return data; // Return updated record
  } catch (error) {
    logger.error(`Error updating advising record with ID ${id}:`, error);
    throw error;
  }
}
