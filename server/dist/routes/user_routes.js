"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _user_controller = _interopRequireDefault(require("../controllers/user_controller.js"));
var _auth_controller = _interopRequireDefault(require("../controllers/auth_controller.js"));
var _password_controller = _interopRequireDefault(require("../controllers/password_controller.js"));
var _auth_middleware = _interopRequireDefault(require("../middleware/auth_middleware.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var router = _express["default"].Router();

//  Public Routes (No Authentication Required)
router.post("/register", _auth_controller["default"].register);
router.post("/login", _auth_controller["default"].userLogin);
router.post("/send-reset-password-email", _password_controller["default"].sendUserPasswordResetEmail);
router.post("/verify-otp", _auth_controller["default"].verifyOTP);
router.get("/verify-email", _password_controller["default"].verifyEmail);
router.post("/reset-password/:token", _password_controller["default"].resetPassword);
router.post("/changepassword", _auth_middleware["default"], _user_controller["default"].changeUserPassword);
router.get("/loggeduser", _auth_middleware["default"], _user_controller["default"].loggedUser);
router.put("/updateprofile", _auth_middleware["default"], _user_controller["default"].updateUserProfile);
var _default = exports["default"] = router;