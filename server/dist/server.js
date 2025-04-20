// server.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

// Import DB functions: connect, pool check, AND the query executor
import { connectWithRetry, pool, executeQuery } from "./config/connectdb.js";

// Route imports
import userRoutes from "./routes/user_routes.js";
import courseRoutes from "./routes/course_routes.js";
import advisingRoutes from "./routes/advising_routes.js";
import completedCoursesRoutes from "./routes/completed_course_routes.js";
import adminRoutes from "./routes/admin_routes.js";
const app = express();
const port = process.env.PORT || 8000;

// --- Middleware Setup ---

// 🛡️ Security headers
app.use(helmet.frameguard({
  action: "deny"
}));
// Consider adding more general helmet middleware: app.use(helmet());

// Parse allowed CORS origins from env
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",").map(origin => origin.trim()).filter(Boolean);
console.log("🛡️ Allowed Origins for CORS:", allowedOrigins);
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) {
      // Handle case with no origins if needed for dev
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn("❌ Blocked by CORS:", origin);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true
}));

// Core middleware
app.use(cookieParser());
app.use(express.json());

// --- API Routes Setup ---
app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/advising", advisingRoutes);
app.use("/api/completed-courses", completedCoursesRoutes);
app.use("/api/admin", adminRoutes);

// --- Server Startup Function ---
const startServer = async () => {
  // Do not connect or start server in test environment automatically
  if (process.env.NODE_ENV === "test") {
    console.log(" MOCK DB: Skipping DB connection and server start in test environment.");
    return; // Exit startup function for tests
  }
  try {
    console.log(' MOCK DB: Attempting database connection before starting server...');
    await connectWithRetry(); // <<< WAIT FOR DB CONNECTION HERE
    console.log(' MOCK DB: Database connection successful.');

    // Sanity check - Use the named import 'pool'
    if (!pool) {
      console.error("CRITICAL ERROR: Database pool (named import) is still undefined after connectWithRetry completed!");
      throw new Error("Database pool initialization failed.");
    } else {
      console.log(" MOCK DB: Pool check successful after await.");

      // ************************************************
      // *** CORRECTED: Run startup query & log entries ***
      // ************************************************
      try {
        console.log(" MOCK DB: Running startup query on 'user' table...");
        // Select specific, non-sensitive columns and limit results
        const userSql = 'SELECT u_id, u_first_name, u_last_name, u_email FROM user LIMIT 5';

        // No parameters needed for this query
        const [userRows] = await executeQuery(userSql); // <<< No params passed
        console.log(` MOCK DB: Startup query successful. Found ${userRows.length} users.`);
        // Log the actual user data found
        console.log(" MOCK DB: First 5 user entries:", userRows); // <<< LOGGING ADDED/UNCOMMENTED
      } catch (queryError) {
        // Log the error but continue starting the server
        console.error("⚠️ MOCK DB: Failed to run startup query on 'user' table:", queryError.message);
      }
      // ************************************************
      // *** END CORRECTED CODE *************************
      // ************************************************
    }

    // Start listening only AFTER the database is connected (and startup query attempted)
    app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port} (${process.env.NODE_ENV || "development"})`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to the database during startup. Server not started.', error);
    process.exit(1); // Exit if DB connection fails critically
  }
};

// --- Run the Startup ---
startServer(); // Call the async function to start the process

// ✅ Export app for Supertest and testing (remains available synchronously)
export { app };