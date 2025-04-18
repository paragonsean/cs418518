"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
var _nodemailer = _interopRequireDefault(require("nodemailer"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
_dotenv["default"].config();
var transporter = _nodemailer["default"].createTransport({
  host: GMAIL_SMTP_SERVER,
  port: process.env.EMAIL_PORT,
  secure: false,
  // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    // Admin Gmail ID
    pass: process.env.EMAIL_PASS // Admin Gmail Password
  }
});
var _default = exports["default"] = transporter;