"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _auth_middleware = _interopRequireDefault(require("../middleware/auth_middleware.js"));
var _admin_middleware = _interopRequireDefault(require("../middleware/admin_middleware.js"));
var _completed_courses_controller = _interopRequireDefault(require("../controllers/completed_courses_controller.js"));
var _express = require("express");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var router = (0, _express.Router)();
router.get("/", _auth_middleware["default"], _completed_courses_controller["default"].getCompletedCoursesByEmail);

// ✅ Admin route using student email instead of ID
router.get("/email/:email", _auth_middleware["default"], _admin_middleware["default"], _completed_courses_controller["default"].getCompletedCoursesByEmailParam);
var _default = exports["default"] = router;