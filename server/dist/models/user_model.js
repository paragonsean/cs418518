import { executeQuery } from "../config/connectdb.js";
import logger from "../services/my_logger.js";
class UserModel {
  static async createUser({
    firstName,
    lastName,
    email,
    hashedPassword,
    verificationToken
  }) {
    try {
      const [result] = await executeQuery(`INSERT INTO user (u_first_name, u_last_name, u_email, u_password, is_verified, verification_token)
         VALUES (?, ?, ?, ?, ?, ?)`, [firstName, lastName, email, hashedPassword, false, verificationToken]);
      logger.info(`New user created: ${email}`);
      return result;
    } catch (error) {
      logger.error(`Failed to create user (${email}): ${error.message}`);
      throw error;
    }
  }
  static async getLastUserID() {
    try {
      const [rows] = await executeQuery("SELECT u_id FROM user ORDER BY u_id DESC LIMIT 1");
      if (rows.length > 0) {
        logger.info(`User found: ${rows[0].u_id}`);
        return rows[0].u_id;
      }
    } catch (error) {
      logger.error(`Error getting last user ID: ${error.message}`);
      throw error;
    }
  }
  static async getUIN({
    email
  }) {
    try {
      const [rows] = await executeQuery("SELECT u_id FROM user WHERE u_email = ?", [email]);
      if (rows.length > 0) {
        logger.info(`User found: ${email}`);
        return rows[0];
      }
    } catch (error) {
      logger.error(`Error finding user by email (${email}): ${error.message}`);
      throw error;
    }
  }
  static async findByEmail(email) {
    try {
      const [rows] = await executeQuery("SELECT * FROM user WHERE u_email = ?", [email]);
      if (rows.length > 0) {
        logger.info(`User found: ${email}`);
        return rows[0];
      } else {
        logger.warn(`User not found: ${email}`);
        return null;
      }
    } catch (error) {
      logger.error(`Error finding user by email (${email}): ${error.message}`);
      throw error;
    }
  }
  static async findByUserId(userId) {
    try {
      const [rows] = await executeQuery("SELECT * FROM user WHERE u_id = ?", [userId]);
      if (rows.length > 0) {
        return rows[0];
      } else {
        logger.warn(`User not found by ID: ${userId}`);
        return null;
      }
    } catch (error) {
      logger.error(`Error finding user by ID (${userId}): ${error.message}`);
      throw error;
    }
  }
  static async updateUserProfile(userId, {
    firstName,
    lastName
  }) {
    try {
      const [result] = await executeQuery("UPDATE user SET u_first_name = ?, u_last_name = ? WHERE u_id = ?", [firstName, lastName, userId]);
      if (result.affectedRows > 0) {
        logger.info(`Profile updated for user ID: ${userId}`);
        return {
          status: "success",
          message: "Profile updated successfully"
        };
      } else {
        logger.warn(`No changes made to profile - User ID: ${userId}`);
        return {
          status: "warning",
          message: "No changes made"
        };
      }
    } catch (error) {
      logger.error(`Failed to update profile for User ID (${userId}): ${error.message}`);
      throw error;
    }
  }
  static async updatePasswordByUserId(userId, hashedPassword) {
    try {
      await executeQuery("UPDATE user SET u_password = ? WHERE u_id = ?", [hashedPassword, userId]);
      logger.info(`Password updated for user ID: ${userId}`);
    } catch (error) {
      logger.error(`Failed to update password for user ID (${userId}): ${error.message}`);
      throw error;
    }
  }
  static async getAllStudents() {
    try {
      const [rows] = await executeQuery(`SELECT u_id, u_first_name, u_last_name, u_email
         FROM user
         WHERE is_admin = false`);
      logger.info(`Fetched ${rows.length} students from database.`);
      return rows;
    } catch (error) {
      logger.error(`Failed to retrieve students: ${error.message}`);
      throw error;
    }
  }
  static async verifyUserEmail(email) {
    try {
      await executeQuery("UPDATE user SET is_verified = ?, verification_token = NULL WHERE u_email = ?", [true, email]);
      logger.info(`Email verified for user: ${email}`);
    } catch (error) {
      logger.error(`Failed to verify email for user (${email}): ${error.message}`);
      throw error;
    }
  }
  static async updatePasswordByEmail(email, hashedPassword) {
    try {
      await executeQuery("UPDATE user SET u_password = ? WHERE u_email = ?", [hashedPassword, email]);
      logger.info(`Password updated for email: ${email}`);
    } catch (error) {
      logger.error(`Failed to update password for email (${email}): ${error.message}`);
      throw error;
    }
  }
}
export default UserModel;