import pool from "../config/connectdb.js";
import logger from "../utils/my_logger.js"; //  Import logger

class CoursesModel {
  //  Get all courses
  static async getAllCourses() {
    try {
      const [rows] = await pool.execute("SELECT * FROM courses");
      logger.info(" Retrieved all courses from the database.");
      return rows;
    } catch (error) {
      logger.error(` Error retrieving courses: ${error.message}`);
      throw error;
    }
  }

  // Get course by level
  static async getCourseByLevel(level) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM courses WHERE course_level = ?",
        [level],
      );
      if (rows.length === 0) {
        logger.warn(`Course not found for level: ${level}`);
        return null;
      }
      logger.info(` Course found for level: ${level}`);
      return rows[0];
    } catch (error) {
      logger.error(
        ` Error retrieving course for level ${level}: ${error.message}`,
      );
      throw error;
    }
  }

  // Update course name
  static async updateCourseName(level, courseName) {
    try {
      const [result] = await pool.execute(
        "UPDATE courses SET course_name=? WHERE course_level=?",
        [courseName, level],
      );
      if (result.affectedRows === 0) {
        logger.warn(`Course not found for update: ${level}`);
        return false;
      }
      logger.info(` Course name updated for level: ${level}`);
      return true;
    } catch (error) {
      logger.error(
        ` Error updating course name for level ${level}: ${error.message}`,
      );
      throw error;
    }
  }

  // Update course prerequisite
  static async updateCoursePrerequisite(level, prerequisite) {
    try {
      const [result] = await pool.execute(
        "UPDATE courses SET prerequisite=? WHERE course_level=?",
        [prerequisite, level],
      );
      if (result.affectedRows === 0) {
        logger.warn(`Course not found for prerequisite update: ${level}`);
        return false;
      }
      logger.info(` Prerequisite updated for level: ${level}`);
      return true;
    } catch (error) {
      logger.error(
        ` Error updating prerequisite for level ${level}: ${error.message}`,
      );
      throw error;
    }
  }

  // Add a new course
  static async addCourse({
    course_name,
    course_level,
    prerequisite,
    course_lvlGroup,
  }) {
    if (!course_name || !course_level) {
      logger.warn("Missing required fields when adding a course.");
      throw new Error("Missing required fields");
    }

    try {
      const [result] = await pool.execute(
        "INSERT INTO courses (course_name, course_level, prerequisite, course_lvlGroup) VALUES (?, ?, ?, ?)",
        [course_name, course_level, prerequisite, course_lvlGroup],
      );
      logger.info(` New course added: ${course_name} (Level: ${course_level})`);
      return { id: result.insertId };
    } catch (error) {
      logger.error(
        ` Error inserting course (${course_name}): ${error.message}`,
      );
      throw error;
    }
  }

  // 6️⃣ Delete course
  static async deleteCourse(level) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM courses WHERE course_level=?",
        [level],
      );
      if (result.affectedRows === 0) {
        logger.warn(`Course not found for deletion: ${level}`);
        return false;
      }
      logger.info(` Course deleted: Level ${level}`);
      return true;
    } catch (error) {
      logger.error(
        ` Error deleting course for level ${level}: ${error.message}`,
      );
      throw error;
    }
  }
}

export default CoursesModel;