import { Router } from "express";
import AdminAdvisingController from "../controllers/admin_controller.js";
import checkUserAuth from "../middleware/auth_middleware.js";
import checkAdminRole from "../middleware/admin_middleware.js";

const adminRouter = Router();

// ✅ Apply middleware globally to all admin routes
adminRouter.use(checkUserAuth);      // Ensure token is valid
adminRouter.use(checkAdminRole);     // Ensure user is admin

/**
 * Admin-only advising management routes
 */

// 📄 View all advising records
adminRouter.get("/advising", AdminAdvisingController.getAllAdvisingRecords);

// 👤 View all student users (non-admins)
adminRouter.get("/students", AdminAdvisingController.getAllStudents);

// 🔍 View single advising record by ID
adminRouter.get("/advising/:id", AdminAdvisingController.getAdvisingRecordById);

// ✅ Approve or reject advising form (with feedback)
adminRouter.put("/advising/:id", AdminAdvisingController.updateAdvisingStatus);

// 🛠 Full edit to an advising record
adminRouter.put("/advising/record/:id", AdminAdvisingController.updateAdvisingRecord);

export default adminRouter;
