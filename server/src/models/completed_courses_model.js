import db from "../config/connectdb.js"; // Assuming you have a pool connection

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
      const [rows] = await db.execute(query, [email]);
      return rows;
    } catch (error) {
      console.error("Error fetching completed courses from DB:", error);
      throw new Error("Database query failed while fetching completed courses");
    }
  }

  /**
   * Add a completed course to the database for a student
   * @param {string} email - The student's email
   * @param {string} courseName - The name of the completed course
   * @param {string} term - The academic term in which the course was completed
   * @param {string} grade - The grade received in the course
   */
  static async setCompletedCourse(email, courseName, term, grade) {
    try {
      // Ensure that all required fields are provided
      if (!email || !courseName || !term || !grade) {
        throw new Error("Missing required fields");
      }

      const validGrades = ["A", "B", "C", "D", "F", "A+", "B-", "C+", "IP", "In Progress"];
      if (!validGrades.includes(grade)) {
        throw new Error(`Invalid grade format: ${grade}`);
      }
      
      // Query to insert the completed course record into the database
      const query = `
        INSERT INTO completed_courses (student_email, course_name, term, grade)
        VALUES (?, ?, ?, ?)
      `;
      const [result] = await db.execute(query, [email, courseName, term, grade]);

      if (result.affectedRows === 0) {
        throw new Error("Failed to add the completed course");
      }

      // Optionally, retrieve the ID of the inserted course
      const courseId = result.insertId;

      // Return a success message along with the inserted course details
      return { message: "Completed course added successfully", courseId, email, courseName, term, grade };
    } catch (error) {
      console.error("Error adding completed course to DB:", error);
      throw new Error("Database query failed while adding completed course");
    }
  }
}


export default CompletedCoursesModel;
