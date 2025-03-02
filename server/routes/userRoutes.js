import express from "express";
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

import AuthController from "../controllers/authController.js";
const createUserRoutes = (pool) => {
  const router = express.Router();

  //  Public Routes (No Authentication Required)
  router.post("/register", (req, res) => AuthController.register(req, res, pool));
  router.post("/login", (req, res) => AuthController.userLogin(req, res, pool));
  router.post("/send-reset-password-email", (req, res) => AuthController.sendUserPasswordResetEmail(req, res, pool));
  router.post("/verify-otp", (req, res) => AuthController.verifyOTP(req, res, pool));
  router.get("/verify-email", (req, res) => AuthController.verifyEmail(req, res, pool)); //  Correct route
  router.post("/reset-password/:token", (req, res) => UserController.resetPassword(req, res, pool));

  //  Protected Routes (Require Auth Middleware)
  router.use("/changepassword", checkUserAuth(pool));
  router.use("/loggeduser", checkUserAuth(pool));

  router.post("/changepassword", (req, res) => UserController.changeUserPassword(req, res, pool));
  router.get("/loggeduser", (req, res) => UserController.loggedUser(req, res, pool));

  return router;
};

export default createUserRoutes;
