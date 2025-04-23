import { executeQuery } from "../config/connectdb.js";

class CompletedCoursesModel {
  /**
   * Fetch completed courses by student email
   */
  static async getCompletedCoursesByEmail(email) {
    try {
      const query = `
        SELECT * FROM completed_courses
        WHERE student_email = ?
      `;
      const [rows] = await executeQuery(query, [email]);
      return rows;
    } catch (error) {
      console.error("Error fetching completed courses from DB:", error);
      throw new Error("Database query failed while fetching completed courses");
    }
  }

  /**
   * Fetch all unique completed courses (no duplicates)
   */
  static async getAllUniqueCompletedCourses() {
    try {
      const query = `
        SELECT DISTINCT course_name
        FROM completed_courses
        ORDER BY course_name
      `;
      const [rows] = await executeQuery(query);
      return rows;
    } catch (error) {
      console.error("Error fetching unique completed courses from DB:", error);
      throw new Error("Database query failed while fetching unique completed courses");
    }
  }
  /**
 * Delete a completed course for a specific student
 * @param {string} email - The student's email
 * @param {string} courseName - The name of the course to delete
 * @param {string} term - The academic term the course was completed
 */
static async deleteCompletedCourse(email, courseName, term) {
  try {
    if (!email || !courseName || !term) {
      throw new Error("Missing required fields for course deletion");
    }

    const query = `
      DELETE FROM completed_courses
      WHERE student_email = ? AND course_name = ? AND term = ?
    `;

    const [result] = await executeQuery(query, [email, courseName, term]);

    if (result.affectedRows === 0) {
      throw new Error("No matching course found to delete");
    }

    return { message: "Completed course deleted successfully", email, courseName, term };
  } catch (error) {
    console.error("Error deleting completed course from DB:", error);
    throw new Error("Database query failed while deleting completed course");
  }
}

  /**
   * Add a completed course to the database for a student
   */
  static async setCompletedCourse(email, courseName, current_term, grade) {
    try {
      if (!email || !courseName || !current_term || !grade) {
        throw new Error("Missing required fields");
      }

      const validGrades = ["A", "B", "C", "D", "F", "A+", "B-", "C+", "IP", "In Progress"];
      if (!validGrades.includes(grade)) {
        throw new Error(`Invalid grade format: ${grade}`);
      }

      const query = `
        INSERT INTO completed_courses (student_email, course_name, term, grade)
        VALUES (?, ?, ?, ?)
      `;
      const [result] = await executeQuery(query, [email, courseName, current_term, grade]);

      if (result.affectedRows === 0) {
        throw new Error("Failed to add the completed course");
      }

      const courseId = result.insertId;
      return { message: "Completed course added successfully", courseId, email, courseName, current_term, grade };
    } catch (error) {
      console.error("Error adding completed course to DB:", error);
      throw new Error("Database query failed while adding completed course");
    }
  }
}


export default CompletedCoursesModel;
