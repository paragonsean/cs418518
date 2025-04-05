import UserModel from "@/models/user_model.js";
import logger from "@/utils/my_logger.js";
import { hashPassword } from "@/utils/auth_service.js";  // Ensure correct relative path

class UserController {
  // Change User Password (Auth Required)
  static async changeUserPassword(req, res) {
    const { password, password_confirmation } = req.body;

    if (!password || !password_confirmation) {
      logger.warn(
        `Password change failed - Missing fields (User ID: ${req.user?.userId || "unknown"})`
      );
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required" });
    }

    if (password !== password_confirmation) {
      logger.warn(
        `Password change failed - Passwords do not match (User ID: ${req.user?.userId || "unknown"})`
      );
      return res
        .status(400)
        .json({ status: "failed", message: "Passwords do not match" });
    }

    try {
      const hashedPassword = await hashPassword(password);
      await UserModel.updatePasswordByUserId(req.user.userId, hashedPassword);
      logger.info(`Password changed successfully for User ID: ${req.user.userId}`);

      return res
        .status(200)
        .json({ status: "success", message: "Password changed successfully" });
    } catch (error) {
      logger.error(
        `Error changing password for User ID ${req.user?.userId || "unknown"}: ${error.message}`
      );
      return res
        .status(500)
        .json({ status: "failed", message: "Server error" });
    }
  }

  // Fetch Logged-in User Data
  static async loggedUser(req, res) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        logger.warn("No user ID found in request.");
        return res.status(400).json({ status: "failed", message: "Invalid request" });
      }

      const user = await UserModel.findByUserId(userId);
      if (!user) {
        logger.warn(`User not found - User ID: ${userId}`);
        return res.status(404).json({ status: "failed", message: "User not found" });
      }

      // Remove sensitive fields before sending response
      const sanitizedUser = { ...user };
      delete sanitizedUser.u_password;
      delete sanitizedUser.verification_code;

      return res.status(200).json({ status: "success", user: sanitizedUser });
    } catch (error) {
      logger.error(
        `Error retrieving user profile (User ID: ${req.user?.userId || "unknown"}): ${error.message}`
      );
      return res.status(500).json({ status: "failed", message: "Server error" });
    }
  }

  // Update User Profile (Including Password Update)
  static async updateUserProfile(req, res) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        logger.warn("No user ID found in request.");
        return res.status(400).json({ status: "failed", message: "Invalid request" });
      }

      const { firstName, lastName, password, password_confirmation } = req.body;
      if (!firstName || !lastName) {
        logger.warn(`Profile update failed - Missing fields (User ID: ${userId})`);
        return res.status(400).json({ status: "failed", message: "First Name and Last Name are required" });
      }

      const updateData = { firstName, lastName, password, password_confirmation };

      // Handle Password Update (if provided)
      if (password || password_confirmation) {
        if (!password || !password_confirmation) {
          return res.status(400).json({ status: "failed", message: "Both password fields are required" });
        }

        if (password !== password_confirmation) {
          logger.warn(`Profile update failed - Passwords do not match (User ID: ${userId})`);
          return res.status(400).json({ status: "failed", message: "Passwords do not match" });
        }

        if (password.length < 8) {
          return res.status(400).json({ status: "failed", message: "Password must be at least 8 characters long" });
        }

        updateData.password = await hashPassword(password);
      }

      // Perform the update
      const updateResult = await UserModel.updateUserProfile(userId, updateData);
      logger.info(`User profile updated - User ID: ${userId}`);

      return res.status(200).json(updateResult);
    } catch (error) {
      logger.error(`Error updating profile (User ID: ${req.user?.userId || "unknown"}): ${error.message}`);
      return res.status(500).json({ status: "failed", message: "Server error" });
    }
  }
}

export default UserController;