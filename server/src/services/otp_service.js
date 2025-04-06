import nodemailer from "nodemailer";
import logger from "./my_logger.js"; //  Import logger

//  Generate a 6-digit OTP
export const generateOTP = () => {
  return "123456"; //  Replace with actual OTP generation logic
};

//  Send OTP via Email with Logging
export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your One-Time Password (OTP) is: ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`📩 OTP sent successfully to ${email}`); //  Log success
  } catch (error) {
    logger.error(` Error sending OTP email to ${email}: ${error.message}`); //  Log error
  }
};
