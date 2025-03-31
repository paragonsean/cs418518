import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import courseRoutes from "./routes/courseRoutes.js"; // Import classes routes
import advisingRoutes from "./routes/advisingRoutes.js";
import completedCoursesRoutes from "./routes/completedCoursesRoutes.js"; // Import completed courses routes
const app = express();
const port = process.env.PORT || 8000; // Fix: Use correct PORT for Express

app.use(cookieParser()); //  Parses cookies

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, //  Fix: Allow cookies and authentication
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//  Middleware
app.use(express.json());
app.use("/api/courses", courseRoutes); // Use classes routes
app.use("/api/completed-courses", completedCoursesRoutes); // Use completed courses routes
//  Load Routes (Pass MySQL Pool)
app.use("/api/user", userRoutes);
app.use("/api/advising", advisingRoutes);

//  Start Server
app.listen(port, () => {
  console.log(` Server listening at http://localhost:${port}`);
});
