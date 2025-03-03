import UserModel from "../models/UserModel.js";
import logger from "../utils/logger.js";

class UserController {
  // 1️⃣ Change User Password (Auth Required)
  static async changeUserPassword(req, res) {
    const { password, password_confirmation } = req.body;

    if (!password || !password_confirmation) {
      logger.warn(
        `Password change failed - Missing fields (User ID: ${req.user?.userId || "unknown"})`,
      );
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required" });
    }

    if (password !== password_confirmation) {
      logger.warn(
        `Password change failed - Passwords do not match (User ID: ${req.user?.userId || "unknown"})`,
      );
      return res
        .status(400)
        .json({ status: "failed", message: "Passwords do not match" });
    }

    try {
      const hashedPassword = await hashPassword(password);
      await UserModel.updatePasswordByUserId(req.user.userId, hashedPassword);
      logger.info(
        `Password changed successfully for User ID: ${req.user.userId}`,
      );

      return res
        .status(200)
        .json({ status: "success", message: "Password changed successfully" });
    } catch (error) {
      logger.error(
        `Error changing password for User ID ${req.user?.userId || "unknown"}: ${error.message}`,
      );
      return res
        .status(500)
        .json({ status: "failed", message: "Server error" });
    }
  }

  // 2️⃣ Fetch Logged-in User Data
  static async loggedUser(req, res) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        logger.warn("No user ID found in request.");
        return res
          .status(400)
          .json({ status: "failed", message: "Invalid request" });
      }

      const user = await UserModel.findByUserId(userId);
      if (!user) {
        logger.warn(`User not found - User ID: ${userId}`);
        return res
          .status(404)
          .json({ status: "failed", message: "User not found" });
      }

      const sanitizedUser = { ...user };
      delete sanitizedUser.u_password;
      delete sanitizedUser.verification_code;

      logger.info(`Retrieved user profile for User ID: ${userId}`);
      return res.status(200).json({ status: "success", user: sanitizedUser });
    } catch (error) {
      logger.error(
        `Error retrieving user profile (User ID: ${req.user?.userId || "unknown"}): ${error.message}`,
      );
      return res
        .status(500)
        .json({ status: "failed", message: "Server error" });
    }
  }
  // 1️⃣ Update User Profile
  static async updateUserProfile(req, res) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        logger.warn("No user ID found in request.");
        return res
          .status(400)
          .json({ status: "failed", message: "Invalid request" });
      }

      const { firstName, lastName } = req.body;
      if (!firstName || !lastName) {
        logger.warn(
          `Profile update failed - Missing fields (User ID: ${userId})`,
        );
        return res
          .status(400)
          .json({
            status: "failed",
            message: "First Name and Last Name are required",
          });
      }

      const updateResult = await UserModel.updateUserProfile(userId, {
        firstName,
        lastName,
      });
      logger.info(`User profile updated - User ID: ${userId}`);

      return res.status(200).json(updateResult);
    } catch (error) {
      logger.error(
        `Error updating profile (User ID: ${req.user?.userId || "unknown"}): ${error.message}`,
      );
      return res
        .status(500)
        .json({ status: "failed", message: "Server error" });
    }
  }
}

export default UserController;
