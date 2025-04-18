"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _helmet = _interopRequireDefault(require("helmet"));
var _user_routes = _interopRequireDefault(require("./routes/user_routes.js"));
var _course_routes = _interopRequireDefault(require("./routes/course_routes.js"));
var _advising_routes = _interopRequireDefault(require("./routes/advising_routes.js"));
var _completed_course_routes = _interopRequireDefault(require("./routes/completed_course_routes.js"));
var _admin_routes = _interopRequireDefault(require("./routes/admin_routes.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// server.js

_dotenv["default"].config();

// Route imports

var app = exports.app = (0, _express["default"])();
var port = process.env.PORT || 8000;

// 🛡️ Security headers to prevent clickjacking
app.use(_helmet["default"].frameguard({
  action: "deny"
}));

// Parse allowed CORS origins from env
var allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",").map(function (origin) {
  return origin.trim();
}).filter(Boolean);
console.log("🛡️ Allowed Origins for CORS:", allowedOrigins);
app.use((0, _cors["default"])({
  origin: function origin(_origin, callback) {
    if (!_origin) return callback(null, true); // curl/mobile/postman
    if (allowedOrigins.includes(_origin)) {
      return callback(null, true);
    } else {
      console.warn("❌ Blocked by CORS:", _origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Core middleware
app.use((0, _cookieParser["default"])());
app.use(_express["default"].json());

// API Routes
app.use("/api/user", _user_routes["default"]);
app.use("/api/courses", _course_routes["default"]);
app.use("/api/advising", _advising_routes["default"]);
app.use("/api/completed-courses", _completed_course_routes["default"]);
app.use("/api/admin", _admin_routes["default"]);

// 🟢 Start server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(port, function () {
    console.log("\uD83D\uDE80 Server listening on port ".concat(port, " (").concat(process.env.NODE_ENV || "development", ")"));
  });
}

// ✅ Export app for Supertest and testing