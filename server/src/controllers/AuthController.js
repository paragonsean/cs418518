import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../utils/authService.js";

import { generateOTP, sendOTPEmail } from "../utils/otpService.js";
import { sendVerificationEmail } from "../utils/emailService.js";

import UserModel from "../models/UserModel.js";
import AuthModel from "../models/AuthModel.js";
import logger from "../utils/logger.js"; //  Import logger

class AuthController {
  //  Register a New User
  static async register(req, res) {
    const { firstName, lastName, email, password, password_confirmation } =
      req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !password_confirmation
    ) {
      logger.warn(`⚠️ Registration failed - Missing fields (email: ${email})`);
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required" });
    }
    if (password !== password_confirmation) {
      logger.warn(
        `⚠️ Registration failed - Passwords do not match (email: ${email})`,
      );
      return res
        .status(400)
        .json({ status: "failed", message: "Passwords do not match" });
    }

    try {
      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        logger.warn(`⚠️ Registration failed - Email already exists: ${email}`);
        return res
          .status(400)
          .json({ status: "failed", message: "Email already exists" });
      }

      // Hash password and create verification token
      const hashedPassword = await hashPassword(password);
      const verificationToken = generateToken({ email }, "1d"); // 1-day expiration

      // Create user in DB
      await UserModel.createUser({
        firstName,
        lastName,
        email,
        hashedPassword,
        verificationToken,
      });

      // Send verification email
      await sendVerificationEmail(email, verificationToken);
      logger.info(
        ` Registration successful - Verification email sent to ${email}`,
      );

      return res.status(201).json({
        status: "success",
        message: "Registration successful! Check your email for verification.",
      });
    } catch (error) {
      logger.error(` Error in registration for ${email}: ${error.message}`);
      return res
        .status(500)
        .json({ status: "failed", message: "Server error" });
    }
  }

  // Login (Generate OTP)
  static async userLogin(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      logger.warn(`⚠️ Login attempt failed - Missing fields (email: ${email})`);
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required" });
    }

    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        logger.warn(`⚠️ Login failed - User not found (email: ${email})`);
        return res
          .status(401)
          .json({ status: "failed", message: "Invalid email or password" });
      }

      // Check password
      const isMatch = await comparePassword(password, user.u_password);
      if (!isMatch) {
        logger.warn(`⚠️ Login failed - Incorrect password (email: ${email})`);
        return res
          .status(401)
          .json({ status: "failed", message: "Invalid email or password" });
      }

      // Generate OTP
      const otp = generateOTP();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in DB
      await AuthModel.updateOTP(user.u_id, otp, otpExpiresAt);

      // Send OTP via email
      await sendOTPEmail(user.u_email, otp);
      logger.info(` OTP sent successfully to ${user.u_email}`);

      return res.status(200).json({
        status: "pending_otp",
        message: "OTP sent. Please verify.",
      });
    } catch (error) {
      logger.error(` Error during login for ${email}: ${error.message}`);
      return res
        .status(500)
        .json({ status: "failed", message: "Server error" });
    }
  }

  // Verify OTP & Generate JWT
  static async verifyOTP(req, res) {
    const { email, otp } = req.body;
    if (!email || !otp) {
      logger.warn(
        `⚠️ OTP verification failed - Missing fields (email: ${email})`,
      );
      return res
        .status(400)
        .json({ status: "failed", message: "Email and OTP are required" });
    }

    try {
      const user = await AuthModel.findByEmailAndOTP(email, otp);
      if (!user) {
        logger.warn(
          `⚠️ OTP verification failed - Invalid OTP (email: ${email})`,
        );
        return res
          .status(401)
          .json({ status: "failed", message: "Invalid or expired OTP" });
      }

      // Clear OTP
      await AuthModel.clearOTP(user.u_id);

      // Generate JWT
      const token = generateToken(user);

      // Set auth token in cookie
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      logger.info(` OTP verification successful - User logged in: ${email}`);

      return res.status(200).json({
        status: "success",
        message: "Login successful!",
        token,
      });
    } catch (error) {
      logger.error(` Error verifying OTP for ${email}: ${error.message}`);
      return res
        .status(500)
        .json({ status: "failed", message: "Server error" });
    }
  }
}

export default AuthController;
