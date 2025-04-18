"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _admin_controller = _interopRequireDefault(require("../controllers/admin_controller.js"));
var _auth_middleware = _interopRequireDefault(require("../middleware/auth_middleware.js"));
var _admin_middleware = _interopRequireDefault(require("../middleware/admin_middleware.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var adminRouter = (0, _express.Router)();

// ✅ Apply middleware globally to all admin routes
adminRouter.use(_auth_middleware["default"]); // Ensure token is valid
adminRouter.use(_admin_middleware["default"]); // Ensure user is admin

/**
 * Admin-only advising management routes
 */
adminRouter.post("/advising/:id/update-courses", _admin_controller["default"].updateCoursesFromAdvising);

// 📄 View all advising records
adminRouter.get("/advising", _admin_controller["default"].getAllAdvisingRecords);

// 👤 View all student users (non-admins)
adminRouter.get("/students", _admin_controller["default"].getAllStudents);

// 🔍 View single advising record by ID
adminRouter.get("/advising/:id", _admin_controller["default"].getAdvisingRecordById);

// ✅ Approve or reject advising form (with feedback)
adminRouter.put("/advising/:id", _admin_controller["default"].updateAdvisingStatus);

// 🛠 Full edit to an advising record
adminRouter.put("/advising/record/:id", _admin_controller["default"].updateAdvisingRecord);
var _default = exports["default"] = adminRouter;