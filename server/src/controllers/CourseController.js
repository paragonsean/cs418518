import pool from "../config/connectdb.js"; // Import pool connection
import logger from "../utils/logger.js"; // Import logger

class CourseController {
  //Get all courses
  static async getAllCourses(req, res) {
    try {
      const [rows] = await pool.execute("SELECT * FROM courses");
      if (!rows.length) {
        return res.status(404).json({ status: 404, message: "No courses found" });
      }
      logger.info("Retrieved all courses from the pool.");
      res.status(200).json(rows);
    } catch (error) {
      logger.error(` Error retrieving courses: ${error.message}`);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  }

  //Get course by course level
  static async getCourseByLevel(req, res) {
    try {
      const { level } = req.params;
      const [rows] = await pool.execute("SELECT * FROM courses WHERE course_level = ?", [level]);

      if (!rows.length) {
        return res.status(404).json({ status: 404, message: "Course not found" });
      }
      logger.info(`Course found for level: ${level}`);
      res.status(200).json(rows);
    } catch (error) {
      logger.error(` Error retrieving course for level ${req.params.level}: ${error.message}`);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  }

  //Update course name
  static async updateCourseName(req, res) {
    try {
      const { level } = req.params;
      const { course_name } = req.body;
      
      if (!course_name) {
        return res.status(400).json({ status: 400, message: "Missing course name" });
      }

      const [result] = await pool.execute(
        "UPDATE courses SET course_name = ? WHERE course_level = ?",
        [course_name, level]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ status: 404, message: "Course not found" });
      }
      logger.info(`Course name updated for level: ${level}`);
      res.status(200).json({ status: 200, message: "Course name updated successfully" });
    } catch (error) {
      logger.error(` Error updating course name: ${error.message}`);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  }

  //Update course prerequisite
  static async updateCoursePrerequisite(req, res) {
    try {
      const { level } = req.params;
      const { prerequisite } = req.body;

      if (!prerequisite) {
        return res.status(400).json({ status: 400, message: "Missing prerequisite" });
      }

      const [result] = await pool.execute(
        "UPDATE courses SET prerequisite = ? WHERE course_level = ?",
        [prerequisite, level]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ status: 404, message: "Course not found" });
      }
      logger.info(`Prerequisite updated for level: ${level}`);
      res.status(200).json({ status: 200, message: "Prerequisite updated successfully" });
    } catch (error) {
      logger.error(` Error updating prerequisite: ${error.message}`);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  }

  //Add a new course
  static async addCourse(req, res) {
    try {
      const { course_name, course_level, prerequisite, course_lvlGroup } = req.body;
      
      if (!course_name || !course_level) {
        return res.status(400).json({ status: 400, message: "Missing required fields" });
      }

      const [result] = await pool.execute(
        "INSERT INTO courses (course_name, course_level, prerequisite, course_lvlGroup) VALUES (?, ?, ?, ?)",
        [course_name, course_level, prerequisite, course_lvlGroup]
      );

      logger.info(`New course added: ${course_name} (Level: ${course_level})`);
      res.status(201).json({ status: 201, message: "Course successfully added", courseId: result.insertId });
    } catch (error) {
      logger.error(` Error adding course: ${error.message}`);
      res.status(500).json({ status: 500, message: "pool error" });
    }
  }

  //Delete a course
  static async deleteCourse(req, res) {
    try {
      const { level } = req.params;
      const [result] = await pool.execute("DELETE FROM courses WHERE course_level = ?", [level]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ status: 404, message: "Course not found" });
      }
      logger.info(`Course deleted: Level ${level}`);
      res.status(200).json({ status: 200, message: "Course deleted successfully" });
    } catch (error) {
      logger.error(` Error deleting course: ${error.message}`);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  }
}

export default CourseController;
