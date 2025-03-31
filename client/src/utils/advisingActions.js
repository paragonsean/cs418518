import Cookies from "js-cookie";
import logger from "@/utils/logger";

// ✅ Function to get authentication headers
function getAuthHeaders() {
  const token = Cookies.get("jwt-token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/** 
 * GET /api/advising (Admin Only)
 * Fetch all advising records
 */
export async function fetchAllAdvisingRecords() {
  try {
    const response = await fetch(`${BASE_URL}/api/advising`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    logger.error("❌ Error fetching all advising records:", error);
    throw error;
  }
}

/** 
 * GET /api/advising/email (Fetch advising records for authenticated user)
 */
export async function fetchAdvisingRecords() {
  try {
    const response = await fetch(`${BASE_URL}/api/advising/email`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      logger.error(`❌ HTTP ${response.status} Error: ${response.statusText}`);
      throw new Error(`Unexpected response: HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid data format: expected an array");
    }

    logger.info("✅ Successfully fetched advising records:", data);
    return data;
  } catch (error) {
    logger.error("❌ Fetch Error for advising records:", error);
    throw error;
  }
}

/**
 * POST /api/advising
 * Create a new advising record 
 */
export async function createAdvisingRecord(recordData) {
  try {
    const token = Cookies.get("jwt-token");
    if (!token) {
      logger.warn("⚠️ No auth token found! Redirecting to login...");
      window.location.href = "/login";
      return;
    }

    const response = await fetch(`${BASE_URL}/api/advising`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recordData),
    });

    const responseText = await response.text(); // Read raw response

    if (!response.ok) {
      logger.error(`❌ HTTP ${response.status} Error: ${response.statusText}`);
      logger.error("🔍 Response Body:", responseText);
      throw new Error(`Unexpected response: HTTP ${response.status} - ${responseText}`);
    }

    return JSON.parse(responseText);
  } catch (error) {
    logger.error("❌ Error creating new advising record:", error);
    throw error;
  }
}

/**
 * GET /api/advising/:id
 * Fetch a single advising record by ID
 */
export async function fetchAdvisingRecordById(id) {
  try {
    logger.info(`📡 Fetching advising record with ID: ${id}`);

    const response = await fetch(`${BASE_URL}/api/advising/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const responseText = await response.text();

    if (!response.ok) {
      logger.error(`❌ HTTP ${response.status} Error: ${response.statusText}`);
      logger.error("🔍 Response Body:", responseText);
      throw new Error(`Error fetching record: HTTP ${response.status} - ${responseText}`);
    }

    return JSON.parse(responseText);
  } catch (error) {
    logger.error("❌ Error fetching advising record:", error);
    throw error;
  }
}

/**
 * PUT /api/advising/:id
 * Update an advising record
 */
export async function updateAdvisingRecord(id, updatedData) {
  try {
    const response = await fetch(`${BASE_URL}/api/advising/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error(`❌ Error updating record: HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    logger.error("❌ Error updating advising record:", error);
    throw error;
  }
}

/**
 * PUT /api/advising/:id/status
 * Update a record's status
 */
export async function updateAdvisingStatus(id, status) {
  try {
    const response = await fetch(`${BASE_URL}/api/advising/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`❌ HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    logger.error(`❌ Error updating advising record with ID ${id}:`, error);
    throw error;
  }
}
