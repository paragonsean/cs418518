// File: src/routes/completedCoursesRoutes.js
import { Router } from "express";
import CompletedCoursesController from "../controllers/CompletedCoursesController.js";

const router = Router();

// GET /api/completed-courses/email/:email -> Get completed courses by student email
router.get("/email/:email", CompletedCoursesController.getCompletedCoursesByEmail);

export default router;
