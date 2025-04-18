"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _advising_controller = _interopRequireDefault(require("../controllers/advising_controller.js"));
var _auth_middleware = _interopRequireDefault(require("../middleware/auth_middleware.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
//Ensure authentication

var router = (0, _express.Router)();

// GET /api/advising -> Get all records (Admin-only)
router.get("/", _auth_middleware["default"], _advising_controller["default"].getAllAdvisingRecords);

// GET /api/advising/email -> Get advising records for the authenticated user
router.get("/email", _auth_middleware["default"], _advising_controller["default"].getAdvisingRecordsByEmail);
router.get("/students", _auth_middleware["default"], _advising_controller["default"].getAllStudents);
// NEW: GET /api/advising/:id -> Fetch a single advising record by ID
router.get("/:id", _auth_middleware["default"], _advising_controller["default"].getAdvisingRecordById);

// POST /api/advising -> Create new advising record
router.post("/", _auth_middleware["default"], _advising_controller["default"].createAdvisingRecord);

// PUT /api/advising/:id -> Update a record's status (status update only)

// NEW: PUT /api/advising/record/:id -> Update a full advising record
router.put("/record/:id", _auth_middleware["default"], _advising_controller["default"].updateAdvisingRecord);
var _default = exports["default"] = router;