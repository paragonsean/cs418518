import Cookies from "js-cookie";
import logger from "@/utils/logger";

// Attach Authorization header
function getAuthHeaders() {
  const token = Cookies.get("jwt-token"); //Standardized token name
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

/** 
 * GET /api/advising (Admin Only)
 * Fetch all advising records
 */
export async function fetchAllAdvisingRecords() {
  try {
    const response = await fetch("http://localhost:8000/api/advising", {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json(); //Return parsed data
  } catch (error) {
    logger.error("❌ Error fetching all advising records:", error);
    throw error; //Ensure errors bubble up
  }
}

/** 
 * GET /api/advising/email (Fetch advising records for authenticated user)
 */export async function fetchAdvisingRecords() {
  try {
    const response = await fetch("http://localhost:8000/api/advising/email", {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(`❌ HTTP ${response.status} Error: ${response.statusText}`);
      throw new Error(`Unexpected response: HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("⚠️ Invalid response format: expected an array but got:", data);
      return []; // Return an empty array instead of throwing an error
    }

    if (data.length === 0) {
      console.warn("⚠️ No advising records found.");
    } else {
      console.log("✅ Successfully fetched advising records:", data);
    }

    return data;
  } catch (error) {
    console.error("❌ Fetch Error for advising records:", error);
    return []; // Ensure no crashes by returning an empty array
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
      console.error("❌ No auth token found! Redirecting to login...");
      window.location.href = "/login";
      return;
    }

    const response = await fetch("http://localhost:8000/api/advising", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recordData),
    });

    const responseText = await response.text(); //Read raw response

    if (!response.ok) {
      console.error(`❌ HTTP ${response.status} Error: ${response.statusText}`);
      console.error("❌ Response Body:", responseText); //Log response body
      throw new Error(`Unexpected response: HTTP ${response.status} - ${responseText}`);
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error("❌ Error creating new advising record:", error);
    throw error;
  }
}
export async function fetchAdvisingRecordById(id) {
  try {
    console.log(`📡 Fetching advising record with ID: ${id}`);

    const response = await fetch(`http://localhost:8000/api/advising/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),  //Include Authorization header
    });

    const responseText = await response.text(); //Read raw response

    if (!response.ok) {
      console.error(`❌ HTTP ${response.status} Error: ${response.statusText}`);
      console.error("❌ Response Body:", responseText);
      throw new Error(`Error fetching record: HTTP ${response.status} - ${responseText}`);
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error("❌ Error fetching advising record:", error);
    throw error;
  }
}


export async function updateAdvisingRecord(id, updatedData) {
  try {
    const response = await fetch(`http://localhost:8000/api/advising/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error(`Error updating record: HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating advising record:", error);
    throw error;
  }
}

/**
 * PUT /api/advising/:id
 * Update a record's status
 */
export async function updateAdvisingStatus(id, status) {
  try {
    const response = await fetch(`http://localhost:8000/api/advising/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json(); //Return updated record
  } catch (error) {
    logger.error(`❌ Error updating advising record with ID ${id}:`, error);
    throw error;
  }
}
