const express = require("express");
const router = express.Router();
const database = require("../db");
const { comparePassword } = require("../utils/helper");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendmail");

function generateRandomFiveDigitNumber() {
  return Math.floor(10000 + Math.random() * 90000);
}

// Login Route
router.post("/", async (req, res) => {
  const { u_email, u_password } = req.body;

  if (!u_email || !u_password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const [result] = await database.execute("SELECT * FROM user WHERE u_email = ?", [u_email]);

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = result[0];

    // Check password
    const passwordMatch = await comparePassword(u_password, user.u_password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Check if user is verified
    if (user.is_verified !== 1) {
      return res.status(403).json({ message: "Your account is awaiting email verification." });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.u_id, email: user.u_email, isAdmin: user.is_admin },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Generate OTP (Valid for 10 minutes)
    const oneTimePassword = generateRandomFiveDigitNumber();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    await database.execute(
      "UPDATE user SET verification_code = ?, otp_expires_at = ? WHERE u_email = ?",
      [oneTimePassword, otpExpiresAt, u_email]
    );

    // Send OTP via email
    await sendEmail(user.u_email, "Login Verification", `Your OTP is ${oneTimePassword}`);

    // Store JWT in HttpOnly cookie
    res.cookie("myTokenName", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({
      message: "OTP sent to your email.",
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});
// POST: Verify OTP and Complete Login
router.post("/verify-otp", async (req, res) => {
  const { u_email, otp } = req.body;

  if (!u_email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  try {
    const [result] = await database.execute("SELECT * FROM user WHERE u_email = ?", [u_email]);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = result[0];

    // Check if OTP is correct
    if (user.verification_code !== parseInt(otp, 10)) {
      return res.status(401).json({ message: "Invalid OTP. Please try again." });
    }

    // Check if OTP has expired
    if (new Date(user.otp_expires_at) < new Date()) {
      return res.status(401).json({ message: "OTP expired. Please request a new one." });
    }

    // Clear OTP after verification
    await database.execute("UPDATE user SET verification_code = NULL, otp_expires_at = NULL WHERE u_email = ?", [u_email]);

    return res.status(200).json({ message: "OTP verified. Login successful!" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
