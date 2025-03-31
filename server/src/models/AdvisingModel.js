import pool from "../config/connectdb.js";
import logger from "../utils/logger.js";

class AdvisingModel {
  /**
   * Get all advising records
   */
  static async getAllRecords() {
    try {
      const [rows] = await pool.execute("SELECT * FROM courseadvising ORDER BY date DESC");

      // 🔥 Convert `planned_courses` from JSON string to array safely
      rows.forEach((row) => {
        if (typeof row.planned_courses === "string") {
          try {
            row.planned_courses = JSON.parse(row.planned_courses);
          } catch (error) {
            logger.warn(`⚠️ Invalid JSON in planned_courses for record ID ${row.id}. Converting to an array.`);
            row.planned_courses = row.planned_courses.split(", ").map((course) => course.trim()); // Convert string to array
          }
        }
      });

      logger.info(`Retrieved ${rows.length} advising records.`);
      return rows;
    } catch (error) {
      logger.error(" Error fetching all advising records:", error.message);
      throw error;
    }
  }

  /**
   * Get records by student email
   */
  static async getRecordsByEmail(studentEmail) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM courseadvising WHERE student_email = ? ORDER BY date DESC",
        [studentEmail]
      );

      if (rows.length === 0) {
        logger.warn(`⚠️ No advising records found for ${studentEmail}`);
      }

      // 🔥 Convert `planned_courses` safely
      rows.forEach((row) => {
        if (typeof row.planned_courses === "string") {
          try {
            row.planned_courses = JSON.parse(row.planned_courses);
          } catch (error) {
            logger.warn(`⚠️ Invalid JSON in planned_courses for record ID ${row.id}. Converting to an array.`);
            row.planned_courses = row.planned_courses.split(", ").map((course) => course.trim());
          }
        }
      });

      return rows;
    } catch (error) {
      logger.error(` Error fetching advising records for ${studentEmail}:`, error.message);
      throw error;
    }
  }

  /**
   * Get an advising record by its ID
   */
  static async getRecordById(id) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM courseadvising WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        logger.warn(`⚠️ No advising record found with ID ${id}`);
        return null; // 🔥 Return null instead of throwing an error
      }

      // 🔥 Convert `planned_courses` safely
      if (typeof rows[0].planned_courses === "string") {
        try {
          rows[0].planned_courses = JSON.parse(rows[0].planned_courses);
        } catch (error) {
          logger.warn(`⚠️ Invalid JSON in planned_courses for record ID ${id}. Converting to an array.`);
          rows[0].planned_courses = rows[0].planned_courses.split(", ").map((course) => course.trim());
        }
      }

      logger.info(`Advising record ID ${id} retrieved successfully.`);
      return rows[0]; // 🔥 Return the record directly
    } catch (error) {
      logger.error(` Error fetching advising record for ID ${id}:`, error.message);
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
    student_email,
  }) {
    try {
      if (!student_email || !current_term || !planned_courses) {
        throw new Error(" Missing required fields: student_email, current_term, or planned_courses");
      }

      const [result] = await pool.execute(
        `INSERT INTO courseadvising 
         (date, current_term, status, last_term, last_gpa, prerequisites, 
          student_name, planned_courses, student_email, rejectionReason)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          date || new Date().toISOString().split("T")[0], // Default to today's date
          current_term,
          "Pending", // Default status
          last_term,
          last_gpa,
          prerequisites || "None",
          student_name,
          JSON.stringify(planned_courses), // 🔥 Ensure planned_courses is stored as JSON
          student_email,
          "N/A", // Default rejection reason
        ]
      );

      logger.info(`New advising record created for ${student_email} (ID: ${result.insertId})`);
      return { id: result.insertId };
    } catch (error) {
      logger.error(" Error creating new advising record:", error.message);
      throw error;
    }
  }
}

export default AdvisingModel;
