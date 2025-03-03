import express from "express";
import CourseController from "../controllers/CourseController.js"; //  Check this path

const router = express.Router();

//  Ensure these functions exist in `CourseController.js`
router.get("/all", CourseController.getAllCourses);
router.get("/prerequisites", CourseController.getPrereqCourses);
router.get("/non-prerequisites", CourseController.getNonPrereqCourses);

export default router;
