"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _course_controller = _interopRequireDefault(require("../controllers/course_controller.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var router = _express["default"].Router();
router.get("/", _course_controller["default"].getAllCourses);
router.get("/:level", _course_controller["default"].getCourseByLevel);
router.put("/course_name/:level", _course_controller["default"].updateCourseName);
router.put("/prerequisite/:level", _course_controller["default"].updateCoursePrerequisite);
router.post("/", _course_controller["default"].addCourse);
router["delete"]("/:level", _course_controller["default"].deleteCourse);
var _default = exports["default"] = router;