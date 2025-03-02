// file: controllers/AuthController.js
import {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken
  } from "../services/authService.js";
  
  import { generateOTP, sendOTPEmail } from "../services/otpService.js";
  import { sendVerificationEmail, sendResetPasswordEmail } from "../services/emailService.js";
  
  import UserModel from "../models/User.js";
  
  class AuthController {
    // 1️⃣ Register a New User
    static async register(req, res, pool) {
      const { firstName, lastName, email, password, password_confirmation } = req.body;
      if (!firstName || !lastName || !email || !password || !password_confirmation) {
        return res.status(400).json({ status: "failed", message: "All fields are required" });
      }
      if (password !== password_confirmation) {
        return res.status(400).json({ status: "failed", message: "Passwords do not match" });
      }
  
      try {
        // Check if user already exists
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
          return res.status(400).json({ status: "failed", message: "Email already exists" });
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
          verificationToken 
        });
  
        // Send verification email
        await sendVerificationEmail(email, verificationToken);
  
        return res.status(201).json({
          status: "success",
          message: "Registration successful! Check your email for verification."
        });
      } catch (error) {
        console.error("Error in registration:", error);
        return res.status(500).json({ status: "failed", message: "Server error" });
      }
    }
  
    // 2️⃣ Login (Generate OTP)
    static async userLogin(req, res, pool) {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ status: "failed", message: "All fields are required" });
      }
  
      try {
        const user = await UserModel.findByEmail(email);
        if (!user) {
          return res.status(401).json({ status: "failed", message: "Invalid email or password" });
        }
  
        // Check password
        const isMatch = await comparePassword(password, user.u_password);
        if (!isMatch) {
          return res.status(401).json({ status: "failed", message: "Invalid email or password" });
        }
  
        // Generate OTP
        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
        // Store OTP in DB
        await UserModel.updateOTP(user.u_id, otp, otpExpiresAt);
  
        // Send OTP via email
        await sendOTPEmail(user.u_email, otp);
  
        return res.status(200).json({
          status: "pending_otp",
          message: "OTP sent. Please verify."
        });
      } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ status: "failed", message: "Server error" });
      }
    }
  
    // 3️⃣ Verify OTP & Generate JWT
    static async verifyOTP(req, res, pool) {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ status: "failed", message: "Email and OTP are required" });
      }
  
      try {
        const user = await UserModel.findByEmailAndOTP(email, otp);
        if (!user) {
          return res.status(401).json({ status: "failed", message: "Invalid or expired OTP" });
        }
  
        // Clear OTP
        await UserModel.clearOTP(user.u_id);
  
        // Generate JWT
        const token = generateToken(user);
  
        // Set auth token in cookie
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
  
        return res.status(200).json({
          status: "success",
          message: "Login successful!",
          token
        });
      } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ status: "failed", message: "Server error" });
      }
    }
  
    // 4️⃣ Verify Email
    static async verifyEmail(req, res, pool) {
      const { token } = req.query;
      if (!token) {
        return res.status(400).json({ status: "failed", message: "Missing verification token" });
      }
  
      try {
        const decoded = verifyToken(token);
        if (!decoded || !decoded.email) {
          return res.status(400).json({ status: "failed", message: "Invalid or expired token" });
        }
  
        const { email } = decoded;
        const user = await UserModel.findByEmail(email);
        if (!user) {
          return res.status(400).json({ status: "failed", message: "Invalid or expired token" });
        }
  
        // Mark user as verified
        await UserModel.verifyUserEmail(email);
  
        return res.status(200).json({
          status: "success",
          message: "Email verified successfully!"
        });
      } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(400).json({ status: "failed", message: "Invalid or expired token" });
      }
    }
  
    // 5️⃣ Send Password Reset Email
    static async sendUserPasswordResetEmail(req, res, pool) {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ status: "failed", message: "Email is required" });
      }
  
      try {
        const user = await UserModel.findByEmail(email);
        if (!user) {
          return res.status(400).json({ status: "failed", message: "No account found with this email" });
        }
  
        // Generate Reset Token (1 hour)
        const resetToken = generateToken({ email }, "1h");
  
        // Optionally store resetToken in DB, or just email the JWT
        // e.g. await UserModel.updateVerificationToken(email, resetToken);
  
        // Send Email
        await sendResetPasswordEmail(email, resetToken);
  
        return res.status(200).json({
          status: "success",
          message: "Password reset email sent!"
        });
      } catch (error) {
        console.error("Error sending reset email:", error);
        return res.status(500).json({ status: "failed", message: "Server error" });
      }
    }
  
    // 6️⃣ Reset Password via Token
    static async resetPassword(req, res, pool) {
      const { token } = req.params;
      const { newPassword } = req.body;
  
      if (!token || !newPassword) {
        return res.status(400).json({
          status: "failed",
          message: "Token and new password are required"
        });
      }
  
      try {
        const decoded = verifyToken(token);
        if (!decoded || !decoded.email) {
          return res.status(400).json({
            status: "failed",
            message: "Invalid or expired token"
          });
        }
  
        const hashedPassword = await hashPassword(newPassword);
        await UserModel.updatePasswordByEmail(decoded.email, hashedPassword);
  
        return res.status(200).json({
          status: "success",
          message: "Password reset successfully!"
        });
      } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(400).json({ status: "failed", message: "Invalid or expired token" });
      }
    }
  }
  
  export default AuthController;
  