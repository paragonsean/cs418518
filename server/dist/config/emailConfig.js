import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: GMAIL_SMTP_SERVER,
  port: process.env.EMAIL_PORT,
  secure: false,
  // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    // Admin Gmail ID
    pass: process.env.EMAIL_PASS // Admin Gmail Password
  }
});
export default transporter;