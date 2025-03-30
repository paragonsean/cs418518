// File: controllers/courseController.js
import CourseModel from "../models/CourseModel.js";

class CourseController {
  // GET /api/courses
  static async getAllCourses(req, res) {
    try {
      const result = await CourseModel.getAllCourses();
      return res.status(200).send(result);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error retrieving courses");
    }
  }

  // GET /api/courses/:level
  static async getCourseByLevel(req, res) {
    try {
      const level = req.params.level;
      const result = await CourseModel.getCourseByLevel(level);

      if (result.length === 0) {
        return res.status(404).send("Course not found");
      } else {
        return res.status(200).send(result);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error retrieving course by level");
    }
  }

  // PUT /api/courses/course_name/:level
  static async updateCourseName(req, res) {
    try {
      const level = req.params.level;
      const { course_name } = req.body;

      const result = await CourseModel.updateCourseName(level, course_name);
      if (result.affectedRows === 0) {
        return res.status(404).send("Record not found");
      }
      return res.status(200).send("Record updated successfully");
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error updating course name");
    }
  }

  // PUT /api/courses/prerequisite/:level
  static async updatePrerequisite(req, res) {
    try {
      const level = req.params.level;
      const { prerequisite } = req.body;

      const result = await CourseModel.updatePrerequisite(level, prerequisite);
      if (result.affectedRows === 0) {
        return res.status(404).send("Record not found");
      }
      return res.status(200).send("Record updated successfully");
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error updating prerequisite");
    }
  }

  // POST /api/courses
  static async addCourse(req, res) {
    try {
      const { course_name, course_level, prerequisite, course_lvlGroup } =
        req.body;
      await CourseModel.addCourse({
        course_name,
        course_level,
        prerequisite,
        course_lvlGroup,
      });
      return res.status(200).send({
        status: 200,
        message: "Course successfully inserted in the database.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        status: 500,
        message:
          "Record not inserted: the course you entered may already be in the database.",
      });
    }
  }

  // DELETE /api/courses/:level
  static async deleteCourse(req, res) {
    try {
      const level = req.params.level;
      const result = await CourseModel.deleteCourse(level);
      if (result.affectedRows === 0) {
        return res.status(404).send("Record not deleted");
      }
      return res.status(200).send("Record deleted successfully!");
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error deleting course");
    }
  }
}

export default CourseController;
