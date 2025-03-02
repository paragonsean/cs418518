// file: models/UserModel.js
import pool from "../config/connectdb.js";

class UserModel {
  //   Create a New User
  static async createUser({ firstName, lastName, email, hashedPassword, verificationToken }) {
    const [result] = await pool.execute(
      `INSERT INTO user (u_first_name, u_last_name, u_email, u_password, is_verified, verification_token)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, hashedPassword, false, verificationToken]
    );
    return result;
  }

  //   Find User by Email
  static async findByEmail(email) {
    const [rows] = await pool.execute("SELECT * FROM user WHERE u_email = ?", [email]);
    return rows.length > 0 ? rows[0] : null;
  }

  //  Update OTP (verification_code) and Expiration
  static async updateOTP(userId, otp, otpExpiresAt) {
    await pool.execute(
      "UPDATE user SET verification_code = ?, otp_expires_at = ? WHERE u_id = ?",
      [otp, otpExpiresAt, userId]
    );
  }

  //  Find User by Email & OTP (Within Valid Time)
  static async findByEmailAndOTP(email, otp) {
    const [rows] = await pool.execute(
      "SELECT * FROM user WHERE u_email = ? AND verification_code = ? AND otp_expires_at > NOW()",
      [email, otp]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  //   Clear OTP After Verification
  static async clearOTP(userId) {
    await pool.execute(
      "UPDATE user SET verification_code = NULL, otp_expires_at = NULL WHERE u_id = ?",
      [userId]
    );
  }

  //  Update Email Verification (Mark is_verified = true, remove verification_token)
  static async verifyUserEmail(email) {
    await pool.execute(
      "UPDATE user SET is_verified = ?, verification_token = NULL WHERE u_email = ?",
      [true, email]
    );
  }

  //  Update Password
  static async updatePasswordByUserId(userId, hashedPassword) {
    await pool.execute("UPDATE user SET u_password = ? WHERE u_id = ?", [hashedPassword, userId]);
  }

  //   Update Password by Email (For Reset)
  static async updatePasswordByEmail(email, hashedPassword) {
    await pool.execute("UPDATE user SET u_password = ? WHERE u_email = ?", [hashedPassword, email]);
  }

  //   Update Verification Token
  static async updateVerificationToken(email, token) {
    await pool.execute(
      "UPDATE user SET verification_token = ? WHERE u_email = ?",
      [token, email]
    );
  }

  // Logged-in User Info (Optional)
  static async findByUserId(userId) {
    const [rows] = await pool.execute("SELECT * FROM user WHERE u_id = ?", [userId]);
    return rows.length > 0 ? rows[0] : null;
  }
}

export default UserModel;
