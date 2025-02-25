// file: controllers/UserController.js
import { hashPassword } from "../services/authService.js";
import UserModel from "../models/User.js";

class UserController {
  // 1️⃣ Change User Password (Auth Required)
  static async changeUserPassword(req, res, pool) {
    const { password, password_confirmation } = req.body;
    if (!password || !password_confirmation) {
      return res.status(400).json({ status: "failed", message: "All fields are required" });
    }
    if (password !== password_confirmation) {
      return res.status(400).json({ status: "failed", message: "Passwords do not match" });
    }

    try {
      const newHashPassword = await hashPassword(password);
      await UserModel.updatePasswordByUserId(req.user.userId, newHashPassword);

      return res.status(200).json({
        status: "success",
        message: "Password changed successfully"
      });
    } catch (error) {
      console.error("❌ Error changing password:", error);
      return res.status(500).json({ status: "failed", message: "Server error" });
    }
  }

  // 2️⃣ Fetch Logged User Info
  static async loggedUser(req, res, pool) {
    // `req.user` is presumably set by an auth middleware
    try {
      const userId = req.user.userId;
      const user = await UserModel.findByUserId(userId);
      if (!user) {
        return res.status(404).json({ status: "failed", message: "User not found" });
      }

      // Optionally omit sensitive fields
      const { u_password, verification_code, ...sanitizedUser } = user;

      return res.status(200).json({ status: "success", user: sanitizedUser });
    } catch (error) {
      console.error("❌ Error getting logged user:", error);
      return res.status(500).json({ status: "failed", message: "Server error" });
    }
  }
}

export default UserController;
