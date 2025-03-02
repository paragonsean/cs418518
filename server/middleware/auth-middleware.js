// file: middlewares/auth-middleware.js

import { verifyToken } from "../services/authService.js";

export default function checkUserAuth(pool) {
  // Return the actual Express middleware
  return (req, res, next) => {
    // Example: token in headers or cookies
    const authHeader = req.headers.authorization || req.cookies.authToken;
    if (!authHeader) {
      return res.status(401).json({ status: "failed", message: "No token provided" });
    }

    // If you are using "Bearer <token>"
    const token = authHeader.replace("Bearer ", "");

    try {
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ status: "failed", message: "Invalid or expired token" });
      }

      // Attach user info to req
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
      };

      next();
    } catch (error) {
      console.error("❌ Auth error:", error);
      return res.status(401).json({ status: "failed", message: "Invalid or expired token" });
    }
  };
}
