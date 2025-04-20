import nodemailer from "nodemailer";
import crypto from "crypto";
import logger from "./my_logger.js";

// 🔐 Generate a secure 6-digit OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // "123456" → secure & random
};

// 📧 Send OTP Email
export const sendOTPEmail = async (email, otp) => {
  // Ensure env vars exist
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    const errorMsg = "Missing EMAIL_USER or EMAIL_PASS in environment variables";
    logger.error(`❌ ${errorMsg}`);
    throw new Error(errorMsg);
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail", // Or use `host` and `port` for non-Gmail
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"ODU Advising App" <${user}>`,
    to: email,
    subject: "🔐 Your One-Time Password (OTP)",
    text: `Hello,

Your One-Time Password (OTP) is: ${otp}

This OTP is valid for 10 minutes. Please do not share it with anyone.

Best,
ODU Advising System`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`📩 OTP email sent to ${email}`);
  } catch (error) {
    logger.error(`❌ Failed to send OTP email to ${email}: ${error.message}`);
    logger.error(error.stack);
    throw error; // Re-throw to allow upper-level error handling
  }
};
