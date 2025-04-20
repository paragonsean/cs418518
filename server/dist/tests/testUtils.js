// tests/utils/testUtils.js
const jwt = require("jsonwebtoken");
const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY || "secretkeyappearshere";
const generateToken = (role = "user") => {
  const payload = {
    id: `2`,
    email: `cos30degrees@gmail.com`,
    role: role
  };
  return jwt.sign(payload, TOKEN_SECRET_KEY, {
    expiresIn: "1h"
  });
};
module.exports = {
  generateToken
};