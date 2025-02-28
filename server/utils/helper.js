const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const validator = require("validator"); // Import for password validation

const SALT_ROUNDS = 12; // Recommended salt rounds

/**
 * Validate password strength
 * @param {string} password - User password
 * @returns {boolean} - True if valid, False if weak
 */
function isStrongPassword(password) {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });
}

/**
 * Hash password securely with bcrypt
 * @param {string} password - Plaintext password
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
  if (!isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character."
    );
  }
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
  const token = req.cookies.auth_token; // Use HTTP-only cookies for security

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
}

// Define log file location
const logFilePath = path.join(__dirname, "../logs/user_sessions.log");

// Ensure log directory exists
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

/**
 * Log user login details securely
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} ip - IP address
 * @param {string} userAgent - User-Agent string
 * @param {object} cookies - User's cookies
 * @param {string} timestamp - Login timestamp
 */
const logLogin = (userId, email, ip, userAgent, cookies, timestamp) => {
  // Prevent logging sensitive cookie data
  const sanitizedCookies = { auth_token: "********" };

  const logEntry = `
  [LOGIN SESSION]
   User ID: ${userId}
   Email: ${email}
   IP Address: ${ip}
   User-Agent: ${userAgent}
   Cookies: ${JSON.stringify(sanitizedCookies)}
   Timestamp: ${timestamp}
  --------------------------------------------
  `;

  // Append log entry to file
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) console.error("Error writing to log file:", err);
  });
};

module.exports = { hashPassword, comparePassword, verifyToken, logLogin };
