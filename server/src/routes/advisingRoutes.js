// File: src/routes/advisingRoutes.js
import { Router } from "express";
import AdvisingController from "../controllers/AdvisingController.js";

const router = Router();

// GET /api/advising -> get all records
router.get("/", AdvisingController.getAllAdvisingRecords);

// GET /api/advising/email/:email -> get records by student email
router.get("/email/:email", AdvisingController.getAdvisingRecordsByEmail);

// POST /api/advising -> create new advising record
router.post("/", AdvisingController.createAdvisingRecord);

// PUT /api/advising/:id -> update a record's status
router.put("/:id", AdvisingController.updateAdvisingStatus);

export default router;
