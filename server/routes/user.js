const express = require("express");
const router = express.Router();
const database = require("../db");
const { hashPassword } = require("../utils/helper");
const { sendVerificationEmail } = require("../utils/sendmail"); // Import email function

// Function to generate a 6-digit verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─────────────────────────────────────────────────────────────
// ✅ POST: Create New User (Signup)
//    POST /user
// ─────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { u_first_name, u_last_name, u_email, u_password } = req.body;

    if (!u_first_name || !u_last_name || !u_email || !u_password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await hashPassword(u_password);
    const verificationCode = generateVerificationCode(); // Generate unique code

    database.execute(
      "INSERT INTO user (u_first_name, u_last_name, u_email, u_password, is_approved, is_admin, is_verified, verification_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [u_first_name, u_last_name, u_email, hashedPassword, 0, 0, 0, verificationCode],
      async (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "The email is already in use." });
          }
          console.error("Database error:", err);
          return res.status(500).json({ message: "Internal server error" });
        }

        // ✅ Send verification email
        const emailResult = await sendVerificationEmail(u_email, verificationCode);

        if (!emailResult.success) {
          console.error("❌ Email failed:", emailResult.error);
          return res.status(500).json({ message: "User created but verification email failed." });
        }

        return res.status(201).json({ message: "User successfully created! Check your email for the verification code." });
      }
    );
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────
// ✅ POST: Verify User by Email
//    POST /user/verify
// ─────────────────────────────────────────────────────────────
router.post('/verify', async (req, res) => {
  const { u_email, verification_code } = req.body; // Use u_email for consistency

  if (!u_email || !verification_code) {
    return res.status(400).json({ message: "Email and verification code are required." });
  }

  try {
    const result = await database.execute(
      "SELECT * FROM user WHERE u_email = ? AND verification_code = ? AND is_verified = 0", // Check for unverified user
      [u_email, verification_code]
    );

    if (result[0].length === 0) { // No matching unverified user found
      return res.status(401).json({ message: "Invalid email or verification code." });
    }

    // Update user's verification status
    await database.execute(
      "UPDATE user SET is_verified = 1 WHERE u_email = ?",
      [u_email]
    );

    return res.status(200).json({ message: "User successfully verified!" });

  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
