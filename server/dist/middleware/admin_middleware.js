import logger from "../services/my_logger.js";

/**
 * Middleware to allow only admin users to access the route
 */
export default function checkAdminRole(req, res, next) {
  var _req$user;
  if (req.user && req.user.isAdmin === 1) {
    return next();
  }
  logger.warn(`Access denied: User ${((_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.email) || "unknown"} attempted to access an admin route`);
  return res.status(403).json({
    status: "failed",
    message: "Access denied: Admins only"
  });
}