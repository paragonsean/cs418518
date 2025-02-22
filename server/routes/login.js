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
  try {
    database.execute(
      "SELECT * FROM user WHERE u_email = ?",
      [req.body.u_email],
      function (err, result) {
        if (err || result.length === 0) {
          return res.status(401).json({
            status: 401,
            message: "Invalid email and password. Please try again.",
          });
        }

        const user = result[0];

        if (!comparePassword(req.body.u_password, user.u_password)) {
          return res.status(401).json({
            status: 401,
            message: "Invalid email and password. Please try again.",
          });
        }

        if (user.is_approved !== 1) {
          return res.status(403).json({
            status: 403,
            message: "Your account has not been approved by the admin yet.",
          });
        }

        // Generate JWT Token
        const token = jwt.sign(
          { userId: user.u_id, email: req.body.u_email, isAdmin: user.is_admin },
          process.env.TOKEN_SECRET_KEY,
          { expiresIn: "1h" }
        );

        // Generate OTP
        const oneTimePassword = generateRandomFiveDigitNumber();

        // Send Response with Token
        res.status(200).json({
          token, // ✅ Fix: Now correctly named
          user: {
            email: req.body.u_email,
            userId: user.u_id,
            verify: oneTimePassword,
            admin: user.is_admin,
          },
        });

        // Send OTP via Email
        sendEmail(user.u_email, "Login Verification", `Your one-time password is ${oneTimePassword}`);
      }
    );
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
