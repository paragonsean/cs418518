import pool from "@/config/connectdb.js";
import logger from "@/utils/my_logger.js"; //  Import logger

class AuthModel {
  //  Update OTP (verification_code) and Expiration
  static async updateOTP(userId, otp, otpExpiresAt) {
    try {
      await pool.execute(
        "UPDATE user SET verification_code = ?, otp_expires_at = ? WHERE u_id = ?",
        [otp, otpExpiresAt, userId],
      );
      logger.info(` OTP updated for user ID ${userId}`);
    } catch (error) {
      logger.error(
        ` Failed to update OTP for user ID ${userId}: ${error.message}`,
      );
    }
  }

  // Find User by Email & OTP (Within Valid Time)
  static async findByEmailAndOTP(email, otp) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM user WHERE u_email = ? AND verification_code = ? AND otp_expires_at > NOW()",
        [email, otp],
      );

      if (rows.length > 0) {
        logger.info(` User found with valid OTP - Email: ${email}`);
        return rows[0];
      } else {
        logger.warn(`No valid OTP found for email: ${email}`);
        return null;
      }
    } catch (error) {
      logger.error(
        ` Error finding user by OTP for email ${email}: ${error.message}`,
      );
      return null;
    }
  }

  // Clear OTP After Verification
  static async clearOTP(userId) {
    try {
      await pool.execute(
        "UPDATE user SET verification_code = NULL, otp_expires_at = NULL WHERE u_id = ?",
        [userId],
      );
      logger.info(` OTP cleared for user ID ${userId}`);
    } catch (error) {
      logger.error(
        ` Failed to clear OTP for user ID ${userId}: ${error.message}`,
      );
    }
  }

  // Update Verification Token (For Email Confirmation)
  static async updateVerificationToken(email, token) {
    try {
      await pool.execute(
        "UPDATE user SET verification_token = ? WHERE u_email = ?",
        [token, email],
      );
      logger.info(` Verification token updated for email: ${email}`);
    } catch (error) {
      logger.error(
        ` Failed to update verification token for email ${email}: ${error.message}`,
      );
    }
  }
}

export default AuthModel;
