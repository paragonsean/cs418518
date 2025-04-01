import winston from "winston";

// Configure logging format
var logFormat = winston.format.combine(winston.format.timestamp(), winston.format.printf(function (_ref) {
  var timestamp = _ref.timestamp,
    level = _ref.level,
    message = _ref.message;
  return "[".concat(timestamp, "] ").concat(level.toUpperCase(), ": ").concat(message);
}));

// Create a logger instance
var logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [new winston.transports.Console(),
  // Logs to console
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error"
  }),
  // Logs errors to a file
  new winston.transports.File({
    filename: "logs/app.log"
  }) // Logs all messages to a file
  ]
});
export default logger;