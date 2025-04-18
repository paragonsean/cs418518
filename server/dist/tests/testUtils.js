"use strict";

// tests/utils/testUtils.js
var jwt = require("jsonwebtoken");
var TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY || "secretkeyappearshere";
var generateToken = function generateToken() {
  var role = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "user";
  var payload = {
    id: "2",
    email: "cos30degrees@gmail.com",
    role: role
  };
  return jwt.sign(payload, TOKEN_SECRET_KEY, {
    expiresIn: "1h"
  });
};
module.exports = {
  generateToken: generateToken
};