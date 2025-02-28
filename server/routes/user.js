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
// ✅ PUT: Approve User by Email (After Email Verification)
//    PUT /user/approve
// ─────────────────────────────────────────────────────────────
router.put("/approve", (req, res) => {
  const { u_email, verification_code } = req.body;

  if (!u_email || !verification_code) {
    return res.status(400).json({ message: "Email and verification code are required." });
  }

  // ✅ Check if user exists and is waiting for approval
  database.execute(
    "SELECT * FROM user WHERE u_email = ? AND is_verified = 0",
    [u_email],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "User not found or already verified." });
      }

      const user = result[0];

      // ✅ Check if the verification code matches
      if (user.verification_code !== verification_code) {
        return res.status(401).json({ message: "Invalid verification code." });
      }

      // ✅ Approve the user
      database.execute(
        "UPDATE user SET is_verified = 1 WHERE u_email = ?",
        [u_email],
        (err, updateResult) => {
          if (err) {
            console.error("Error approving user:", err);
            return res.status(500).json({ message: "Internal server error" });
          }
          res.status(200).json({ message: "User successfully verified and approved!" });
        }
      );
    }
  );
});

module.exports = router;
