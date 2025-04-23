import checkUserAuth from "../middleware/auth_middleware.js";
import checkAdminRole from "../middleware/admin_middleware.js";
import CompletedCoursesController from "../controllers/completed_courses_controller.js";
import { Router } from "express";

const router = Router();

// 👇 Fetch authenticated user's completed courses
router.get("/", checkUserAuth, CompletedCoursesController.getCompletedCoursesByEmail);

// 👇 Admin route: fetch by any email
router.get("/email/:email", checkUserAuth, checkAdminRole, CompletedCoursesController.getCompletedCoursesByEmailParam);

// ✅ NEW: Delete a specific course for the authenticated user
router.delete("/", checkUserAuth, CompletedCoursesController.deleteCompletedCourse);

export default router;
