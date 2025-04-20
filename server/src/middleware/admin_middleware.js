import logger from "../services/my_logger.js";

/**
 * Middleware to allow only admin users to access the route
 */
export default function checkAdminRole(req, res, next) {
  if (req.user && req.user.isAdmin === 1) {
    return next();
  }

  logger.warn(
    `Access denied: User ${req.user?.email || "unknown"} attempted to access an admin route`
  );

  return res.status(403).json({
    status: "failed",
    message: "Access denied: Admins only",
  });
}
