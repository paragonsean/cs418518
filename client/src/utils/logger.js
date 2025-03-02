import pino from "pino";

const isProduction = process.env.NODE_ENV === "production" || false;

class Logger {
  constructor() {
    this.logger = pino({
      level: isProduction ? "info" : "debug",
      transport: !isProduction
        ? {
          target: "pino-pretty",
          options: { colorize: true },
        }
        : undefined, // JSON logs in production
    });

    this.logs = [];
  }

  /**
   * Generic log function
   */
  log(level, message, data = null) {
    if (isProduction && level === "debug") {return;} // Disable debug logs in production

    const logEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    this.logs.push(logEntry);
    if (this.logs.length > 100) {this.logs.shift();} // Keep log size manageable


  }

  info(message, data = null) {
    this.log("info", message, data);
  }

  warn(message, data = null) {
    this.log("warn", message, data);
  }

  error(message, data = null) {
    this.log("error", message, data);
  }

  debug(message, data = null) {
    this.log("debug", message, data);
  }

  /**
   * Send logs to an external monitoring service (e.g., Logflare, Datadog, Sentry)
   */
  async sendToServer(log) {
    if (isProduction) {
      try {
        await fetch("/api/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(log),
        });
      } catch (error) {
        this.logger.error("Failed to send log to server", error);
      }
    }
  }

  /**
   * Retrieve stored logs (for debugging)
   */
  getStoredLogs() {
    return this.logs;
  }

  /**
   * Clear stored logs (useful for testing)
   */
  clearLogs() {
    this.logs = [];
  }
}

const logger = new Logger();
export default logger;
