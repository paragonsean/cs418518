// File: src/models/CompletedCoursesModel.js
import db from "../config/connectdb.js"; // Assuming you have a pool connection

class CompletedCoursesModel {
  /**
   * Fetch completed courses by student email
   */
  static async getCompletedCoursesByEmail(email) {
    try {
      // Query the pool to fetch courses completed by the student using their email
      const query = `
        SELECT * FROM completed_courses
        WHERE student_email = ?
      `;
      const [rows] = await db.execute(query, [email]);

      return rows; // Return the fetched rows
    } catch (error) {
      console.error("Error fetching completed courses from DB:", error);
      throw error;
    }
  }
}

export default CompletedCoursesModel;