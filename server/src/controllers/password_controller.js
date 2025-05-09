import {
  hashPassword,
  verifyToken,
  generateToken,
} from "../services/auth_service.js";
import { sendResetPasswordEmail } from "../services/email_service.js";
import UserModel from "../models/user_model.js";
import logger from "../services/my_logger.js";

class PasswordController {
  //  Verify Email
  static async verifyEmail(req, res) {
    const { token } = req.query;

    if (!token) {
      logger.warn("Email verification failed - Missing verification token");
      return res
        .status(400)
        .json({ status: "failed", message: "Missing verification token" });
    }

    try {
      const decoded = verifyToken(token);
      if (!decoded || !decoded.email) {
        logger.warn("Email verification failed - Invalid token");
        return res
          .status(400)
          .json({ status: "failed", message: "Invalid token" });
      }

      const { email } = decoded;
      const user = await UserModel.findByEmail(email);
      if (!user) {
        logger.warn(`Email verification failed - No user found: ${email}`);
        return res
          .status(400)
          .json({ status: "failed", message: "Invalid token" });
      }

      await UserModel.verifyUserEmail(email);
      logger.info(`Email verified successfully for ${email}`);

      return res.status(200).json({
        status: "success",
        message: "Email verified successfully!",
      });
    } catch (error) {
      logger.error(`JWT Verification Error: ${error.message}`);
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid token" });
    }
  }

  //  Send Password Reset Email
  static async sendUserPasswordResetEmail(req, res) {
    const { email } = req.body;

    if (!email) {
      logger.warn("Password reset request failed - Missing email");
      return res
        .status(400)
        .json({ status: "failed", message: "Email is required" });
    }

    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        logger.warn(`Password reset request failed - No user found: ${email}`);
        return res.status(400).json({
          status: "failed",
          message: "No account found with this email",
        });
      }

      const resetToken = generateToken({ email }); // no expiration
      await sendResetPasswordEmail(email, resetToken);
      logger.info(`Password reset email sent to ${email}`);

      return res.status(200).json({
        status: "success",
        message: "Password reset email sent!",
      });
    } catch (error) {
      logger.error(`Error sending reset email to ${email}: ${error.message}`);
      return res
        .status(500)
        .json({ status: "failed", message: "Server error" });
    }
  }

  //  Reset Password via Token
  static async resetPassword(req, res) {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      logger.warn("Password reset failed - Missing token or new password");
      return res.status(400).json({
        status: "failed",
        message: "Token and new password are required",
      });
    }

    try {
      const decoded = verifyToken(token);
      if (!decoded || !decoded.email) {
        logger.warn("Password reset failed - Invalid token");
        return res.status(400).json({
          status: "failed",
          message: "Invalid token",
        });
      }

      const hashedPassword = await hashPassword(newPassword);
      await UserModel.updatePasswordByEmail(decoded.email, hashedPassword);
      logger.info(`Password successfully reset for ${decoded.email}`);

      return res.status(200).json({
        status: "success",
        message: "Password reset successfully!",
      });
    } catch (error) {
      logger.error(`Error resetting password: ${error.message}`);
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid token" });
    }
  }
}

export default PasswordController;
