// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

// Route imports
import userRoutes from "./routes/user_routes.js";
import courseRoutes from "./routes/course_routes.js";
import advisingRoutes from "./routes/advising_routes.js";
import completedCoursesRoutes from "./routes/completed_course_routes.js";
import adminRoutes from "./routes/admin_routes.js";

const app = express();
const port = process.env.PORT || 8000;

// 🛡️ Security headers to prevent clickjacking
app.use(helmet.frameguard({ action: "deny" }));

// Parse allowed CORS origins from env
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

console.log("🛡️ Allowed Origins for CORS:", allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // curl/mobile/postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Core middleware
app.use(cookieParser());
app.use(express.json());

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/advising", advisingRoutes);
app.use("/api/completed-courses", completedCoursesRoutes);
app.use("/api/admin", adminRoutes);

// 🟢 Start server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port} (${process.env.NODE_ENV || "development"})`);
  });
}

// ✅ Export app for Supertest and testing
export { app };
