import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Route imports
import userRoutes from "./routes/user_routes.js";
import courseRoutes from "./routes/course_routes.js";
import advisingRoutes from "./routes/advising_routes.js";
import completedCoursesRoutes from "./routes/completed_course_routes.js";
var app = express();
var port = process.env.PORT || 8000;

// Parse and clean allowed origins from .env
var allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",").map(function (origin) {
  return origin.trim();
}).filter(Boolean);
console.log("🛡️ Allowed Origins for CORS:", allowedOrigins);

// ✅ Recommended: Use cors package with dynamic origin validation
app.use(cors({
  origin: function origin(_origin, callback) {
    if (!_origin) return callback(null, true); // allow requests like curl or mobile apps
    if (allowedOrigins.includes(_origin)) {
      return callback(null, true);
    } else {
      console.warn("❌ Blocked by CORS:", _origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true // ✅ Important: allow cookies
}));

// Other middleware
app.use(cookieParser());
app.use(express.json());

// API routes
app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/advising", advisingRoutes);
app.use("/api/completed-courses", completedCoursesRoutes);

// Boot the server
app.listen(port, function () {
  console.log("\uD83D\uDE80 Server listening on port ".concat(port, " (").concat(process.env.NODE_ENV || "development", ")"));
});