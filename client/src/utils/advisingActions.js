import Cookies from "js-cookie";
import logger from "@/utils/logger";
import publicRequest from "./publicRequest"; // ✅ Ensure consistency

// Attach Authorization header
function getAuthHeaders() {
  const token = Cookies.get("jwt-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** 
 * GET /api/advising
 * Fetch all advising records
 */
export function fetchAllAdvisingRecords() {
  return publicRequest("/api/advising", "GET", null, getAuthHeaders())
    .then((response) => {
      if (response.ok) { // ✅ Check for successful HTTP response
        return response.json();
      } else {
        console.error("❌ Unexpected response format:", response);
        return [];
      }
    })
    .catch((error) => {
      logger.error("❌ Error fetching all advising records:", error);
      return [];
    });
}

/** 
 * GET /api/advising/email/:email
 * Fetch advising records for a specific student by email
 */
export function fetchAdvisingRecordsByEmail(email) {
  return publicRequest(`/api/advising/email/${email}`, "GET", null, getAuthHeaders())
    .then(async (response) => {
      console.log("📥 Raw API Response:", response); // ✅ Debugging log

      if (Array.isArray(response)) {  // ✅ Directly check if it's an array
        console.log("✅ Successfully fetched advising records:", response);
        return response; // ✅ Return response as-is
      }

      console.error(`❌ Unexpected response type:`, response);
      return [];
    })
    .catch((error) => {
      console.error(`❌ Fetch Error for advising records (${email}):`, error);
      return [];
    });
}



/**
 * POST /api/advising
 * Create a new advising record 
 */
export function createAdvisingRecord(recordData) {
  return publicRequest("/api/advising", "POST", recordData, getAuthHeaders())
    .then((response) => {
      if (response.ok) { // ✅ Check for successful request
        return response.json();
      } else {
        console.error("❌ Unexpected response while creating advising record:", response);
        return null;
      }
    })
    .catch((error) => {
      logger.error("❌ Error creating new advising record:", error);
      throw error;
    });
}

/**
 * PUT /api/advising/:id
 * Update a record's status
 */
export function updateAdvisingStatus(id, status) {
  return publicRequest(`/api/advising/${id}`, "PUT", { status }, getAuthHeaders())
    .then((response) => {
      if (response.ok) { // ✅ Check response status
        return response.json();
      } else {
        console.error(`❌ Unexpected response while updating advising record with ID ${id}:`, response);
        return null;
      }
    })
    .catch((error) => {
      logger.error(`❌ Error updating advising record with ID ${id}:`, error);
      throw error;
    });
}
