import winston from "winston";

// Configure logging format
const logFormat = winston.format.combine(winston.format.timestamp(), winston.format.printf(({
  timestamp,
  level,
  message
}) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
}));

// Create a logger instance
const logger = winston.createLogger({
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