import { executeQuery } from "../config/connectdb.js";
import logger from "../services/my_logger.js";
class AuthModel {
  static async updateOTP(userId, otp) {
    const sql = `
      UPDATE user
      SET verification_code = ?, otp_expires_at = NOW() + INTERVAL 10 MINUTE
      WHERE u_id = ?
    `;
    try {
      await executeQuery(sql, [otp, userId]);
      logger.info(`✅ OTP updated for user ID ${userId} with DB-managed expiration`);
    } catch (error) {
      logger.error(`❌ Failed to update OTP for user ID ${userId}: ${error.message}`);
      throw error;
    }
  }
  static async findByEmailAndOTP(email, otp) {
    const sql = `
      SELECT *
      FROM user
      WHERE u_email = ?
        AND verification_code = ?
        AND otp_expires_at > NOW()
      LIMIT 1
    `;
    try {
      const [rows] = await executeQuery(sql, [email, otp]);
      if (rows.length > 0) {
        logger.info(`✅ Valid OTP for email: ${email}`);
        return rows[0];
      } else {
        logger.warn(`⚠️ No valid OTP (expired or incorrect) for email: ${email}`);
        return null;
      }
    } catch (error) {
      logger.error(`❌ Error checking OTP for ${email}: ${error.message}`);
      throw error;
    }
  }
  static async clearOTP(userId) {
    const sql = "UPDATE user SET verification_code = NULL, otp_expires_at = NULL WHERE u_id = ?";
    try {
      await executeQuery(sql, [userId]);
      logger.info(`✅ OTP cleared for user ID: ${userId}`);
    } catch (error) {
      logger.error(`❌ Error clearing OTP for user ID ${userId}: ${error.message}`);
      throw error;
    }
  }
  static async updateVerificationToken(email, token) {
    const sql = "UPDATE user SET verification_token = ?, updated_at = NOW() WHERE u_email = ?";
    try {
      await executeQuery(sql, [token, email]);
      logger.info(`✅ Verification token set for ${email}`);
    } catch (error) {
      logger.error(`❌ Failed to update verification token for ${email}: ${error.message}`);
      throw error;
    }
  }
  static async verifyUserEmail(email) {
    const sql = "UPDATE user SET is_verified = 1, verification_token = NULL, updated_at = NOW() WHERE u_email = ?";
    try {
      const [result] = await executeQuery(sql, [email]);
      if (result.affectedRows === 0) {
        logger.warn(`⚠️ No user found to verify for email: ${email}`);
        throw new Error("User not found");
      }
      logger.info(`✅ User verified for email: ${email}`);
    } catch (error) {
      logger.error(`❌ Error verifying user ${email}: ${error.message}`);
      throw error;
    }
  }
  static async updatePasswordByUserId(userId, hashedPassword) {
    const sql = "UPDATE user SET u_password = ?, updated_at = NOW() WHERE u_id = ?";
    try {
      await executeQuery(sql, [hashedPassword, userId]);
      logger.info(`✅ Password updated for user ID: ${userId}`);
    } catch (error) {
      logger.error(`❌ Error updating password for user ID ${userId}: ${error.message}`);
      throw error;
    }
  }
  static async updatePasswordByEmail(email, hashedPassword) {
    const sql = "UPDATE user SET u_password = ?, updated_at = NOW() WHERE u_email = ?";
    try {
      await executeQuery(sql, [hashedPassword, email]);
      logger.info(`✅ Password updated for email: ${email}`);
    } catch (error) {
      logger.error(`❌ Error updating password for email ${email}: ${error.message}`);
      throw error;
    }
  }
}
export default AuthModel;