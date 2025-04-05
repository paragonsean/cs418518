// File: src/routes/completedCoursesRoutes.js
import { Router } from "express";
import CompletedCoursesController from "../controllers/completed_courses_controller.js";
import checkUserAuth from "../middleware/auth_middleware.js";

const router = Router();

// GET /api/completed-courses -> Fetch completed courses using authenticated user's email
router.get("/", checkUserAuth, CompletedCoursesController.getCompletedCoursesByEmail);

export default router;
