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
 * POST /api/admin/advising/:id/update-courses
 * Convert planned_courses into completed_courses for a student
 */
export async function updateCoursesFromAdvising(id) {
  try {
    const token = getAuthToken();
    return await publicRequest(`/api/admin/advising/${id}/update-courses`, "POST", null, token);
  } catch (error) {
    logger.error(`Error updating courses from advising ID ${id}:`, error);
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

/**
 * DELETE /api/admin/advising/:id
 * Delete an advising record (admin only)
 */
export async function deleteAdvisingRecordByAdmin(id) {
  try {
    const token = getAuthToken();
    return await publicRequest(`/api/admin/advising/${id}`, "DELETE", null, token);
  } catch (error) {
    logger.error(`Error deleting advising record ID ${id} (admin):`, error);
    throw error;
  }
}
