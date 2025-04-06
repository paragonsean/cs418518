import Cookies from "js-cookie";
import logger from "@/utils/my_logger";
import publicRequest from "@/utils/public_request";

// 🔒 Auth helper
function getAuthToken() {
  const token = Cookies.get("authToken");
  if (!token) {
    console.error("Missing auth token.");
    window.location.href = "/login";
    throw new Error("No auth token.");
  }
  return token;
}

//////////////////////////////////////////////////////////
// 📘 STUDENT ENDPOINTS (/api/advising)
//////////////////////////////////////////////////////////

/**
 * GET /api/advising/email
 * Fetch advising records for the logged-in student
 */
export async function fetchAdvisingRecords() {
  try {
    const token = getAuthToken();
    const data = await publicRequest("/api/advising/email", "GET", null, token);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    logger.error("Error fetching student advising records:", error);
    return [];
  }
}

/**
 * POST /api/advising
 * Create a new advising record
 */
export async function createAdvisingRecord(recordData) {
  try {
    const token = getAuthToken();
    return await publicRequest("/api/advising", "POST", recordData, token);
  } catch (error) {
    logger.error("Error creating advising record:", error);
    throw error;
  }
}

/**
 * GET /api/advising/:id
 * Fetch an advising record by ID (used on student side)
 */
export async function fetchAdvisingRecordById(id) {
  try {
    const token = getAuthToken();
    return await publicRequest(`/api/advising/${id}`, "GET", null, token);
  } catch (error) {
    logger.error("Error fetching advising record by ID:", error);
    throw error;
  }
}

/**
 * PUT /api/advising/record/:id
 * Full update of a student advising record
 */
export async function updateAdvisingRecord(id, updatedData) {
  try {
    const token = getAuthToken();
    return await publicRequest(`/api/advising/record/${id}`, "PUT", updatedData, token);
  } catch (error) {
    logger.error("Error updating advising record:", error);
    throw error;
  }
}

//////////////////////////////////////////////////////////
// 👨‍💼 ADMIN ENDPOINTS (/api/admin/advising)
//////////////////////////////////////////////////////////

/**
 * GET /api/admin/advising
 * Fetch all advising records (admin only)
 */
export async function fetchAllAdvisingRecords() {
  try {
    const token = getAuthToken();
    const data = await publicRequest("/api/admin/advising", "GET", null, token);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    logger.error("Error fetching all advising records (admin):", error);
    throw error;
  }
}

/**
 * GET /api/admin/advising/:id
 * Fetch a single advising record (admin only)
 */
export async function fetchAdvisingRecordByAdmin(id) {
  try {
    const token = getAuthToken();
    return await publicRequest(`/api/admin/advising/${id}`, "GET", null, token);
  } catch (error) {
    logger.error(`Error fetching advising record ID ${id} (admin):`, error);
    throw error;
  }
}

/**
 * PUT /api/admin/advising/:id
 * Update only the status (admin approval/rejection)
 */
export async function updateAdvisingStatus(id, status, rejectionReason = "N/A") {
  try {
    const token = getAuthToken();
    return await publicRequest(`/api/admin/advising/${id}`, "PUT", { status, rejectionReason }, token);
  } catch (error) {
    logger.error(`Error updating status for record ${id}:`, error);
    throw error;
  }
}

/**
 * PUT /api/admin/advising/record/:id
 * Full update of advising record (admin only)
 */
export async function updateAdvisingRecordByAdmin(id, updatedData) {
  try {
    const token = getAuthToken();
    return await publicRequest(`/api/admin/advising/record/${id}`, "PUT", updatedData, token);
  } catch (error) {
    logger.error(`Error updating advising record ${id} (admin):`, error);
    throw error;
  }
}
