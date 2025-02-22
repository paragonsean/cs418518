const fs = require("fs");
const path = require("path");

// Define log file location
const logFilePath = path.join(__dirname, "../logs/user_sessions.log");

// Ensure log directory exists
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

// Function to log login details
const logLogin = (userId, email, ip, userAgent, cookies, timestamp) => {
  const logEntry = `
  [LOGIN SESSION]
   User ID: ${userId}
   Email: ${email}
   IP Address: ${ip}
   User-Agent: ${userAgent}
   Cookies: ${JSON.stringify(cookies)}
   Timestamp: ${timestamp}
  --------------------------------------------
  `;

  // Append log entry to file
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) console.error("❌ Error writing to log file:", err);
  });
};

module.exports = { logLogin };
