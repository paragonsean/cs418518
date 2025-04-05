import { verifyToken } from "../utils/authService.js";
import UserModel from "../models/UserModel.js";
import logger from "../utils/logger.js";

export default async function checkUserAuth(req, res, next) {
  let token =
    req.headers.authorization || (req.cookies && req.cookies.authToken);

  if (!token) {
    logger.warn("Unauthorized access attempt - No token provided");
    return res
      .status(401)
      .json({ status: "failed", message: "No token provided" });
  }

  // Remove "Bearer " prefix if present
  if (token.startsWith("Bearer ")) {
    token = token.replace("Bearer ", "");
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      logger.warn("Unauthorized access attempt - Invalid or expired token");
      return res
        .status(401)
        .json({ status: "failed", message: "Invalid or expired token" });
    }

    // Fetch user approval status and admin status from database
    const user = await UserModel.findByUserId(decoded.userId);

    if (!user) {
      logger.warn(`Unauthorized access - User not found: ${decoded.email}`);
      return res
        .status(401)
        .json({ status: "failed", message: "User not found" });
    }

    if (!user.is_verified) {
      logger.warn(`Access denied - User not approved: ${decoded.email}`);
      return res
        .status(403)
        .json({ status: "failed", message: "Account not approved by admin" });
    }

    // Attach user info to `req`
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      isApproved: user.is_approved, // Attach approval status
      isAdmin: user.is_admin, // Attach admin status
    };

   
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return res
      .status(401)
      .json({ status: "failed", message: "Invalid or expired token" });
  }
}
