import { Router } from "express";
import AdvisingController from "../controllers/AdvisingController.js";
import checkUserAuth from "../middleware/AuthMiddleware.js"; //Ensure authentication

var router = Router();

// GET /api/advising -> Get all records (Admin-only)
router.get("/", checkUserAuth, AdvisingController.getAllAdvisingRecords);

// GET /api/advising/email -> Get advising records for the authenticated user
router.get("/email", checkUserAuth, AdvisingController.getAdvisingRecordsByEmail);

// NEW: GET /api/advising/:id -> Fetch a single advising record by ID
router.get("/:id", checkUserAuth, AdvisingController.getAdvisingRecordById);

// POST /api/advising -> Create new advising record
router.post("/", checkUserAuth, AdvisingController.createAdvisingRecord);

// PUT /api/advising/:id -> Update a record's status (status update only)
router.put("/:id", checkUserAuth, AdvisingController.updateAdvisingStatus);

// NEW: PUT /api/advising/record/:id -> Update a full advising record
router.put("/record/:id", checkUserAuth, AdvisingController.updateAdvisingRecord);
export default router;