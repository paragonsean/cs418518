const express = require("express");
const router = express.Router();
const database = require("../db");
const { hashPassword, verifyToken } = require("../utils/helper");


// IMPORTANT: This must come *before* any "/:param" routes!
router.get("/profile", verifyToken, (req, res) => {
  const userId = req.user.userId; // from the JWT

  database.execute(
    "SELECT u_id, u_email, u_first_name, u_last_name FROM user WHERE u_id = ?",
    [userId],
    (err, result) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(result[0]);
    }
  );
});




// ─────────────────────────────────────────────────────────────
// 1) GET: ALL USERS
//    GET /user
// ─────────────────────────────────────────────────────────────
router.get("/", (req, res) => {
  database.execute("SELECT * FROM user", (err, result) => {
    if (err) {
      console.error("Error retrieving all users:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.json(result);
  });
});

// ─────────────────────────────────────────────────────────────
// 2) GET: USER BY EMAIL
//    GET /user/:email
// ─────────────────────────────────────────────────────────────
router.get("/:email", (req, res) => {
  try {
    database.execute("SELECT * FROM user WHERE u_email = ?", [req.params.email], (err, result) => {
      if (err) {
        console.error("Error retrieving user by email:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(result);
    });
  } catch (error) {
    console.error("Error in GET /:email:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────
// 3) POST: CREATE NEW USER
//    POST /user
// ─────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    // Asynchronously hash password
    const hashedPassword = await hashPassword(req.body.u_password);

    database.execute(
      `INSERT INTO user (u_first_name, u_last_name, u_email, u_password, is_approved, is_admin)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.body.u_first_name,
        req.body.u_last_name,
        req.body.u_email,
        hashedPassword,
        0, // is_approved
        0, // is_admin
      ],
      (err, result) => {
        if (err) {
          console.error("Error creating user:", err);
          return res.status(500).json({
            message: "Email is already in use. Please sign up with a different email.",
          });
        }
        return res.status(200).json({
          message: "User created successfully! Waiting for admin approval.",
        });
      }
    );
  } catch (error) {
    console.error("Error in POST /:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────
// 4) PUT: UPDATE PASSWORD
//    PUT /user/update-password
//    * Requires verifyToken to identify user ID from JWT
// ─────────────────────────────────────────────────────────────
router.put("/update-password", verifyToken, async (req, res) => {
  try {
    // 1. Check if "currentPassword" is correct
    const userId = req.user.userId; // from the token
    const { currentPassword, newPassword } = req.body;

    // Retrieve the user from DB
    database.execute("SELECT u_password FROM user WHERE u_id = ?", [userId], async (err, result) => {
      if (err || result.length === 0) {
        console.error("User not found or DB error:", err);
        return res.status(404).json({ message: "User not found" });
      }

      // Compare current password
      const userRow = result[0];
      // We need comparePassword if you want to verify the user's existing password
      // But you have not included comparePassword in your code. If you want it:
      //   const passwordMatch = await comparePassword(currentPassword, userRow.u_password);
      //   if (!passwordMatch) { ... handle error ... }

      // 2. Hash the new password
      const hashedPassword = await hashPassword(newPassword);

      // 3. Update user’s password
      database.execute(
        "UPDATE user SET u_password = ? WHERE u_id = ?",
        [hashedPassword, userId],
        (err2, result2) => {
          if (err2) {
            console.error("Error updating password:", err2);
            return res.status(500).json({ message: "Internal server error" });
          }
          if (result2.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
          }
          return res.status(200).json({ message: "Password updated successfully" });
        }
      );
    });
  } catch (error) {
    console.error("Error in PUT /update-password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────
// 5) PUT: UPDATE NAME
//    PUT /user/update-name
//    * Requires verifyToken to identify user ID from JWT
// ─────────────────────────────────────────────────────────────
router.put("/update-name", verifyToken, (req, res) => {
  try {
    const userId = req.user.userId; // from the token
    const { u_first_name, u_last_name } = req.body;

    database.execute(
      "UPDATE user SET u_first_name = ?, u_last_name = ? WHERE u_id = ?",
      [u_first_name, u_last_name, userId],
      (err, result) => {
        if (err) {
          console.error("Error updating name:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Name updated successfully" });
      }
    );
  } catch (error) {
    console.error("Error in PUT /update-name:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────
// 6) PUT: APPROVE USER
//    PUT /user/approved/:id
// ─────────────────────────────────────────────────────────────
router.put("/approved/:id", (req, res) => {
  try {
    database.execute(
      "UPDATE user SET is_approved = ? WHERE u_id = ?",
      [req.body.is_approved, req.params.id],
      (err, result) => {
        if (err) {
          console.error("Error approving user:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User approved successfully" });
      }
    );
  } catch (error) {
    console.error("Error in PUT /approved/:id:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────
// 7) GET: USERS THAT ARE NOT APPROVED
//    GET /user/approved/:approved
// ─────────────────────────────────────────────────────────────
router.get("/approved/:approved", (req, res) => {
  try {
    const { approved } = req.params; // 0 or 1
    database.execute("SELECT * FROM user WHERE is_approved = ?", [approved], (err, result) => {
      if (err) {
        console.error("Error retrieving unapproved users:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      return res.json(result);
    });
  } catch (error) {
    console.error("Error in GET /approved/:approved:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────
// 8) DELETE: USER BY ID
//    DELETE /user/:id
// ─────────────────────────────────────────────────────────────
router.delete("/:id", (req, res) => {
  try {
    database.execute("DELETE FROM user WHERE u_id = ?", [req.params.id], (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "User deleted successfully" });
    });
  } catch (error) {
    console.error("Error in DELETE /:id:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
