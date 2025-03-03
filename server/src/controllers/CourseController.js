import CoursesModel from "../models/CoursesModel.js";
import logger from "../utils/logger.js"; //  Import logger

class CourseController {
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
    }
  }
}

export default CourseController;
