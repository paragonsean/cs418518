"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _winston = _interopRequireDefault(require("winston"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// Configure logging format
var logFormat = _winston["default"].format.combine(_winston["default"].format.timestamp(), _winston["default"].format.printf(function (_ref) {
  var timestamp = _ref.timestamp,
    level = _ref.level,
    message = _ref.message;
  return "[".concat(timestamp, "] ").concat(level.toUpperCase(), ": ").concat(message);
}));

// Create a logger instance
var logger = _winston["default"].createLogger({
  level: "info",
  format: logFormat,
  transports: [new _winston["default"].transports.Console(),
  // Logs to console
  new _winston["default"].transports.File({
    filename: "logs/error.log",
    level: "error"
  }),
  // Logs errors to a file
  new _winston["default"].transports.File({
    filename: "logs/app.log"
  }) // Logs all messages to a file
  ]
});
var _default = exports["default"] = logger;