import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Route imports
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import advisingRoutes from "./routes/advisingRoutes.js";
import completedCoursesRoutes from "./routes/completedCoursesRoutes.js";

const app = express();
const port = process.env.PORT || 8000;

// Parse and clean allowed origins from .env
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

console.log("🛡️ Allowed Origins for CORS:", allowedOrigins);

// ✅ Recommended: Use cors package with dynamic origin validation
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow requests like curl or mobile apps
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // ✅ Important: allow cookies
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
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port} (${process.env.NODE_ENV || "development"})`);
});
