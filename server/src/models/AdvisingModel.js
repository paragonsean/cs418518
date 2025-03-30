// File: src/models/AdvisingModel.js
import database from "../database.js";  // or wherever your DB pool is exported
import logger from "../utils/logger.js"; // optional logger

class AdvisingModel {
  /**
   * Get all student records from `courseadvising`
   */
  static async getAllRecords() {
    try {
      const [rows] = await database.execute("SELECT * FROM courseadvising");
      return rows;
    } catch (error) {
      logger.error("Error fetching all advising records:", error.message);
      throw error;
    }
  }

  /**
   * Get records by student name
   */
  static async getRecordsByName(studentName) {
    try {
      const [rows] = await database.execute(
        "SELECT * FROM courseadvising WHERE student_name = ?",
        [studentName]
      );
      return rows; // can be an empty array if none found
    } catch (error) {
      logger.error(`Error fetching advising records for ${studentName}:`, error.message);
      throw error;
    }
  }

  /**
   * Create a new advising record
   */
  static async createAdvisingRecord({
    date,
    current_term,
    last_term,
    last_gpa,
    prerequisites,
    student_name,
    planned_courses,
    student_email
  }) {
    try {
      // Insert new row with a default status = 'Pending' and rejectionReason = 'N/A'
      const [result] = await database.execute(
        `INSERT INTO courseadvising 
         (date, current_term, status, last_term, last_gpa, prerequisites, 
          student_name, planned_courses, student_email, rejectionReason)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [
          date,
          current_term,
          "Pending",
          last_term,
          last_gpa,
          prerequisites,
          student_name,
          planned_courses,
          student_email,
          "N/A"
        ]
      );

      return result; // You could return { insertId: result.insertId, etc. }
    } catch (error) {
      logger.error("Error creating new advising record:", error.message);
      throw error;
    }
  }

  /**
   * Update record status (and rejectionReason) by record ID
   */
  static async updateStatusById(id, status, rejectionReason) {
    try {
      const [result] = await database.execute(
        "UPDATE courseadvising SET status=?, rejectionReason=? WHERE id=?",
        [status, rejectionReason, id]
      );

      return result; // result.affectedRows = 0 if no record found
    } catch (error) {
      logger.error(`Error updating status for record ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Get a single record's email (for sending status change emails)
   */
  static async getStudentEmailById(id) {
    try {
      const [rows] = await database.execute(
        "SELECT student_email FROM courseadvising WHERE id = ?",
        [id]
      );
      if (rows.length === 0) return null;
      return rows[0].student_email;
    } catch (error) {
      logger.error(`Error retrieving student_email for record ${id}:`, error.message);
      throw error;
    }
  }
}

export default AdvisingModel;
