import { Router } from "express";
import AdvisingController from "../controllers/advising_controller.js";
import checkUserAuth from "../middleware/auth_middleware.js"; //Ensure authentication

const router = Router();

// GET /api/advising -> Get all records (Admin-only)
router.get("/", checkUserAuth, AdvisingController.getAllAdvisingRecords);

// GET /api/advising/email -> Get advising records for the authenticated user
router.get("/email", checkUserAuth, AdvisingController.getAdvisingRecordsByEmail);
router.get("/students", checkUserAuth, AdvisingController.getAllStudents);
// NEW: GET /api/advising/:id -> Fetch a single advising record by ID
router.get("/:id", checkUserAuth, AdvisingController.getAdvisingRecordById);

// POST /api/advising -> Create new advising record
router.post("/", checkUserAuth, AdvisingController.createAdvisingRecord);

// PUT /api/advising/:id -> Update a record's status (status update only)

// NEW: PUT /api/advising/record/:id -> Update a full advising record
router.put("/record/:id", checkUserAuth, AdvisingController.updateAdvisingRecord);

export default router;
