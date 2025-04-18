import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../services/auth_service.js";

import { generateOTP, sendOTPEmail } from "../services/otp_service.js";
import { sendVerificationEmail } from "../services/email_service.js";

import UserModel from "../models/user_model.js";
import AuthModel from "../models/auth_model.js";
import logger from "../services/my_logger.js";
import { verifyRecaptcha } from "../services/verify_recaptcha.js";

class AuthController {
  // ✅ Register a New User
  static async register(req, res) {
    const { firstName, lastName, email, password, password_confirmation, recaptchaToken } = req.body;

    logger.info(`Registration attempt: ${email}`);

    if (!firstName || !lastName || !email || !password || !password_confirmation || !recaptchaToken) {
      logger.warn(`Registration failed - Missing fields (email: ${email})`);
      return res.status(400).json({ status: "failed", message: "All fields are required" });
    }

    if (password !== password_confirmation) {
      logger.warn(`Registration failed - Passwords do not match (email: ${email})`);
      return res.status(400).json({ status: "failed", message: "Passwords do not match" });
    }

    // 🔐 Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
      logger.warn(`reCAPTCHA failed for ${email} — score: ${recaptchaResult.score}`);
      return res.status(403).json({
        status: "failed",
        message: "reCAPTCHA verification failed. Are you human?",
      });
    }

    try {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        logger.warn(`Registration failed - Email already exists: ${email}`);
        return res.status(400).json({ status: "failed", message: "Email already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const verificationToken = generateToken({ email }, "1d");

      await UserModel.createUser({
        firstName,
        lastName,
        email,
        hashedPassword,
        verificationToken,
      });

      const u_id = await UserModel.getLastUserID();

      await sendVerificationEmail(email, verificationToken, u_id, firstName, lastName);

      logger.info(`Registration successful - Verification email sent to ${email}`);

      return res.status(201).json({
        status: "success",
        message: "Registration successful! Check your email for verification.",
      });
    } catch (error) {
      logger.error(`Error in registration for ${email}: ${error.message}`);
      return res.status(500).json({ status: "failed", message: "Server error" });
    }
  }

  // ✅ Login (Generate OTP)
  static async userLogin(req, res) {
    const { email, password, recaptchaToken } = req.body;

    if (!email || !password || !recaptchaToken) {
      logger.warn(`Login attempt failed - Missing fields (email: ${email})`);
      return res.status(400).json({ status: "failed", message: "All fields are required" });
    }

    // 🛡️ Verify reCAPTCHA
    const recaptcha = await verifyRecaptcha(recaptchaToken);
    if (!recaptcha.success || recaptcha.score < 0.5) {
      logger.warn(`reCAPTCHA failed for ${email} — score: ${recaptcha.score}`);
      return res.status(403).json({
        status: "failed",
        message: "reCAPTCHA verification failed. Are you human?",
      });
    }

    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        logger.warn(`Login failed - User not found (email: ${email})`);
        return res.status(401).json({ status: "failed", message: "Invalid email or password" });
      }

      if (!user.u_password) {
        logger.error(`User found but missing password field: ${JSON.stringify(user)}`);
        return res.status(500).json({ status: "failed", message: "User data corrupted" });
      }

      const isMatch = await comparePassword(password, user.u_password);
      if (!isMatch) {
        logger.warn(`Login failed - Incorrect password (email: ${email})`);
        return res.status(401).json({ status: "failed", message: "Invalid email or password" });
      }

      if (!user.is_verified) {
        logger.warn(`Login failed - User not verified (email: ${email})`);
        return res.status(401).json({
          status: "failed",
          message: "User not verified. Check your email for verification.",
        });
      }

      const otp = generateOTP();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await AuthModel.updateOTP(user.u_id, otp, otpExpiresAt);
      logger.info(`OTP generated and stored for ${email}`);

      try {
        await sendOTPEmail(user.u_email, otp);
        logger.info(`OTP email sent to ${user.u_email}`);
      } catch (emailErr) {
        logger.error(`Error sending OTP email: ${emailErr.message}`);
      }

      return res.status(200).json({
        status: "pending_otp",
        message: "OTP sent. Please verify.",
      });
    } catch (error) {
      logger.error(`Error during login for ${email}: ${error.message}`);
      return res.status(500).json({ status: "failed", message: "Server error" });
    }
  }

  // ✅ Verify OTP & Generate JWT Cookie
  static async verifyOTP(req, res) {
    const { email, otp } = req.body;

    if (!email || !otp) {
      logger.warn(`OTP verification failed - Missing fields (email: ${email})`);
      return res.status(400).json({ status: "failed", message: "Email and OTP are required" });
    }

    try {
      const user = await AuthModel.findByEmailAndOTP(email, otp);
      if (!user) {
        logger.warn(`OTP verification failed - Invalid OTP (email: ${email})`);
        return res.status(401).json({ status: "failed", message: "Invalid or expired OTP" });
      }

      await AuthModel.clearOTP(user.u_id);

      const token = generateToken(user);
      const isProduction = process.env.NODE_ENV === "production";

      res.cookie("authtoken", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      logger.info(`OTP verification successful - User logged in: ${email}`);

      return res.status(200).json({
        status: "success",
        message: "Login successful!",
        token,
      });
    } catch (error) {
      logger.error(`Error verifying OTP for ${email}: ${error.message}`);
      return res.status(500).json({ status: "failed", message: "Server error" });
    }
  }
}

export default AuthController;
