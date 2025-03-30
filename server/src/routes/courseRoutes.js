// File: routes/courseRoutes.js
import express from "express";
import CourseController from "../controllers/CourseController.js";

const router = express.Router();

// 1) GET all courses
router.get("/", CourseController.getAllCourses);

// 2) GET by course level
router.get("/:level", CourseController.getCourseByLevel);

// 3) Update course name
router.put("/course_name/:level", CourseController.updateCourseName);

// 4) Update course prerequisite
router.put("/prerequisite/:level", CourseController.updatePrerequisite);

// 5) Insert a new course
router.post("/", CourseController.addCourse);

// 6) Delete a course
router.delete("/:level", CourseController.deleteCourse);

export default router;
