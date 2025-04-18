"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = checkAdminRole;
var _my_logger = _interopRequireDefault(require("../services/my_logger.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/**
 * Middleware to allow only admin users to access the route
 */
function checkAdminRole(req, res, next) {
  var _req$user;
  if (req.user && req.user.isAdmin === 1) {
    return next();
  }
  _my_logger["default"].warn("Access denied: User ".concat(((_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.email) || "unknown", " attempted to access an admin route"));
  return res.status(403).json({
    status: "failed",
    message: "Access denied: Admins only"
  });
}