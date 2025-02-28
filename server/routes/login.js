const express = require("express");
const router = express.Router();
const database = require("../db");
const { comparePassword } = require("../utils/helper");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendmail");

function generateRandomFiveDigitNumber() {
  return Math.floor(10000 + Math.random() * 90000);
}

router.post("/", (req, res) => {
  const { u_email, u_password } = req.body;

  if (!u_email || !u_password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  database.execute(
    "SELECT * FROM user WHERE u_email = ?",
    [u_email],
    async function (err, result) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Internal server error." });
      }

      if (result.length === 0) {
        console.warn("❌ Login failed: Email not found");
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const user = result[0];

      // ✅ Check if password is correct
      const passwordMatch = await comparePassword(u_password, user.u_password);
      if (!passwordMatch) {
        console.warn("❌ Login failed: Incorrect password");
        return res.status(401).json({ message: "Invalid email or password." });
      }

      // ✅ Check if user is verified
      if (user.is_verified !== 1) {
        console.warn("🚨 Login blocked: User not verified");
        return res.status(403).json({ message: "Your account is awaiting email verification." });
      }

      // ✅ Generate JWT Token
      const token = jwt.sign(
        { userId: user.u_id, email: user.u_email, isAdmin: user.is_admin },
        process.env.TOKEN_SECRET_KEY,
        { expiresIn: "1h" }
      );

      // ✅ Generate verification_code for 2FA
      const oneTimePassword = generateRandomFiveDigitNumber();

      // ✅ Save verification_code to database
      database.execute(
        "UPDATE user SET verification_code = ? WHERE u_email = ?",
        [oneTimePassword, u_email],
        async (err, result) => {
          if (err) {
            console.error("Error saving verification_code:", err);
            return res.status(500).json({ message: "Internal server error." });
          }

          // ✅ Send verification_code via Email
          await sendEmail(user.u_email, "Login Verification", `Your one-time password is ${oneTimePassword}`);

          console.log("✅ Login successful, verification_code sent:", user.u_email);

          // ✅ Send Response with Token & verification_code
          return res.status(200).json({
            token, // Store this in localStorage
            user: {
              email: user.u_email,
              userId: user.u_id,
              admin: user.is_admin,
            },
          });
        }
      );
    }
  );
});
// ✅ POST: Verify OTP and Complete Login
//    POST /login/verify-otp
router.post("/verify-otp", (req, res) => {  // ✅ FIXED ROUTE NAME
  const { u_email, otp } = req.body;  // ✅ FIXED: Use "otp" instead of "verification_code"

  if (!u_email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  database.execute(
    "SELECT * FROM user WHERE u_email = ?",
    [u_email],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }

      const user = result[0];

      // ✅ Check if OTP matches
      if (user.verification_code !== otp) {
        console.warn("❌ OTP Verification failed: Incorrect OTP");
        return res.status(401).json({ message: "Invalid OTP. Please try again." });
      }

      // ✅ Clear OTP after verification
      database.execute(
        "UPDATE user SET verification_code = NULL WHERE u_email = ?",
        [u_email],
        (err, updateResult) => {
          if (err) {
            console.error("Error updating OTP status:", err);
            return res.status(500).json({ message: "Internal server error" });
          }

          console.log("✅ OTP Verified Successfully:", u_email);
          return res.status(200).json({ message: "OTP verified. Login successful!" });
        }
      );
    }
  );
});


module.exports = router;
