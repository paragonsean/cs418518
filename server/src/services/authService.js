import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Hashes the user password securely
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10); //  Optimized
};

/**
 * Compares user-provided password with the stored hashed password
 */
export const comparePassword = async (enteredPassword, storedPassword) => {
  if (!storedPassword) return false; //  Prevent crashes if stored password is missing
  return await bcrypt.compare(enteredPassword, storedPassword);
};

/**
 * Generates JWT token with user details
 */
export const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.u_id || user.id, //  Support different user object formats
      email: user.email || user.u_email, //  Ensure email is always included
      role: user.role || "user" //  Default to "user" if role is missing
    },
    process.env.TOKEN_SECRET_KEY,
    { expiresIn: "7d" } //  Token lasts for 7 days
  );
};


/**
 * Verifies JWT token and handles errors gracefully
 */
export const verifyToken = (token) => {
  try {
    console.log("🔐 Verifying JWT Token:", token);
    return jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  } catch (error) {
    console.error("❌ JWT Verification Failed:", error.message);
    return null; //  Prevents app crashes on invalid tokens
  }
};

