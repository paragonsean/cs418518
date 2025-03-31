// File: src/routes/advisingRoutes.js
import { Router } from "express";
import AdvisingController from "../controllers/AdvisingController.js";
import checkUserAuth from "../middleware/AuthMiddleware.js"; // ✅ Ensure authentication

const router = Router();

// GET /api/advising -> Get all records (Admin-only)
router.get("/", checkUserAuth, AdvisingController.getAllAdvisingRecords);

// GET /api/advising/email -> Get advising records for the authenticated user
router.get("/email", checkUserAuth, AdvisingController.getAdvisingRecordsByEmail);

// POST /api/advising -> Create new advising record
router.post("/", checkUserAuth, AdvisingController.createAdvisingRecord);

// PUT /api/advising/:id -> Update a record's status
router.put("/:id", checkUserAuth, AdvisingController.updateAdvisingStatus);

export default router;
