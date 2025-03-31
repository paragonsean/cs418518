import CoursesModel from "../models/CoursesModel.js";
import logger from "../utils/logger.js"; //  Import logger

class CourseController {
<<<<<<< Updated upstream
  //  Get all courses
  static async getAllCourses(req, res) {
    try {
      const data = await CoursesModel.getAllCourses();
      logger.info(" Retrieved all courses from the database.");
      res
        .status(200)
        .json({ status: "success", message: "All classes retrieved", data });
    } catch (error) {
      logger.error(` Error retrieving courses: ${error.message}`);
      res.status(500).json({
        status: "failed",
        message: "Database error",
        error: error.message,
      });
    }
  }

  // Get all prerequisite courses
  static async getPrereqCourses(req, res) {
    try {
      const data = await CoursesModel.getPrereqCourses();
      logger.info(" Retrieved all prerequisite courses.");
      res.status(200).json({
        status: "success",
        message: "Prerequisite courses retrieved",
        data,
      });
    } catch (error) {
      logger.error(` Error retrieving prerequisite courses: ${error.message}`);
      res.status(500).json({
        status: "failed",
        message: "Database error",
        error: error.message,
      });
    }
  }

  // Get all non-prerequisite courses
  static async getNonPrereqCourses(req, res) {
=======
  // Get all courses
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

  // Get course by course level
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

  // Update course name
  static async updateCourseName(req, res) {
>>>>>>> Stashed changes
    try {
      const data = await CoursesModel.getNonPrereqCourses();
      logger.info(" Retrieved all non-prerequisite courses.");
      res.status(200).json({
        status: "success",
        message: "Non-prerequisite courses retrieved",
        data,
      });
    } catch (error) {
      logger.error(
        ` Error retrieving non-prerequisite courses: ${error.message}`,
      );
<<<<<<< Updated upstream
      res.status(500).json({
        status: "failed",
        message: "Database error",
        error: error.message,
      });
    }
  }

  // Toggle Prerequisite status
  static async togglePrereqStatus(req, res) {
    const { Course_Name } = req.body;
    if (!Course_Name) {
      logger.warn("Missing Course_Name field in request.");
      return res
        .status(400)
        .json({ status: "failed", message: "Course_Name is required" });
    }
=======

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

  // Update course prerequisite
  static async updateCoursePrerequisite(req, res) {
    try {
      const { level } = req.params;
      const { prerequisite } = req.body;
>>>>>>> Stashed changes

    try {
      const newPrereqValue = await CoursesModel.togglePrereqStatus(Course_Name);
      if (newPrereqValue === null) {
        logger.warn(`Course not found for prerequisite toggle: ${Course_Name}`);
        return res
          .status(404)
          .json({ status: "failed", message: "Course not found" });
      }

      logger.info(
        ` Prerequisite status updated for ${Course_Name}: ${newPrereqValue}`,
      );
<<<<<<< Updated upstream
      res.status(200).json({
        status: "success",
        message: `Prerequisite set to ${newPrereqValue} for ${Course_Name}`,
      });
    } catch (error) {
      logger.error(
        ` Error toggling prerequisite status for ${Course_Name}: ${error.message}`,
      );
      res.status(500).json({
        status: "failed",
        message: "Database error",
        error: error.message,
      });
    }
  }

  // 5️⃣ Fetch prerequisites for a student
  static async getPrereqData(req, res) {
    const { Email, Current_Term } = req.body;
    if (!Email || !Current_Term) {
      logger.warn("Missing Email or Current_Term fields in request.");
      return res.status(400).json({
        status: "failed",
        message: "Email and Current_Term are required",
      });
    }

    try {
      const data = await CoursesModel.getPrereqData(Email, Current_Term);
      logger.info(
        ` Retrieved prerequisite data for student: ${Email} (Term: ${Current_Term})`,
      );
      res.status(200).json({
        status: "success",
        message: "Prerequisite data retrieved",
        data,
      });
    } catch (error) {
      logger.error(
        ` Error retrieving prerequisite data for ${Email}: ${error.message}`,
      );
      res.status(500).json({
        status: "failed",
        message: "Database error",
        error: error.message,
      });
    }
  }

  // 6️⃣ Fetch course plan data for a student
  static async getCoursePlanData(req, res) {
    const { Email, Current_Term } = req.body;
    if (!Email || !Current_Term) {
      logger.warn("Missing Email or Current_Term fields in request.");
      return res.status(400).json({
        status: "failed",
        message: "Email and Current_Term are required",
      });
    }

    try {
      const data = await CoursesModel.getCoursePlanData(Email, Current_Term);
      logger.info(
        ` Retrieved course plan data for student: ${Email} (Term: ${Current_Term})`,
      );
      res.status(200).json({
        status: "success",
        message: "Course plan data retrieved",
        data,
      });
    } catch (error) {
      logger.error(
        ` Error retrieving course plan data for ${Email}: ${error.message}`,
      );
      res.status(500).json({
        status: "failed",
        message: "Database error",
        error: error.message,
      });
=======

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

  // Add a new course
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

  // Delete a course
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
>>>>>>> Stashed changes
    }
  }
}

export default CourseController;
