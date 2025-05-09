import express from "express";
import CourseController from "../controllers/course_controller.js";

const router = express.Router();

router.get("/", CourseController.getAllCourses);
router.get("/:level", CourseController.getCourseByLevel);
router.put("/course_name/:level", CourseController.updateCourseName);
router.put("/prerequisite/:level", CourseController.updateCoursePrerequisite);
router.post("/", CourseController.addCourse);
router.delete("/:level", CourseController.deleteCourse);

export default router;
