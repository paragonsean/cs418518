import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet"; // ⬅️ Add this

// Route imports
import userRoutes from "./routes/user_routes.js";
import courseRoutes from "./routes/course_routes.js";
import advisingRoutes from "./routes/advising_routes.js";
import completedCoursesRoutes from "./routes/completed_course_routes.js";
import adminRoutes from "./routes/admin_routes.js";

const app = express();
const port = process.env.PORT || 8000;

// 🛡️ Recommended security headers (including X-Frame-Options)
app.use(helmet.frameguard({ action: "deny" }));

// Parse and clean allowed origins from .env
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

console.log("🛡️ Allowed Origins for CORS:", allowedOrigins);

// ✅ Use cors with dynamic origin check
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // e.g., curl or mobile
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Middleware
app.use(cookieParser());
app.use(express.json());

// API routes
app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/advising", advisingRoutes);
app.use("/api/completed-courses", completedCoursesRoutes);
app.use("/api/admin", adminRoutes);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port} (${process.env.NODE_ENV || "development"})`);
});
