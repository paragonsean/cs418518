import checkUserAuth from "../middleware/auth_middleware.js";
import checkAdminRole from "../middleware/admin_middleware.js";
import CompletedCoursesController from "../controllers/completed_courses_controller.js";
import { Router } from "express";
const router = Router();
router.get("/", checkUserAuth, CompletedCoursesController.getCompletedCoursesByEmail);

// ✅ Admin route using student email instead of ID
router.get("/email/:email", checkUserAuth, checkAdminRole, CompletedCoursesController.getCompletedCoursesByEmailParam);
export default router;