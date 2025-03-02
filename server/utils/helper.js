const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 12; // Recommended salt rounds

/**
 * Hash password securely with bcrypt
 * @param {string} password - Plaintext password
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Compare raw password with hashed password
 * @param {string} raw - Plaintext password
 * @param {string} hashedPassword - Hashed password from DB
 * @returns {Promise<boolean>} - True if passwords match
 */
async function comparePassword(raw, hashedPassword) {
  return bcrypt.compare(raw, hashedPassword);
}

/**
 * Middleware to verify JWT token
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
function verifyToken(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
}

module.exports = { hashPassword, comparePassword, verifyToken };
