// File: src/routes/advisingRoutes.js
import { Router } from "express";
import AdvisingController from "../controllers/AdvisingController.js";

const router = Router();

// GET /api/advising -> get all records
router.get("/", AdvisingController.getAllAdvisingRecords);

// GET /api/advising/:name -> get records by student name
router.get("/:name", AdvisingController.getAdvisingRecordsByName);

// POST /api/advising -> create new advising record
router.post("/", AdvisingController.createAdvisingRecord);

// PUT /api/advising/:id -> update a record's status
router.put("/:id", AdvisingController.updateAdvisingStatus);

export default router;
