// utils/fetch_wrapper.js or at top of this file

export const fetchJson = async (endpoint, options = {}) => {
    try {
      const response = await fetch(endpoint, options);
  
      if (response.status === 404) return []; // Gracefully handle no content
  
      const data = await response.json().catch(() => null); // Handle empty response body
  
      if (!response.ok) {
        throw new Error(data?.message || `Request failed with status ${response.status}`);
      }
  
      return data ?? [];
    } catch (error) {
      console.error(`Fetch error: ${endpoint}`, error);
      throw error;
    }
  };
  