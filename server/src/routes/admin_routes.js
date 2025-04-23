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
adminRouter.post("/advising/:id/update-courses", AdminAdvisingController.updateCoursesFromAdvising);

// 📄 View all advising records
adminRouter.get("/advising", AdminAdvisingController.getAllAdvisingRecords);

// 👤 View all student users (non-admins)
adminRouter.get("/students", AdminAdvisingController.getAllStudents);

// 🔍 View single advising record by ID
adminRouter.get("/advising/:id", AdminAdvisingController.getAdvisingRecordById);

//  Approve or reject advising form (with feedback)
adminRouter.put("/advising/:id", AdminAdvisingController.updateAdvisingStatus);
// 🗑️ Delete completed courses linked to this advising record
adminRouter.delete("/advising/:id/delete-courses", AdminAdvisingController.deleteCoursesFromAdvising);

// 🛠 Full edit to an advising record
adminRouter.put("/advising/record/:id", AdminAdvisingController.updateAdvisingRecord);
// 🗑️ Delete completed courses linked to this advising record

export default adminRouter;
