import axios from "axios";
import Cookies from "js-cookie";
import logger from "@/utils/logger";

// Adjust if your server runs on a different port
const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Create an Axios instance
const api = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// If any routes require auth, attach JWT from cookies:
function getAuthHeaders() {
  const token = Cookies.get("jwt-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** 
 * GET /api/advising
 * Fetch all advising records
 */
export async function fetchAllAdvisingRecords() {
  try {
    const response = await api.get("/api/advising", {
      headers: getAuthHeaders(),
    });
    return response.data; 
  } catch (error) {
    logger.error("Error fetching all advising records:", error);
    throw error;
  }
}

/** 
 * GET /api/advising/email/:email
 * Fetch advising records for a specific student by email
 */
export async function fetchAdvisingRecordsByEmail(email) {
  try {
    const response = await api.get(`/api/advising/email/${email}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    logger.error(`Error fetching advising records for ${email}:`, error);
    throw error;
  }
}

/**
 * POST /api/advising
 * Create a new advising record 
 * (adjust the recordData shape to match your controller)
 */
export async function createAdvisingRecord(recordData) {
  try {
    const response = await api.post("/api/advising", recordData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    logger.error("Error creating new advising record:", error);
    throw error;
  }
}

/**
 * PUT /api/advising/:id
 * Update a record's status
 * (adjust request body as needed – your controller might expect { status }, etc.)
 */
export async function updateAdvisingStatus(id, status) {
  try {
    const response = await api.put(
      `/api/advising/${id}`,
      { status }, // or your actual fields
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    logger.error(`Error updating advising record with ID ${id}:`, error);
    throw error;
  }
}

// Optional: export a default "api" instance if needed
export default api;
